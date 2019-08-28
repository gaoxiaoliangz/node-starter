import express from 'express'
import multer from 'multer'
import os from 'os'
import api from '../api'
import cors from '../middlewares/cors'
import { endpoint } from '../lib/endpoint'
import { NotFoundError } from '../error'
import { renderError } from '../middlewares/error'
import { auth } from '../middlewares/auth'

const debug = require('debug')('myapp:web:api')

const upload = multer({
  dest: os.tmpdir(),
})

const setupAPIRoutes = () => {
  const router = express.Router()

  // users
  router.get('/profile', auth(), endpoint(api.users.profile))
  router.post('/login', endpoint(api.users.login))
  router.post('/signup', endpoint(api.users.signup))

  // logs
  router.get('/logs', endpoint(api.logs.browse))
  router.get('/logs/:log', endpoint(api.logs.read))

  // uploads
  router.post('/uploads', upload.single('file'), endpoint(api.uploads.commonUpload))

  router.use((req, res, next) => {
    next(new NotFoundError(`${req.path} not found`))
  })

  // handle error
  router.use(renderError())

  return router
}

export const setupAPI = () => {
  const router = express.Router()
  router.use(cors(), setupAPIRoutes())
  return router
}
