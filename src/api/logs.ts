import { Log } from '../models'
import { NotFoundError } from '../error'

export const browse = () => {
  return {
    logs: Log.find(),
  }
}

export const read = options => {
  const logs = Log.find()
  const found = logs.find(log => log.id.toString() === options.log)
  if (!found) {
    throw new NotFoundError('Log not found!')
  }
  return {
    logs: [found],
  }
}
