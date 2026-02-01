#!/usr/bin/env node

/**
 * create-x402-app CLI
 *
 * Scaffolds x402 payment-gated Next.js applications on Aptos blockchain.
 *
 * Usage:
 *   npx create-x402-app <app-name>
 *   npx create-x402-app wallet create
 */

import { Command } from 'commander';
import { initApp } from '../src/commands.js';
import { createWallet } from '../src/wallet.js';
import chalk from 'chalk';

const program = new Command();

program
  .name('buildx402')
  .description('Scaffold x402 payment-gated Next.js apps on Aptos')
  .version('2.0.8');

// Main command: npx buildx402 <app-name>
program
  .argument('[app-name]', 'Name of your application')
  .action(async (appName) => {
    if (!appName) {
      console.log(chalk.yellow('\nUsage: npx buildx402 <app-name>'));
      console.log(chalk.yellow('   or: npx buildx402 wallet create\n'));
      process.exit(1);
    }
    await initApp(appName);
  });

// Wallet command: npx create-x402-app wallet create
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

program.parse();
