'use strict'

// If a prebuilt binary is available and functional, skip node-gyp.
// Otherwise, fall back to building from source.

try {
  const bindings = require('../lib/bindings')
  const canvas = new bindings.Canvas(1, 1)
  canvas.getContext('2d')
  process.exit(0)
} catch (err) {
  console.error('Prebuilt binary not available:', err.message)
  console.error('Falling back to build from source...')
  const { execSync } = require('child_process')
  try {
    execSync('node-gyp rebuild', {
      stdio: 'inherit',
      cwd: require('path').resolve(__dirname, '..')
    })
  } catch (e) {
    console.error('Failed to build canvas from source.')
    console.error('Please install the required system dependencies:')
    console.error('  https://github.com/Automattic/node-canvas#compiling')
    process.exit(1)
  }
}
