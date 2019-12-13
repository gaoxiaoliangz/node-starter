import express from 'express'
import multer from 'multer'
import os from 'os'
import api from '../api'
import cors from '../middlewares/cors'
import { endpoint } from '../helpers'
import { NotFoundError, RuntimeError } from '../error'
import { renderError } from '../middlewares/error'
import { auth } from '../middlewares/auth'
import { getLogger } from '../logger'

const logger = getLogger('web:api')

const upload = multer({
  dest: os.tmpdir(),
})

const setupAPIRoutes = () => {
  const router = express.Router()

  router.get(
    '/env',
    endpoint(req => {
      logger.info(req.headers)
      return { env: process.env.NODE_ENV, nodeVersion: process.version }
    }),
  )

  // test error
  router.get(
    '/test-error',
    endpoint(() => {
      throw new RuntimeError('Show me some error')
    }),
  )

  // users
  router.get('/users', auth(), endpoint(api.users.list))
  router.get('/profile', auth(), endpoint(api.users.profile))
  router.post('/login', endpoint(api.users.login))
  router.post('/signup', endpoint(api.users.signup))

  // uploads
  router.post('/uploads', upload.single('file'), endpoint(api.common.upload))

  router.use((req, res, next) => {
    next(new NotFoundError(`${req.path} not found`))
  })

  router.use(renderError())

  return router
}

export const setupAPI = () => {
  const router = express.Router()
  router.use(cors(), setupAPIRoutes())
  return router
}
