import jwt from 'express-jwt'
import express from 'express'
import { UnauthorizedError } from '../error'
import { Req } from '../types'
import { userFns } from '../collections/user'

const SECRET = process.env.SECRET

export const auth = () => {
  const router = express.Router()

  router.use(jwt({ secret: SECRET, credentialsRequired: false }))
  router.use(async (req: Req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Login required'))
    }
    const match = await userFns.findOne({
      id: +req.user.sub,
    })

    if (!match) {
      return next(new UnauthorizedError('Invalid user'))
    }
    req.userId = req.user.sub
    next()
  })

  return router
}
