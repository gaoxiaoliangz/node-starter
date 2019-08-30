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

const withCollection = async collName => async test => {
  await dropColl(collName)
  await test(collName)
  await dropColl(collName)
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

  test('test null check', async () => {
    const collectionName = 'coll_tmp2'
    await dropColl(collectionName)

    @model(collectionName)
    class TestModel extends BaseModel {
      @field({
        type: FIELD_TYPES.STRING,
      })
      name: string
    }

    let error = null
    await TestModel.from({})
      .save()
      .catch(async err => {
        error = err
      })
    expect(error).not.toBe(null)
    await dropColl(collectionName)
  })
})

afterAll(async () => {
  await delay(100)
  db.client.close()
})
