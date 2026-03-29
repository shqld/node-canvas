'use strict'

// If a prebuilt binary is available, skip node-gyp entirely.
// Otherwise, fall back to building from source.

try {
  require('../lib/bindings')
  process.exit(0)
} catch (_) {
  const { execSync } = require('child_process')
  try {
    execSync('node-gyp rebuild', { stdio: 'inherit', cwd: require('path').resolve(__dirname, '..') })
  } catch (e) {
    console.error('Failed to build canvas from source.')
    console.error('Please install the required system dependencies:')
    console.error('  https://github.com/Automattic/node-canvas#compiling')
    process.exit(1)
  }
}
