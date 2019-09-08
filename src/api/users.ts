import _ from 'lodash'
import md5 from 'md5'
import jsonwebtoken from 'jsonwebtoken'
import { UnauthorizedError, ValidationError } from '../lib/error'
import { ROLES } from '../constants'
import { User } from '../models/user'

const SECRET = process.env.SECRET

export const profile = async req => {
  const user = await User.findOne({ id: req.user.sub })
  if (!user) {
    return new UnauthorizedError()
  }
  return _.omit(user, ['password'])
}

export const list = async req => {
  return User.list(
    {},
    {
      limit: Number(req.query.limit) || 10,
      next: Number(req.query.next) || 0,
    },
  ).then(result => {
    return {
      ...result,
      items: result.items.map(user => _.omit(user, ['password'])),
    }
  })
}

export const login = async req => {
  const { username, password } = req.body
  if (!username || !password) {
    return new ValidationError('username & password are required!')
  }
  const user = await User.findOne({
    username,
    password: md5(password),
  })
  if (!user) {
    return new ValidationError('wrong username & password combination!')
  }

  const token = jsonwebtoken.sign(
    {
      role: user.role,
      sub: user.id,
    } as object,
    SECRET,
    {
      expiresIn: '30 days',
    },
  )
  return {
    ..._.omit(user, ['password']),
    token,
  }
}

export const signup = async req => {
  const { username, password } = req.body
  const match = await User.findOne({ username })
  if (match) {
    return new ValidationError('user exists!')
  }
  const result = await User.insertOne({
    username,
    password: password && md5(password),
    role: ROLES.USER,
  })
  return _.omit(result, ['password'])
}
