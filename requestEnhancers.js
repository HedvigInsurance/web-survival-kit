const {
  LoggerFactoryOptions,
  LFService,
  LogGroupRule,
  LogLevel,
} = require('typescript-logging')
const uuidV4 = require('uuid/v4')

const options = new LoggerFactoryOptions().addLogGroupRule(
  new LogGroupRule(/.+/, LogLevel.fromString('info')),
)

const loggerFactory = LFService.createLoggerFactory(options)

const setRequestUuidMiddleware = async (ctx, next) => {
  ctx.state.requestUuid = ctx.get('x-request-id') || uuidV4()

  await next()
}

const setLoggerMiddleware = async (ctx, next) => {
  ctx.state.getLogger = (name) =>
    loggerFactory.getLogger(
      `requestUuid="${ctx.state.requestUuid}"${name ? `:${name}` : ''}`,
    )

  await next()
}

const logRequestMiddleware = async (ctx, next) => {
  const log = (e) =>
    ctx.state
      .getLogger('request')
      .info(
        `${ctx.get('x-forwarded-proto') || ctx.request.protocol} ${
          ctx.request.method
        } ${ctx.request.originalUrl} - ${
          e && e.status ? e.status : ctx.status
        }`,
      )

  try {
    await next()
    log()
  } catch (e) {
    ctx.state.getLogger('request').error('Uncaught error in request', e)
    log(e)
    throw e
  }
}

module.exports = {
  setRequestUuidMiddleware,
  setLoggerMiddleware,
  logRequestMiddleware,
}
