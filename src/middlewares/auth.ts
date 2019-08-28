import jwt from 'express-jwt'
import { ObjectID } from 'mongodb'
import express from 'express'
import { UnauthorizedError } from '../error'
import db from '../lib/db'

const SECRET = process.env.SECRET

export const auth = () => {
  const router = express.Router()

  // TODO: 如果 token 过期，这边还是会触发错误，也就是说 login 接口如果附带过期 token 还是会报错
  router.use(jwt({ secret: SECRET, credentialsRequired: false }))
  router.use(async (req, res, next) => {
    // @ts-ignore
    if (!req.user) {
      return next(new UnauthorizedError())
    }
    // @ts-ignore
    const userId = new ObjectID(req.user.sub)
    const match = await db
      .getDb()
      .collection('users')
      .findOne({
        _id: userId,
      })
    if (!match) {
      return next(new UnauthorizedError())
    }
    // @ts-ignore
    req.userId = userId
    next()
  })

  return router
}
