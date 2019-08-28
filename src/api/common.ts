const debug = require('debug')('myapp:api:uploads')

export const upload = object => {
  debug('file uploaded to', object.path)
  return {
    filePath: object.path,
  }
}
