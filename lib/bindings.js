'use strict'

const path = require('path')

const PLATFORMS = {
  'darwin-arm64': '@shqld/canvas-darwin-arm64',
  'darwin-x64': '@shqld/canvas-darwin-x64',
  'linux-arm64-gnu': '@shqld/canvas-linux-arm64-gnu',
  'linux-arm64-musl': '@shqld/canvas-linux-arm64-musl',
  'linux-x64-gnu': '@shqld/canvas-linux-x64-gnu',
  'linux-x64-musl': '@shqld/canvas-linux-x64-musl',
  'win32-x64': '@shqld/canvas-win32-x64'
}

function getPlatformKey () {
  const platform = process.platform
  const arch = process.arch
  let key = `${platform}-${arch}`
  if (platform === 'linux') {
    key += isMuslLinux() ? '-musl' : '-gnu'
  }
  return key
}

function isMuslLinux () {
  try {
    const { execFileSync } = require('child_process')
    const output = execFileSync('ldd', ['--version'], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    })
    return output.includes('musl')
  } catch (e) {
    return e.stderr ? e.stderr.includes('musl') : false
  }
}

function loadBinding () {
  const key = getPlatformKey()
  const packageName = PLATFORMS[key]

  if (packageName) {
    try {
      if (process.platform === 'win32') {
        const pkgDir = path.dirname(require.resolve(`${packageName}/package.json`))
        process.env.PATH = pkgDir + path.delimiter + process.env.PATH
      }
      return require(packageName)
    } catch (_) {
      // fall through to build-from-source fallback
    }
  }

  try {
    const localPath = path.resolve(__dirname, '..', 'build', 'Release')
    if (process.platform === 'win32') {
      process.env.PATH = localPath + path.delimiter + process.env.PATH
    }
    return require(path.join(localPath, 'canvas.node'))
  } catch (_) {
    const supported = Object.keys(PLATFORMS).join(', ')
    throw new Error(
      `No prebuilt canvas binary found for ${key}. ` +
      `Supported platforms: ${supported}. ` +
      'To build from source: npm rebuild canvas --build-from-source'
    )
  }
}

const bindings = loadBinding()

module.exports = bindings

bindings.ImageData.prototype.toString = function () {
  return '[object ImageData]'
}

bindings.CanvasGradient.prototype.toString = function () {
  return '[object CanvasGradient]'
}
