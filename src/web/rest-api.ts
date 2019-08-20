import express from 'express'
import debugFactory from 'debug'
const debug = debugFactory('myapp:rest-api')
import multer from 'multer'
import os from 'os'
import api from '../api'
import errorHandler from '../middlewares/error-handler'
import cors from '../middlewares/cors'
import { endpoint } from '../lib/endpoint'

const restAPIApp = express.Router()

const upload = multer({
  dest: os.tmpdir(),
})

const setupRoutes = () => {
  const router = express.Router()

  // users
  router.get('/profile', endpoint(api.users.profile))
  router.post('/login', endpoint(api.users.login))
  router.post('/signup', endpoint(api.users.signup))

  // logs
  router.get('/logs', endpoint(api.logs.browse))
  router.get('/logs/:log', endpoint(api.logs.read))

  // uploads
  router.post('/uploads', upload.single('file'), endpoint(api.uploads.commonUpload))

  // handle error
  router.use(errorHandler.render)

  return router
}

const restAPI = () => {
  debug('API up')
  restAPIApp.use(cors(), setupRoutes())
  return restAPIApp
}

export default restAPI
