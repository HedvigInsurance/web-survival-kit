const babelrc = require('./.babelrc')
const prettierrc = require('./.prettierrc')
const tsconfig = require('./tsconfig')
const jestConfig = require('./jest.config')
const { createKoaServer, getScriptLocation } = require('./koaServer')

module.exports = { babelrc, prettierrc, tsconfig, jestConfig, createKoaServer, getScriptLocation }
