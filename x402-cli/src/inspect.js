/**
 * x402 Endpoint Inspector
 *
 * Hits any URL and parses the 402 Payment Required response
 * to display payment requirements in a human-readable format.
 */

import chalk from 'chalk';
import ora from 'ora';

/**
 * Try to find and parse payment requirements from various sources
 * (headers, body, etc.) since different x402 implementations put them in different places.
 */
function extractPaymentRequirements(response, body) {
  // Check common x402 header locations
  const headerNames = [
    'x-payment',
    'x-payment-requirements',
    'payment-requirements',
    'x-402-payment',
    'www-authenticate',
  ];

  // Also scan ALL headers for anything payment/x402 related
  const allHeaders = {};
  response.headers.forEach((value, key) => {
    allHeaders[key] = value;
  });

  // Try to find payment data in headers
  for (const name of headerNames) {
    const value = response.headers.get(name);
    if (value) {
      try {
        return { source: `header: ${name}`, data: JSON.parse(value) };
      } catch {
        // Some headers might be base64 encoded
        try {
          const decoded = JSON.parse(Buffer.from(value, 'base64').toString('utf-8'));
          return { source: `header: ${name} (base64)`, data: decoded };
        } catch {
          // Not JSON — store raw value
          return { source: `header: ${name}`, data: { raw: value } };
        }
      }
    }
  }

  // Check for any header containing "402", "payment", or "x402" in its name
  for (const [key, value] of Object.entries(allHeaders)) {
    if (key.includes('402') || key.includes('payment') || key.includes('x402')) {
      try {
        return { source: `header: ${key}`, data: JSON.parse(value) };
      } catch {
        try {
          const decoded = JSON.parse(Buffer.from(value, 'base64').toString('utf-8'));
          return { source: `header: ${key} (base64)`, data: decoded };
        } catch {
          // continue
        }
      }
    }
  }

  // Fall back to body if it has meaningful data
  if (body && typeof body === 'object' && Object.keys(body).length > 0) {
    return { source: 'body', data: body };
  }

  // Return all headers so the user can debug
  return { source: 'none', data: null, headers: allHeaders };
}

/**
 * Display parsed payment requirements in a nice format
 */
function displayPaymentInfo(url, data, source) {
  console.log(chalk.green.bold('  x402 Endpoint Detected!\n'));
  console.log(chalk.white('  ' + '─'.repeat(60)));
  console.log(chalk.cyan('  URL:           ') + chalk.white(url));
  console.log(chalk.cyan('  Source:        ') + chalk.gray(source));

  // Handle different response structures
  // The data could be the full response or just the accepts array
  let accepts = null;
  let meta = {};

  if (Array.isArray(data)) {
    // Data is directly an array of payment options
    accepts = data;
  } else if (data?.accepts && Array.isArray(data.accepts)) {
    accepts = data.accepts;
    meta = data;
  } else if (data?.paymentRequirements) {
    // Some implementations nest under paymentRequirements
    const pr = data.paymentRequirements;
    if (Array.isArray(pr)) {
      accepts = pr;
    } else if (pr.accepts) {
      accepts = pr.accepts;
      meta = pr;
    }
  }

  // Display metadata — check both top-level and nested resource object
  if (meta.x402Version !== undefined) {
    console.log(chalk.cyan('  x402 Version:  ') + chalk.white(meta.x402Version));
  }
  const description = meta.description || meta.resource?.description;
  if (description) {
    console.log(chalk.cyan('  Description:   ') + chalk.white(description));
  }
  const mimeType = meta.mimeType || meta.resource?.mimeType;
  if (mimeType) {
    console.log(chalk.cyan('  Content Type:  ') + chalk.white(mimeType));
  }

  if (accepts && accepts.length > 0) {
    console.log(chalk.white('\n  ' + '─'.repeat(60)));
    console.log(chalk.green.bold(`\n  Payment Options (${accepts.length}):\n`));

    accepts.forEach((option, index) => {
      if (accepts.length > 1) {
        console.log(chalk.yellow(`  --- Option ${index + 1} ---`));
      }

      if (option.scheme) {
        console.log(chalk.cyan('  Scheme:        ') + chalk.white(option.scheme));
      }

      // Price: handle amount (atomic units), maxAmountRequired, or price (human-readable)
      const rawAmount = option.amount ?? option.maxAmountRequired;
      if (rawAmount !== undefined) {
        const decimals = option.extra?.decimals || option.resource?.decimals || 6;
        const symbol = option.extra?.symbol || option.resource?.symbol || 'USDC';
        const humanAmount = Number(rawAmount) / Math.pow(10, decimals);

        if (humanAmount > 0 && humanAmount < 1000000) {
          console.log(chalk.cyan('  Price:         ') + chalk.green.bold(`${humanAmount} ${symbol}`));
          console.log(chalk.cyan('  Raw Amount:    ') + chalk.gray(`${rawAmount} atomic units`));
        } else {
          console.log(chalk.cyan('  Amount:        ') + chalk.white(`${rawAmount} atomic units`));
        }
      } else if (option.price !== undefined) {
        const symbol = option.extra?.symbol || 'USDC';
        console.log(chalk.cyan('  Price:         ') + chalk.green.bold(`${option.price} ${symbol}`));
      }

      if (option.network) {
        const networkName = option.network === 'aptos:2' ? 'Aptos Testnet'
          : option.network === 'aptos:1' ? 'Aptos Mainnet'
          : option.network;
        console.log(chalk.cyan('  Network:       ') + chalk.white(networkName));
      }

      if (option.payTo) {
        console.log(chalk.cyan('  Pay To:        ') + chalk.white(option.payTo));
      }

      if (option.resource?.address || option.asset) {
        const asset = option.resource?.address || option.asset;
        console.log(chalk.cyan('  Asset:         ') + chalk.gray(asset));
      }

      if (option.maxTimeoutSeconds) {
        console.log(chalk.cyan('  Timeout:       ') + chalk.white(`${option.maxTimeoutSeconds}s`));
      }

      // Show extra fields (skip ones we already displayed)
      if (option.extra) {
        const skipKeys = ['symbol', 'decimals'];
        const extraKeys = Object.keys(option.extra).filter(k => !skipKeys.includes(k));
        extraKeys.forEach(k => {
          const label = k.charAt(0).toUpperCase() + k.slice(1);
          console.log(chalk.cyan(`  ${label}:`) + ' '.repeat(Math.max(1, 13 - label.length)) + chalk.white(String(option.extra[k])));
        });
      }

      console.log('');
    });
  } else {
    // No structured accepts — dump the raw data for debugging
    console.log(chalk.yellow('\n  Payment structure not recognized. Raw data:\n'));
    const formatted = JSON.stringify(data, null, 2);
    formatted.split('\n').forEach(line => {
      console.log(chalk.gray('  ' + line));
    });
    console.log('');
  }

  console.log(chalk.white('  ' + '─'.repeat(60)));
}

/**
 * Inspect an x402-protected endpoint
 * @param {string} url - The URL to inspect
 */
export async function inspectEndpoint(url) {
  console.log(chalk.green.bold('\n🔍 x402 Endpoint Inspector\n'));
  console.log(chalk.cyan(`Target: ${url}\n`));

  const spinner = ora('Probing endpoint...').start();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    spinner.stop();

    // Not a 402 — endpoint isn't x402-protected
    if (response.status !== 402) {
      console.log(chalk.yellow(`\n  Status: ${response.status} ${response.statusText}`));
      console.log(chalk.yellow('\n  This endpoint is not x402-protected (no 402 response).'));

      if (response.ok) {
        console.log(chalk.green('\n  The endpoint is publicly accessible — no payment required.\n'));
      } else {
        console.log(chalk.red(`\n  The endpoint returned an error (${response.status}).\n`));
      }
      return;
    }

    // Parse body (might be empty)
    let body = {};
    try {
      const text = await response.text();
      if (text.trim()) {
        body = JSON.parse(text);
      }
    } catch {
      // Body isn't JSON — that's fine, we'll check headers
    }

    // Extract payment requirements from headers or body
    const result = extractPaymentRequirements(response, body);

    if (result.data) {
      displayPaymentInfo(url, result.data, result.source);
    } else {
      // Couldn't find structured payment data anywhere
      console.log(chalk.green.bold('  x402 Endpoint Detected!\n'));
      console.log(chalk.white('  ' + '─'.repeat(60)));
      console.log(chalk.cyan('  URL:           ') + chalk.white(url));
      console.log(chalk.cyan('  Status:        ') + chalk.white('402 Payment Required'));
      console.log(chalk.yellow('\n  Could not parse payment requirements.'));
      console.log(chalk.yellow('  The endpoint returned 402 but the payment details'));
      console.log(chalk.yellow('  could not be extracted automatically.\n'));

      // Show all headers to help debug
      if (result.headers && Object.keys(result.headers).length > 0) {
        console.log(chalk.cyan('  Response Headers:\n'));
        for (const [key, value] of Object.entries(result.headers)) {
          const display = value.length > 80 ? value.slice(0, 80) + '...' : value;
          console.log(chalk.gray(`    ${key}: ${display}`));
        }
      }

      console.log(chalk.white('\n  ' + '─'.repeat(60)));
    }

    console.log(chalk.green('\n  Inspection complete.\n'));

  } catch (error) {
    spinner.fail(chalk.red('Failed to inspect endpoint'));

    if (error.cause?.code === 'ECONNREFUSED') {
      console.log(chalk.red('\n  Could not connect to the endpoint.'));
      console.log(chalk.yellow('  Make sure the server is running and the URL is correct.\n'));
    } else if (error.cause?.code === 'ENOTFOUND') {
      console.log(chalk.red('\n  DNS lookup failed — host not found.'));
      console.log(chalk.yellow('  Check the URL and your internet connection.\n'));
    } else {
      console.log(chalk.red(`\n  Error: ${error.message}\n`));
    }

    process.exit(1);
  }
}
