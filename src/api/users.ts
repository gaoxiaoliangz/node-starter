import _ from 'lodash'
import md5 from 'md5'
import jsonwebtoken from 'jsonwebtoken'
import { UnauthorizedError, ValidationError } from '../lib/error'
import { User } from '../models'
import { ROLES } from '../constants'

const SECRET = process.env.SECRET

export const profile = async req => {
  const user = await User.findById(req.user.sub)
  if (!user) {
    return new UnauthorizedError()
  }
  return _.omit(user, ['password'])
}

export const login = async req => {
  const { username, password } = req.body
  if (!username || !password) {
    return new ValidationError('username & password are required!')
  }
  const user: any = await User.findOne({
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
    },
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
  const result = await User.create({
    username,
    password: password && md5(password),
    role: ROLES.USER,
  })
  return result
}
