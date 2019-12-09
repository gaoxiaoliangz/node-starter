import supertest from 'supertest'

export const testEndpoints = (request: supertest.SuperTest<supertest.Test>) => () => {
  test('/api/env', async () => {
    const res = await request.get('/api/env')
    expect(res.status).toBe(200)
    expect(res.header['content-type']).toMatch(/json/)
    expect(res.status).toBe(200)
    expect(Object.keys(res.body)).toEqual(['env', 'nodeVersion'])
  })

  test('signup, login flow', async () => {
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
      expect(Object.keys(res.body).sort()).toEqual(
        ['createdAt', 'updatedAt', 'username', 'role', 'token', 'id', '_id', '_raw_id'].sort(),
      )
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
      expect(Object.keys(res.body).sort()).toEqual(
        ['createdAt', 'id', 'updatedAt', 'username', 'role', '_id', '_raw_id'].sort(),
      )
    }
  })
}
