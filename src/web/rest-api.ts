import express from 'express'
import debugFactory from 'debug'
const debug = debugFactory('myapp:rest-api')
import multer from 'multer'
import os from 'os'
import api from '../api'
import errorHandler from '../middlewares/error-handler'
import cors from '../middlewares/cors'

const restAPIApp = express.Router()

const upload = multer({
  dest: os.tmpdir(),
})

const setupRoutes = () => {
  const router = express.Router()
  // logs
  router.get('/logs', api.http(api.logs.browse))
  router.get('/logs/:log', api.http(api.logs.read))

  // uploads
  router.post('/uploads', upload.single('file'), api.http(api.uploads.commonUpload))

  // handle error
  router.use(errorHandler.render)

  return router
}

const restAPI = () => {
  debug('API up')
  restAPIApp.use(cors('*'), setupRoutes())
  return restAPIApp
}

export default restAPI
