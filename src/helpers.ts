import _ from 'lodash'
import { DefinedError } from './error'

const isThenable = (obj: any) => {
  try {
    return typeof obj.then === 'function'
  } catch (error) {
    return false
  }
}

export const endpoint = fn => {
  return (req, res, next) => {
    const handleResult = result => {
      if (result instanceof DefinedError) {
        next(result)
      } else {
        res.send(result)
      }
    }

    try {
      const result = fn(req)
      if (isThenable(result)) {
        return result.then(handleResult).catch(next)
      }
      handleResult(result)
    } catch (error) {
      next(error)
    }
  }
}
