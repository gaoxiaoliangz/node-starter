const debug = require('debug')('myapp:api:uploads')

const commonUpload = object => {
  debug('uploading file', object.path)
  return {
    filePath: object.path,
  }
}

module.exports = {
  commonUpload,
}
