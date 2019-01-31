import debugFactory from 'debug'
const debug = debugFactory('myapp:middlewares:error-handler')

const render = (error, req, res, next) => {
  debug(error)
  res.status(error.statusCode || 500).send({
    error: {
      message: error.message,
      stack: error.stack ? error.stack.split('\n') : null,
    },
  })
}

export default {
  render,
}
