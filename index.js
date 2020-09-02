#!/usr/bin/env node

const fs = require('fs');
const cp = require('child_process');
const yargs = require('yargs');
const chalk = require('chalk');

const argv = yargs.command('newl', 'Add newline at the end of file')
  .option('suffix', {
    alias: 's',
    type: 'string',
    description: 'The suffix of files(split with commas)',
    default: 'js'
  })
  .option('test', {
    alias: 't',
    type: 'bool',
    description: 'Show the target files'
  })
  .argv;

const log = (text, color = 'blue') => {
  console.log(chalk[color](text));
}
const addNewline = (suffix, add) => {
  suffix = suffix.trim();
  const cwd = process.cwd();
  const cmd = `find ${cwd} -type f -name '*.${suffix}'`;
  const data = cp.execSync(cmd);
  const files = data.toString().split('\n').filter(item => !!item);
  const targets = files.filter(file => {
    let content = fs.readFileSync(file).toString();
    if (content.charAt(content.length - 1) !== '\n') {
      if (add) {
        fs.writeFileSync(file, content + '\n')
      }
      return true;
    }
  });
  if (targets.length) {
    log(`Find no newline at end of *.${suffix} files:`, 'red');
    log(targets.join('\n'));
    console.log('');
  }
  else {
    log(`No *.${suffix} file found.`, 'green');
  }
};

const suffix = argv.suffix.split(',');
const test = argv.test;

suffix.forEach(s => addNewline(s, !test));

process.exit();
