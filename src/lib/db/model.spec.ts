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

const testCollectionPosts = 'test_posts'
const testCollectionUsers = 'test_users'

@model(testCollectionPosts)
class TestPostModel extends BaseModel {
  @field({
    type: FIELD_TYPES.STRING,
  })
  title: string

  @field({
    type: FIELD_TYPES.STRING,
    validate: val => {
      if (!['published', 'draft'].includes(val)) {
        throw new Error(`status is not valid`)
      }
    },
  })
  status: string
}

@model(testCollectionUsers)
class TestUserModel extends BaseModel {
  @field({
    type: FIELD_TYPES.STRING,
  })
  username: string
}

const dropColl = async collectionName => {
  const coll = db.current.collection(collectionName)
  const result = await coll.find().toArray()
  if (result.length) {
    console.log('dropped', collectionName)
    return coll.drop()
  }
}

const clearDb = async () => {
  await dropColl(testCollectionPosts)
  await dropColl(testCollectionUsers)
}

beforeAll(async () => {
  await db.connect().catch(err => {
    // https://github.com/facebook/jest/issues/2713
    process.exit(1)
  })
  await clearDb()
})

describe('model', () => {
  test('insertOne & find', async () => {
    await dropColl(testCollectionPosts)
    await Promise.all(
      _.times(20).map(n => {
        return TestPostModel.insertOne({
          title: `name_${n}`,
          status: 'published',
        })
      }),
    )
    // TODO: 数据库可能有延迟，可这里明明已经 Promise.all 了，说明 insertOne resolve 之后，并没有入库
    await delay(100)
    const rawResult = await TestPostModel.find().cursor.toArray()
    expect(rawResult.length).toBe(20)
    await dropColl(testCollectionPosts)
  })

  test('test null check', async () => {
    let error = null
    await TestPostModel.from({})
      .save()
      .catch(async err => {
        error = err
      })
    expect(error.message).toBe('title is not nullable')
    expect(error).not.toBe(null)
  })

  test('test field custom validator', async () => {
    let error = null
    // TODO: from should not throw
    // await TestPostModel.from({
    //   title: 'test1',
    //   status: 'ok',
    // })
    //   .save()
    //   .catch(async err => {
    //     error = err
    //   })

    await TestPostModel.insertOne({
      title: 'test1',
      status: 'ok',
    }).catch(async err => {
      error = err
    })

    expect(error.message).toBe('status is not valid')
    expect(error).not.toBe(null)
  })

  // TODO: field type test
})

afterAll(async () => {
  await delay(100)
  await clearDb()
  await db.client.close()
})
