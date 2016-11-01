#!/usr/bin/env node
'use strict'

const execFileSync = require('child_process').execFileSync

execFileSync('node', [ require.resolve('./cleanBuildFolder') ], { stdio: 'inherit' })
execFileSync('node', [ require.resolve('./buildWebpackBundles') ], { stdio: 'inherit' })
execFileSync('node', [ require.resolve('./prerenderPages') ], { stdio: 'inherit' })
