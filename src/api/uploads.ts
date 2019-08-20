import debugFactory from 'debug'
const debug = debugFactory('myapp:api:uploads')

export const commonUpload = object => {
  debug('uploading file', object.path)
  return {
    filePath: object.path,
  }
}
