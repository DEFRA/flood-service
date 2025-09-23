#!/usr/bin/env node

const fs = require('fs')
const nunjucks = require('nunjucks')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const options = yargs(hideBin(process.argv))
  .option('f', {
    alias: 'file',
    describe: 'Input file path',
    demandOption: true,
    type: 'string'
  })
  .option('o', {
    alias: 'output',
    describe: 'Output file',
    demandOption: true,
    type: 'string'
  })
  .option('d', {
    alias: 'date',
    describe: 'Release date',
    demandOption: true,
    type: 'string'
  })
  .option('r', {
    alias: 'release',
    describe: 'Release version',
    demandOption: true,
    type: 'string'
  })
  .option('i', {
    alias: 'id',
    describe: 'Jira Release id',
    demandOption: true,
    type: 'string'
  })
  .option('t', {
    alias: 'template',
    describe: 'Template file',
    demandOption: true,
    type: 'string'
  })
  .option('c', {
    alias: 'dbChanges',
    describe: 'Include database changes',
    type: 'boolean',
    default: false
  })
  .help()
  .argv

const templateStr = fs.readFileSync(options.template, 'utf8')
const commitList = fs.readFileSync(options.file, 'utf8')
const tickets = commitList.split('\n').filter(c => c.trim() !== '')

const context = {
  version: options.release,
  date: options.date,
  id: options.id,
  dbChanges: options.dbChanges,
  tickets
}

const outputStr = nunjucks.renderString(templateStr, context)

fs.writeFileSync(options.output, outputStr)
