import express from 'express'

interface Req extends express.Request {
  user: {
    sub: string
    role: string
  }
  userId: string
}
