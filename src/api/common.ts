const debug = require('debug')('myapp:api:uploads')

export const upload = req => {
  debug('file uploaded to', req.file.path)
  return {
    filePath: req.file.path,
  }
}
