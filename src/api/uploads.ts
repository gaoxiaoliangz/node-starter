const debug = require('debug')('myapp:api:uploads')

export const commonUpload = object => {
  debug('file uploaded to', object.path)
  return {
    filePath: object.path,
  }
}
