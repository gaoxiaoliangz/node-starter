const debug = require('debug')('myapp:cors')

const cors = (allowedOrigins) => (req, res, next) => {
  const { origin, referer } = req.headers
  debug('origin', origin)
  debug('referer', referer)
  if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins === '*') {
    debug(`set headers`)
    res.setHeader('Access-Control-Allow-Origin', origin || '*')
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  } else {
    debug(`headers untouched ${referer}`)
  }
  next()
}

module.exports = cors
