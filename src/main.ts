require('dotenv').config()
import app from './app'
import debugFactory from 'debug'
const debug = debugFactory('myapp:server')
import * as http from 'http'

const onListening = () => {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}

const onError = error => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
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

// Normalize a port into a number, string, or false.
const normalizePort = val => {
  const port = parseInt(val, 10)
  if (isNaN(port)) {
    // named pipe
    return val
  }
  if (port >= 0) {
    // port number
    return port
  }
  return false
}

const port = normalizePort(process.env.PORT || '3000')
const server = http.createServer(app)

app.set('port', port)

//  Listen on provided port, on all network interfaces.
server.listen(port)
server.on('error', onError)
debug(`server running on http://localhost:${port}`)
server.on('listening', onListening)
