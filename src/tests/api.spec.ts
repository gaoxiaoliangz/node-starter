import './prepareEnv'
import supertest from 'supertest'
import app from '../app'
import { dropTestDb } from './helpers'
import { dbClient } from '../lib/db'

const request = supertest(app)

describe('api', () => {
  test('/api/env', async () => {
    const res = await request.get('/api/env')

    expect(res.status).toBe(200)
    expect(res.header['content-type']).toMatch(/json/)
    expect(res.status).toBe(200)
    expect(Object.keys(res.body)).toEqual(['env', 'nodeVersion'])
  })

  test('signup & login & profile', async () => {
    const user = {
      username: 'aaa',
      password: 'aaa',
    }
    {
      const res = await request.post('/api/signup').send(user)
      expect(res.status).toBe(200)
    }

    {
      const res = await request.post('/api/signup').send(user)
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('user exists!')
    }

    let token
    {
      const res = await request.post('/api/login').send(user)
      expect(res.status).toBe(200)
      expect(Object.keys(res.body)).toEqual([
        'createdAt',
        'id',
        'updatedAt',
        'username',
        'role',
        'token',
      ])
      token = res.body.token
    }

    {
      const res = await request.get('/api/profile').send(user)
      expect(res.status).toBe(401)
      expect(res.body.message).toBe('Unauthorized')
    }

    {
      const res = await request.get('/api/profile').set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(200)
      expect(Object.keys(res.body)).toEqual(['createdAt', 'id', 'updatedAt', 'username', 'role'])
    }
  })
})

// TODO
// afterAll(async () => {
//   await dropTestDb()
//   await dbClient.current.close()
// })
