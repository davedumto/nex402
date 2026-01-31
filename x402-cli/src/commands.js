/**
 * CLI Commands Implementation
 */

import degit from 'degit';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';

/**
 * Initialize a new x402 app by cloning the template
 * @param {string} appName - Name of the application directory
 */
export async function initApp(appName) {
  console.log(chalk.green.bold('\n⚡ x402 builder ⚡\n'));
  console.log(chalk.cyan(`Creating new x402 app: ${appName}\n`));

  const spinner = ora('Downloading template...').start();

  try {
    // Repository source - can be GitHub URL or local path
    // For GitHub: 'username/repo#branch'
    // For local testing: Use environment variable X402_TEMPLATE_PATH
    const templateSource = process.env.X402_TEMPLATE_PATH || 'davedumto/nex402#main';

    // Use degit to clone the template
    const emitter = degit(templateSource, {
      cache: false,
      force: true,
      verbose: false,
    });

    // Clone to the target directory
    await emitter.clone(appName);

    spinner.succeed(chalk.green('Template downloaded!'));

    // Post-clone setup
    const setupSpinner = ora('Setting up project...').start();

    // Remove x402-cli folder from the cloned template (meta recursion prevention)
    const cliPath = path.join(process.cwd(), appName, 'x402-cli');
    if (fs.existsSync(cliPath)) {
      fs.rmSync(cliPath, { recursive: true, force: true });
    }

    setupSpinner.succeed(chalk.green('Project setup complete!'));

    // Success message
    console.log(chalk.green.bold('\n✅ Success! Your x402 app is ready.\n'));
    console.log(chalk.cyan('Next steps:\n'));
    console.log(chalk.white(`  cd ${appName}`));
    console.log(chalk.white('  npm install'));
    console.log(chalk.white('  npx buildx402 wallet create  # Generate a wallet'));
    console.log(chalk.white('  # Copy the env vars to .env.local'));
    console.log(chalk.white('  npm run dev\n'));

    console.log(chalk.gray('Documentation: https://github.com/davedumto/nex402'));
    console.log(chalk.gray('Protocol: https://github.com/rvk-utd/x402\n'));

  } catch (error) {
    spinner.fail(chalk.red('Failed to create app'));
    console.error(chalk.red('\nError:'), error.message);

    if (error.code === 'DEST_NOT_EMPTY') {
      console.log(chalk.yellow(`\nDirectory "${appName}" already exists. Please choose a different name or delete the existing directory.\n`));
    } else {
      console.log(chalk.yellow('\nTroubleshooting:'));
      console.log(chalk.gray('• Make sure you have internet connection'));
      console.log(chalk.gray('• Check if the repository URL is correct'));
      console.log(chalk.gray('• Try again in a few moments\n'));
    }

    process.exit(1);
  }
}
