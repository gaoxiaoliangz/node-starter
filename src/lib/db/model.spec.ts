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

const dropColl = async collectionName => {
  const coll = db.current.collection(collectionName)
  const result = await coll.find().toArray()
  if (result.length) {
    console.log('dropped', collectionName)
    return coll.drop()
  }
}

beforeAll(async () => {
  return db.connect().catch(err => {
    // https://github.com/facebook/jest/issues/2713
    process.exit(1)
  })
})

describe('model', () => {
  test('insertOne & find', async done => {
    const collectionName = 'coll_tmp'

    @model(collectionName)
    class TestModel extends BaseModel {
      @field({
        type: FIELD_TYPES.STRING,
      })
      name: string
    }

    await dropColl(collectionName)
    const inserted = await Promise.all(
      _.times(20).map(n => {
        return TestModel.insertOne({
          name: `name_${n}`,
        })
      }),
    )
    // TODO: 数据库可能有延迟，可这里明明已经 Promise.all 了，说明 insertOne resolve 之后，并没有入库
    await delay(100)
    const rawResult = await TestModel.find().cursor.toArray()
    expect(rawResult.length).toBe(20)
    await dropColl(collectionName)
    done()
  })
})

afterAll(() => {
  db.client.close()
  return delay(100)
})
