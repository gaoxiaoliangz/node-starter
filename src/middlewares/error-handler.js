const debug = require('debug')('myapp:middlewares:error-handler')

const render = (error, req, res, next) => { // eslint-disable-line
  debug(error)
  res.status(error.statusCode || 500).send({
    error: {
      message: error.message,
      stack: error.stack ? error.stack.split('\n') : null,
    }
  })
}

module.exports = {
  render,
}
