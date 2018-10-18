const Koa = require('koa')
const Router = require('koa-router')
const compress = require('koa-compress')
const mount = require('koa-mount')
const serve = require('koa-static')
const { readFileSync } = require('fs')

const getScriptLocation = ({ statsLocation, webpackPublicPath }) =>
  process.env.NODE_ENV === 'production'
    ? webpackPublicPath +
      JSON.parse(readFileSync(statsLocation + '/stats.json', 'UTF8'))
        .assetsByChunkName.app[0]
    : webpackPublicPath + 'app.js'

const createKoaServer = ({ publicPath, assetLocation }) => {
  const app = new Koa()
  const router = new Router()
  app.use(compress())
  app.use(mount(publicPath, serve(assetLocation, { maxage: 86400 * 365 })))
  app.use(router.middleware())

  return { app, router }
}

module.exports = { getScriptLocation, createKoaServer }
