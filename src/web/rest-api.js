const express = require('express')
const debug = require('debug')('myapp:rest-api')
const multer = require('multer')
const os = require('os')
const api = require('../api')
const errorHandler = require('../middlewares/error-handler')
const cors = require('../middlewares/cors')

const restAPIApp = express.Router()

const upload = multer({
  dest: os.tmpdir()
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

module.exports = restAPI
