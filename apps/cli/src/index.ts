#!/usr/bin/env node
import { program } from 'commander'
import { creation } from './commands'
import { version } from '../package.json'
import chalk from 'chalk'

program.version(version)

program
  .command('create')
  .alias('cr')
  .option('-n, --name <name>', 'name of the file')
  .option('-d, --dir <dir>', 'dir to create')
  .option('-e, --ext <ext>', 'extension of the file')
  .description('create an utility: service, controller, model')
  .action(async ({ name, dir, ext }) => {
    if (ext !== undefined && !['ts', 'js'].includes(ext)) {
      console.log(chalk.red('extension must be js or ts'))
      return
    }
    await creation({ name, dir, ext })
  })

program.parse(process.argv)
