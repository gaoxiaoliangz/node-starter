import {
  DefinedError,
  UnauthorizedError,
  NotFoundError,
  RuntimeError,
  errorToPlainObject,
} from '../error'
import { getLogger } from '../logger'
import { isDefinedError as isMongoFnsDefinedError } from 'mongo-fns/lib/error'

const logger = getLogger('middlewares:apperror')

export const renderError = ({ renderPage = false } = {}) => (err, req, res, next) => {
  let statusCode = 500

  if (isMongoFnsDefinedError(err)) {
    statusCode = 400
  } else if (err instanceof DefinedError) {
    if (err instanceof UnauthorizedError) {
      statusCode = 401
    } else if (err instanceof NotFoundError) {
      statusCode = 404
    } else if (err instanceof RuntimeError) {
      statusCode = 500
    } else {
      statusCode = 400
    }
  }
  logger.error(err)
  const errObject = errorToPlainObject(err)

  if (renderPage) {
    return res.status(statusCode).render('error', {
      error: errObject,
    })
  }
  res.status(statusCode).send(errObject)
}
