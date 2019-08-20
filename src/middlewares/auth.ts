import jwt from 'express-jwt'
import { ObjectID } from 'mongodb'
import express from 'express'
import { connect, getDb } from '../db'
import { UnauthorizedError } from '../error'

const SECRET = process.env.SECRET
const noAuthPaths = ['/login', '/signup']

// TODO: 如果 token 过期，这边还是会触发错误，也就是说 login 接口如果附带过期 token 还是会报错
const _auth = () => {
  return jwt({ secret: SECRET, credentialsRequired: false }).unless({
    path: noAuthPaths,
  })
}

export const auth = () => {
  const router = express.Router()

  router.use(_auth())
  router.use(async (req, res, next) => {
    try {
      await connect()
      next()
    } catch (error) {
      next(error)
    }
  })
  router.use(async (req, res, next) => {
    if (noAuthPaths.includes(req.path)) {
      return next()
    }
    // @ts-ignore
    if (!req.user) {
      return next(new UnauthorizedError())
    }
    // @ts-ignore
    const userId = new ObjectID(req.user.sub)
    const match = await getDb()
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
