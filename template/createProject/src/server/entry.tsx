import 'source-map-support/register'
import {
  // tslint:disable-line ordered-imports
  createKoaServer,
  getScriptLocation,
} from '@hedviginsurance/web-survival-kit'
import { renderStylesToString } from 'emotion-server'
import * as Koa from 'koa'
import * as path from 'path'
import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter, StaticRouterContext } from 'react-router'

import { FilledContext, HelmetProvider } from 'react-helmet-async'
import { App } from '../App'
import { routes } from '../routes'
import { appLogger } from './logging'
import { IHelmetConfiguration } from 'helmet'
import { helmetConfig } from './config/helmetConfig'
import { Logger } from 'typescript-logging'
import * as bodyParser from 'koa-bodyparser'

const scriptLocation = getScriptLocation({
  statsLocation: path.resolve(__dirname, 'assets'),
  webpackPublicPath: process.env.WEBPACK_PUBLIC_PATH || '',
})
const template = (body: string, helmet: FilledContext['helmet']) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  ${helmet.title}
  ${helmet.title}
  ${helmet.link}
  ${helmet.meta}
</head>
<body>
  <div id="react-root">${body}</div>
  
  <script src="${scriptLocation}"></script>
</body>
</html>
`

const getPage: Koa.Middleware = async (ctx) => {
  const routerContext: StaticRouterContext & { statusCode?: number } = {}
  const helmetContext = {}

  const reactBody = renderStylesToString(
    renderToString(
      <StaticRouter location={ctx.request.originalUrl} context={routerContext}>
        <HelmetProvider context={helmetContext}>
          <App />
        </HelmetProvider>
      </StaticRouter>,
    ),
  )

  if (routerContext.statusCode) {
    ctx.status = routerContext.statusCode
  }
  if (routerContext.url) {
    ctx.redirect(routerContext.url)
    return
  }

  ctx.body = template(reactBody, (helmetContext as FilledContext).helmet)
}
const getPort = () => (process.env.PORT ? Number(process.env.PORT) : 8080)

console.log(`Booting server on ${getPort()} 👢`) // tslint:disable-line no-console

let authConfig: { name: string; pass: string } | undefined
if (process.env.USE_AUTH) {
  appLogger.info(
    `Protecting server using basic auth with user ${process.env.AUTH_NAME} 💂‍`,
  )
  authConfig = {
    name: process.env.AUTH_NAME!,
    pass: process.env.AUTH_PASS!,
  }
} else {
  appLogger.info('Not using any auth, server is open to the public')
}
let helmetConfigToUse: IHelmetConfiguration | undefined
if (process.env.USE_HELMET) {
  appLogger.info('Using helmet and strict CSP ⛑')
  helmetConfigToUse = helmetConfig()
} else if (process.env.NODE_ENV !== 'development') {
  appLogger.warn(
    'NOT using any helmet or CSP headers. This is not recommended for production usage',
  )
}

const server = createKoaServer({
  publicPath: '/assets',
  assetLocation: __dirname + '/assets',
  helmetConfig: helmetConfigToUse,
  authConfig,
})

server.router.use(
  bodyParser({
    extendTypes: { json: ['application/csp-report'] },
  }),
)

server.router.get('/panic-room', async () => {
  throw new Error(
    'Entered the panic room, this is an expected error. Carry on 👜',
  )
})

server.router.post('/_report-csp-violation', (ctx) => {
  ;(ctx.state.getLogger('cspViolation') as Logger).error(
    `CSP VIOLATION: ${JSON.stringify(ctx.request.body)}`,
  )
  ctx.status = 204
})

routes.forEach((route) => {
  server.router.get(route.path, getPage)
})

server.app.listen(getPort(), () => {
  console.log(`Server started 🚀 listening on port ${getPort()}`) // tslint:disable-line no-console
})
