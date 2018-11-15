const Koa = require('koa')
const Router = require('koa-router')
const basicAuth = require('koa-basic-auth')
const helmet = require('koa-helmet')
const compress = require('koa-compress')
const mount = require('koa-mount')
const serve = require('koa-static')
const { readFileSync } = require('fs')
const {
  logRequestMiddleware,
  setLoggerMiddleware,
  setRequestUuidMiddleware,
} = require('./requestEnhancers')

const getScriptLocation = ({ statsLocation, webpackPublicPath }) =>
  process.env.NODE_ENV === 'production'
    ? webpackPublicPath +
      JSON.parse(readFileSync(statsLocation + '/stats.json', 'UTF8'))
        .assetsByChunkName.app[0]
    : webpackPublicPath + 'app.js'

const createKoaServer = ({
  publicPath,
  assetLocation,
  helmetConfig,
  authConfig,
}) => {
  const app = new Koa()
  const router = new Router()
  app.use(compress({ threshold: '5kb' }))
  app.use(mount(publicPath, serve(assetLocation, { maxage: 86400 * 365 })))

  if (helmetConfig) {
    app.use(helmet(helmetConfig))
  }
  if (authConfig) {
    app.use(basicAuth(authConfig))
  }

  app.use(setRequestUuidMiddleware)
  app.use(setLoggerMiddleware)
  app.use(logRequestMiddleware)

  app.use(router.middleware())

  return { app, router }
}

module.exports = { getScriptLocation, createKoaServer }
