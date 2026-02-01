/**
 * x402 Endpoint Payment Client
 *
 * Pays an x402-protected endpoint from the command line.
 * Handles the full flow: detect 402 → build transaction → sign → pay → get response.
 */

import chalk from 'chalk';
import ora from 'ora';
import { Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';
import { x402Client, wrapFetchWithPayment, decodePaymentResponseHeader } from '@rvk_rishikesh/fetch';
import { registerExactAptosScheme } from '@rvk_rishikesh/aptos/exact/client';
import fs from 'fs';
import path from 'path';

/**
 * Try to load a private key from various sources
 * Priority: --key flag > environment variable > .env.local file
 */
function resolvePrivateKey(keyFlag) {
  // 1. Direct key from --key flag
  if (keyFlag) {
    return keyFlag;
  }

  // 2. Environment variable
  if (process.env.NEXT_PUBLIC_APTOS_PRIVATE_KEY) {
    return process.env.NEXT_PUBLIC_APTOS_PRIVATE_KEY;
  }

  // 3. Try to read from .env.local in current directory
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/NEXT_PUBLIC_APTOS_PRIVATE_KEY\s*=\s*(.+)/);
    if (match) {
      return match[1].trim();
    }
  }

  return null;
}

/**
 * Pay an x402-protected endpoint
 * @param {string} url - The URL to pay and fetch
 * @param {object} options - Command options
 * @param {string} [options.key] - Private key (hex)
 * @param {string} [options.method] - HTTP method (default: GET)
 * @param {string} [options.data] - Request body for POST/PUT
 */
export async function payEndpoint(url, options = {}) {
  console.log(chalk.green.bold('\n💸 x402 Payment Client\n'));
  console.log(chalk.cyan(`Target: ${url}\n`));

  // Step 1: Resolve private key
  const privateKeyHex = resolvePrivateKey(options.key);

  if (!privateKeyHex) {
    console.log(chalk.red('  No private key found.\n'));
    console.log(chalk.yellow('  Provide a key using one of these methods:\n'));
    console.log(chalk.white('    1. --key flag:    buildx402 pay <url> --key 0xYOUR_KEY'));
    console.log(chalk.white('    2. Env variable:  export NEXT_PUBLIC_APTOS_PRIVATE_KEY=0xYOUR_KEY'));
    console.log(chalk.white('    3. .env.local:    Add NEXT_PUBLIC_APTOS_PRIVATE_KEY=0xYOUR_KEY to .env.local\n'));
    console.log(chalk.gray('  Generate a wallet:  npx buildx402 wallet create\n'));
    process.exit(1);
  }

  // Step 2: Initialize wallet
  const walletSpinner = ora('Initializing wallet...').start();

  let account;
  try {
    const cleanKey = privateKeyHex.startsWith('0x')
      ? privateKeyHex.slice(2)
      : privateKeyHex;

    const privateKey = new Ed25519PrivateKey(cleanKey);
    account = Account.fromPrivateKey({ privateKey });
    walletSpinner.succeed(chalk.green(`Wallet loaded: ${account.accountAddress.toString().slice(0, 10)}...${account.accountAddress.toString().slice(-6)}`));
  } catch (err) {
    walletSpinner.fail(chalk.red('Failed to load wallet'));
    console.log(chalk.red(`\n  Error: ${err.message}`));
    console.log(chalk.yellow('\n  Make sure your private key is a valid hex string.\n'));
    process.exit(1);
  }

  // Step 3: Initialize x402 client
  const clientSpinner = ora('Setting up x402 client...').start();

  let fetchWithPayment;
  try {
    const client = new x402Client();
    registerExactAptosScheme(client, { signer: account });
    fetchWithPayment = wrapFetchWithPayment(fetch, client);
    clientSpinner.succeed(chalk.green('x402 client ready'));
  } catch (err) {
    clientSpinner.fail(chalk.red('Failed to initialize x402 client'));
    console.log(chalk.red(`\n  Error: ${err.message}\n`));
    process.exit(1);
  }

  // Step 4: Make the payment request
  const paySpinner = ora('Sending request (will auto-pay if 402)...').start();

  try {
    const method = (options.method || 'GET').toUpperCase();
    const fetchOptions = {
      method,
      headers: { 'Accept': 'application/json' },
    };

    if (options.data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.headers['Content-Type'] = 'application/json';
      fetchOptions.body = options.data;
    }

    const response = await fetchWithPayment(url, fetchOptions);

    paySpinner.stop();

    // Display status
    console.log('');
    console.log(chalk.white('  ' + '─'.repeat(60)));

    if (response.ok) {
      console.log(chalk.green.bold(`\n  ✅ Status: ${response.status} ${response.statusText}\n`));
    } else {
      console.log(chalk.red.bold(`\n  ❌ Status: ${response.status} ${response.statusText}\n`));
    }

    // Extract transaction hash from payment response header
    const paymentResponseHeader = response.headers.get('payment-response');
    if (paymentResponseHeader) {
      try {
        const decoded = decodePaymentResponseHeader(paymentResponseHeader);
        const txHash = decoded?.transaction || decoded?.txHash;

        if (txHash) {
          console.log(chalk.white('  ' + '─'.repeat(60)));
          console.log(chalk.green.bold('\n  Payment Receipt:\n'));
          console.log(chalk.cyan('  Transaction:   ') + chalk.white(txHash));
          console.log(chalk.cyan('  Explorer:      ') + chalk.white(`https://explorer.aptoslabs.com/txn/${txHash}?network=testnet`));
          console.log('');
        }
      } catch (e) {
        // Payment went through but couldn't parse receipt — that's okay
      }
    }

    // Display response body
    console.log(chalk.white('  ' + '─'.repeat(60)));
    console.log(chalk.green.bold('\n  Response:\n'));

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      const formatted = JSON.stringify(data, null, 2);
      formatted.split('\n').forEach(line => {
        console.log(chalk.white('  ' + line));
      });
    } else {
      const text = await response.text();
      text.split('\n').slice(0, 50).forEach(line => {
        console.log(chalk.white('  ' + line));
      });
      if (text.split('\n').length > 50) {
        console.log(chalk.gray('  ... (truncated)'));
      }
    }

    console.log(chalk.white('\n  ' + '─'.repeat(60)));
    console.log(chalk.green('\n  Done.\n'));

  } catch (error) {
    paySpinner.fail(chalk.red('Request failed'));
    console.log(chalk.red(`\n  Error: ${error.message}`));

    if (error.message?.includes('402')) {
      console.log(chalk.yellow('\n  The payment could not be completed.'));
      console.log(chalk.yellow('  Check that your wallet has enough USDC and APT for gas.\n'));
      console.log(chalk.gray('  Fund your wallet:'));
      console.log(chalk.gray('    APT:  https://aptos.dev/en/network/faucet'));
      console.log(chalk.gray('    USDC: https://faucet.circle.com/\n'));
    } else if (error.cause?.code === 'ECONNREFUSED') {
      console.log(chalk.yellow('\n  Could not connect to the endpoint.'));
      console.log(chalk.yellow('  Make sure the server is running and the URL is correct.\n'));
    } else {
      console.log(chalk.yellow('\n  Troubleshooting:'));
      console.log(chalk.gray('    • Check the URL is correct'));
      console.log(chalk.gray('    • Ensure your wallet has funds'));
      console.log(chalk.gray('    • Verify the endpoint supports x402\n'));
    }

    process.exit(1);
  }
}
