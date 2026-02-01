#!/usr/bin/env node

/**
 * buildx402 CLI
 *
 * The Swiss Army knife for x402 on Aptos.
 *
 * Usage:
 *   npx buildx402 <app-name>          Scaffold a new x402 app
 *   npx buildx402 wallet create       Generate a new Aptos wallet
 *   npx buildx402 inspect <url>       Inspect an x402-protected endpoint
 *   npx buildx402 pay <url>           Pay and fetch an x402-protected endpoint
 */

import { Command } from 'commander';
import { initApp } from '../src/commands.js';
import { createWallet } from '../src/wallet.js';
import { inspectEndpoint } from '../src/inspect.js';
import { payEndpoint } from '../src/pay.js';
import chalk from 'chalk';

const program = new Command();

program
  .name('buildx402')
  .description('The Swiss Army knife for x402 on Aptos — scaffold, inspect, and pay')
  .version('3.0.0');

// Main command: npx buildx402 <app-name>
program
  .argument('[app-name]', 'Name of your application')
  .action(async (appName) => {
    if (!appName) {
      console.log(chalk.green.bold('\n⚡ buildx402 — x402 Developer Toolkit ⚡\n'));
      console.log(chalk.cyan('Commands:\n'));
      console.log(chalk.white('  buildx402 <app-name>          Scaffold a new x402 app'));
      console.log(chalk.white('  buildx402 wallet create       Generate a new Aptos wallet'));
      console.log(chalk.white('  buildx402 inspect <url>       Inspect an x402 endpoint'));
      console.log(chalk.white('  buildx402 pay <url>           Pay and fetch an x402 endpoint'));
      console.log(chalk.gray('\nExamples:\n'));
      console.log(chalk.gray('  npx buildx402 my-app'));
      console.log(chalk.gray('  npx buildx402 inspect https://my-api.com/api/data'));
      console.log(chalk.gray('  npx buildx402 pay https://my-api.com/api/data --key 0xYOUR_KEY\n'));
      process.exit(0);
    }
    await initApp(appName);
  });

// Wallet command
program
  .command('wallet')
  .description('Wallet management utilities')
  .argument('<action>', 'create - Generate a new Aptos wallet')
  .action(async (action) => {
    if (action === 'create') {
      await createWallet();
    } else {
      console.log(chalk.red(`Unknown wallet action: ${action}`));
      console.log(chalk.yellow('Available actions: create'));
      process.exit(1);
    }
  });

// Inspect command
program
  .command('inspect')
  .description('Inspect an x402-protected endpoint to see payment requirements')
  .argument('<url>', 'The URL to inspect')
  .action(async (url) => {
    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    await inspectEndpoint(url);
  });

// Pay command
program
  .command('pay')
  .description('Pay and fetch an x402-protected endpoint')
  .argument('<url>', 'The URL to pay and fetch')
  .option('-k, --key <private-key>', 'Aptos private key (hex)')
  .option('-m, --method <method>', 'HTTP method (GET, POST, etc.)', 'GET')
  .option('-d, --data <body>', 'Request body (for POST/PUT)')
  .action(async (url, options) => {
    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    await payEndpoint(url, options);
  });

program.parse();
