import _ from 'lodash'
import { DefinedError } from '../error'

const isPromise = obj => {
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
      if (isPromise(result)) {
        return result
          .then(data => {
            handleResult(data)
          })
          .catch(err => {
            next(err)
          })
      }
      handleResult(result)
    } catch (error) {
      next(error)
    }
  }
}
