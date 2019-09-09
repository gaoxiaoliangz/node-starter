import './prepareEnv'
import supertest from 'supertest'
import { dropTestDb } from './helpers'
import { dbClient } from '../lib/db'
import { testEndpoints } from './testEndpoints'
import { testModel } from './testModel'
import app from '../app'

const request = supertest(app)

beforeAll(async () => {
  await dbClient.connect()
  await dropTestDb()
})

describe('e2e', () => {
  describe('model', testModel)
  describe('endpoints', testEndpoints(request))
})

afterAll(async () => {
  await dropTestDb()
  await dbClient.current.close()
})
