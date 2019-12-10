import {
  DefinedError,
  UnauthorizedError,
  NotFoundError,
  RuntimeError,
  errorToPlainObject,
} from '../error'

const debug = require('debug')('myapp:middlewares:apperror')

export const renderError = ({ renderPage = false } = {}) => (err, req, res, next) => {
  let statusCode = 500

  if (err instanceof DefinedError) {
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
  debug(err)
  const errObject = errorToPlainObject(err)

  if (renderPage) {
    return res.status(statusCode).render('error', {
      error: errObject,
    })
  }
  res.status(statusCode).send(errObject)
}
