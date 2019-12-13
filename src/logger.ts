import path from 'path'
import { configure, getLogger as getLog4jsLogger } from 'log4js'
import createDebugLogger, { Debugger } from 'debug'

class DebugLogger {
  static namespace = 'node-starter'

  level: string
  private debugger: Debugger

  constructor(public namespace: string) {
    this.debugger = createDebugLogger(`${DebugLogger.namespace}:${namespace}`)
  }

  log(...args: any[]) {
    this.debugger.apply(this, args)
  }

  isLevelEnabled(level?: string) {
    return false
  }

  isTraceEnabled() {
    return true
  }

  isDebugEnabled() {
    return true
  }

  isInfoEnabled() {
    return true
  }

  isWarnEnabled() {
    return true
  }

  isErrorEnabled() {
    return true
  }

  isFatalEnabled() {
    return true
  }

  _log(level: string, ...args: any[]) {
    this.log(level, ...args)
  }

  private wanUnsupportedFeature(featureName: string) {
    this.log(`${featureName} is not supported when using debug as logger`)
  }

  addContext(key: string, value: any) {
    this.wanUnsupportedFeature('addContext')
  }

  removeContext(key: string) {
    this.wanUnsupportedFeature('removeContext')
  }

  clearContext() {
    this.wanUnsupportedFeature('clearContext')
  }

  setParseCallStackFunction(parseFunction: Function) {
    this.wanUnsupportedFeature('setParseCallStackFunction')
  }

  trace(message: any, ...args: any[]) {
    this.wanUnsupportedFeature('trace')
  }

  debug(message: any, ...args: any[]) {
    this._log('[DEBUG]', message, ...args)
  }

  info(message: any, ...args: any[]) {
    this.log('[INFO]', message, ...args)
  }

  warn(message: any, ...args: any[]) {
    this.log('[WARN]', message, ...args)
  }

  error(message: any, ...args: any[]) {
    this.log('[ERROR]', message, ...args)
  }

  fatal(message: any, ...args: any[]) {
    this.log('[FATAL]', message, ...args)
  }
}

let useLog4js = false

switch (process.env.LOGGER) {
  case undefined:
  case null:
  case 'debug':
    process.env.LOGGER = 'debug'
    break

  case 'log4js':
    useLog4js = true
    configure(path.resolve(__dirname, '../configs/log4js.json'))
    break

  default:
    const logger = getLogger('logger')
    logger.warn(`${process.env.LOGGER} is not supported, used debug instead`)
    process.env.LOGGER = 'debug'
}

export function getLogger(category?: string) {
  if (useLog4js) {
    return getLog4jsLogger(category)
  }
  return new DebugLogger(category)
}
