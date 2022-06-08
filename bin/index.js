#!/usr/bin/env node

const package = require('../package.json');
const { Command } = require('commander');
const { spawn } = require('child_process');
const program = new Command();

program
  .name(package.name)
  .description(package.description)
  .version(package.version);

program.parse();

const child = spawn('git', ['clone', 'git@github.com:scaffold-eth/scaffold-eth.git', '--depth', '1'], { stdio: 'inherit'});

child.on('close', (code) => {
  process.exit(code);
});
