import './prepareEnv'
import supertest from 'supertest'
import { testEndpoints } from './testEndpoints'
import app from '../app'
import { connect, getClientSync } from 'mongo-fns'

export const dropTestDb = async () => {
  const client = await connect(process.env.DB_URI)
  const db = client.db()
  const dbName = db.databaseName
  if (/node_starter_test_\d+/.test(dbName)) {
    return db.dropDatabase()
  }
  throw new Error(`db ${dbName} is not a valid test db`)
}

const request = supertest(app)

beforeAll(async () => {
  await connect(process.env.DB_URI)
})

describe('e2e', () => {
  describe('endpoints', testEndpoints(request))
})

afterAll(async () => {
  await dropTestDb()
  const client = getClientSync()
  await client.close()
})
