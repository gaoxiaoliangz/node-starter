// Normalize a port into a number, string, or false.
export const normalizePort = val => {
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

export const delay = t =>
  new Promise(resolve => {
    setTimeout(resolve, t)
  })
