// TODO: can it be placed in jest.config?
process.env.DEBUG = 'myapp:*'
process.env.DB_NAME = 'node_starter_test'
process.env.DB_URI = 'mongodb://localhost:27017'
process.env.SECRET = '0eiu09802i3uu980'

import { mainDB } from './db'
import { createModel, FIELD_TYPES } from '../lib/model'
import { delay } from '../utils'
import _ from 'lodash'

const User = createModel({
  docName: 'users',
  schema: {
    username: {
      nullable: false,
      type: FIELD_TYPES.STRING,
    },
    password: {
      nullable: false,
      type: FIELD_TYPES.STRING,
    },
    role: {
      nullable: false,
      type: FIELD_TYPES.STRING,
    },
  },
})

beforeAll(async () => {
  return mainDB.connect().catch(err => {
    // https://github.com/facebook/jest/issues/2713
    process.exit(1)
  })
})

describe('test model', () => {
  test('test creating with empty entity', done => {
    User.create({}).catch(err => {
      expect(err.message).toBe(`users.username[string] is required`)
      done()
    })
  })

  test('test creating entity', done => {
    User.create({
      username: 'aaa',
      password: 'aaa',
      role: 'user',
    }).then(user => {
      done()
    })
  })

  test('test listing', async done => {
    const collectionName = 'col_tmp'
    const clean = () => {
      return mainDB
        .getDb()
        .collection(collectionName)
        .drop()
    }

    const Tmp = createModel({
      docName: collectionName,
      schema: {
        name: {
          nullable: false,
          type: FIELD_TYPES.STRING,
        },
      },
    })

    await clean()
    await Promise.all(
      _.times(20).map(n =>
        Tmp.create({
          // TODO: name-0 is invalid?
          name: `name_${n}`,
        }),
      ),
    )

    const results = await Tmp.find()
    expect(results.length).toBe(20)
    await clean()
    done()
  })
})

afterAll(() => {
  mainDB.client.close()
  return delay(100)
})
