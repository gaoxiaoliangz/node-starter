import { mainDB } from './db'

beforeAll(() => {
  return mainDB.connect()
})

describe('test model', () => {
  test('connect', done => {
    done()
  })
})

afterAll(() => {
  mainDB.client.close()
})
