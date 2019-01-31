import debugFactory from 'debug'
const debug = debugFactory('myapp:api:uploads')

const commonUpload = object => {
  debug('uploading file', object.path)
  return {
    filePath: object.path,
  }
}

export default {
  commonUpload,
}
