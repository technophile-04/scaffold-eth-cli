#!/usr/bin/env node

const local = require('../package.json')
const { Command } = require('commander')
const { spawn } = require('child_process')
const program = new Command()

program
  .name(local.name)
  .description(local.description)
  .version(local.version)
  .option('-dir, --directory <name>', 'the name of the new directory to clone into')
  .option('--https', 'clones scaffold-eth over https instead of the default (ssh)')

program.parse()

const options = program.opts()

const commandArray = ['clone']
const sshUrl = 'git@github.com:scaffold-eth/scaffold-eth.git'
const httpsUrl = 'https://github.com/scaffold-eth/scaffold-eth.git'
commandArray.push(options.https ? httpsUrl : sshUrl)

if (options.directory !== undefined) {
  commandArray.push(options.directory)
}

commandArray.push('--depth', '1')

const child = spawn('git', commandArray, { stdio: 'inherit' })

child.on('close', (code) => {
  if (code !== 0) {
    console.warn(`Cloning via ${options.https ? 'https' : 'ssh'} failed... trying with ${options.https ? 'ssh' : 'https'}`)
    commandArray[1] = options.https ? sshUrl : httpsUrl
    const child = spawn('git', commandArray, { stdio: 'inherit' })
    child.on('close', (code) => {
      process.exit(code)
    })
  }
})
