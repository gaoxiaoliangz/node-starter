import path from 'path'
import { configure, getLogger as getLog4jsLogger } from 'log4js'
import { DebugLogger } from './debugLogger'

const isServerless = process.env.SERVERLESS === 'true'

let useLog4js = false

if (process.env.LOGGER === 'log4js' && !isServerless) {
  useLog4js = true
  configure(path.resolve(__dirname, '../configs/log4js.json'))
}

export function getLogger(category?: string) {
  if (useLog4js) {
    return getLog4jsLogger(category)
  }
  return new DebugLogger(category, isServerless)
}
