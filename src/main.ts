import app from './app'
import * as http from 'http'
import { normalizePort } from './utils'

const debug = require('debug')('myapp:main')

const onError = error => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

const port = normalizePort(process.env.PORT || '3000')
const server = http.createServer(app)

app.set('port', port)

server.listen(port)
server.on('error', onError)

server.on('listening', () => {
  debug(`server running on http://localhost:${port}`)
})
