// TODO: can it be placed in jest.config?
process.env.DEBUG = 'myapp:*'
process.env.DB_NAME = 'node_starter_test'
process.env.DB_URI = 'mongodb://localhost:27017'
process.env.SECRET = '0eiu09802i3uu980'

import { db } from './db'
import { BaseModel } from './model'
import _ from 'lodash'
import { field, model } from './decorators'
import { FIELD_TYPES } from './types'
import { delay } from '../../utils'

@model('users')
export class User extends BaseModel {
  @field({
    type: FIELD_TYPES.STRING,
  })
  username: string

  @field({
    type: FIELD_TYPES.STRING,
  })
  password: string

  @field({
    type: FIELD_TYPES.STRING,
  })
  role: string
}

beforeAll(async () => {
  return db.connect().catch(err => {
    // https://github.com/facebook/jest/issues/2713
    process.exit(1)
  })
})

describe('test model', () => {
  // test('test creating with empty entity', done => {
  //   User.create({}).catch(err => {
  //     expect(err.message).toBe(`users.username[string] is required`)
  //     done()
  //   })
  // })

  // test('test creating entity', done => {
  //   User.create({
  //     username: 'aaa',
  //     password: 'aaa',
  //     role: 'user',
  //   }).then(user => {
  //     done()
  //   })
  // })

  test('test listing', async done => {
    const collectionName = 'coll_tmp'
    const clean = () => {
      return db.current.collection(collectionName).drop()
    }

    @model(collectionName)
    class Tmp extends BaseModel {
      @field({
        type: FIELD_TYPES.STRING,
      })
      name: string
    }

    await clean()
    const inserted = await Promise.all(
      _.times(20).map(n => {
        return Tmp.insertOne({
          name: `name_${n}`,
        })
      }),
    )

    const container = Tmp.find()
    const rawResult = await container.cursor.toArray()
    expect(rawResult.length).toBe(20)
    await clean()
    done()
  })
})

afterAll(() => {
  db.client.close()
  return delay(100)
})
