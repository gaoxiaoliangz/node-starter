// TODO: can it be placed in jest.config?
process.env.DEBUG = 'myapp:*'
process.env.SECRET = '0eiu09802i3uu980'

import _ from 'lodash'
import { dbClient, initDB } from './db'
import { BaseModel } from './model'
import { field, model } from './decorators'
import { FIELD_TYPES } from './types'
import { delay } from '../../utils'

const postsCollectionName = 'posts'
const usersCollectionName = 'users'

initDB({
  dbName: 'node_starter_test',
  dbURI: 'mongodb://localhost:27017',
})

@model(postsCollectionName)
class PostModel extends BaseModel {
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

@model(usersCollectionName)
class UserModel extends BaseModel {
  @field({
    type: FIELD_TYPES.STRING,
  })
  username: string
}

const dropColl = async collectionName => {
  const coll = dbClient.db.collection(collectionName)
  const result = await coll.find().toArray()
  if (result.length) {
    console.log('dropped', collectionName)
    return coll.drop()
  }
}

const clearDb = async () => {
  await dropColl(postsCollectionName)
  await dropColl(usersCollectionName)
}

beforeAll(async () => {
  await dbClient.connect().catch(err => {
    // https://github.com/facebook/jest/issues/2713
    console.log(err)
    return Promise.reject(err)
  })
  await clearDb()
})

describe('model', () => {
  test('insertOne & find', async () => {
    await dropColl(postsCollectionName)
    await Promise.all(
      _.times(20).map(n => {
        return PostModel.insertOne({
          title: `name_${n}`,
          status: 'published',
        })
      }),
    )
    // TODO: 数据库可能有延迟，可这里明明已经 Promise.all 了，说明 insertOne resolve 之后，并没有入库
    await delay(100)
    const rawResult = await PostModel.find().cursor.toArray()
    expect(rawResult.length).toBe(20)
    await dropColl(postsCollectionName)
  })

  test('test null check', async () => {
    let error = null
    await PostModel.from({})
      .save()
      .catch(async err => {
        error = err
      })
    expect(error.message).toBe('title is not nullable')
    expect(error).not.toBe(null)
  })

  test('test field custom validator', async () => {
    let error = null

    await PostModel.insertOne({
      title: 'test1',
      status: 'ok',
    }).catch(async err => {
      error = err
    })

    expect(error.message).toBe('status is not valid')
    expect(error).not.toBe(null)
  })

  test('from should not throw', async () => {
    await PostModel.from({
      title: 'test1',
      status: 'ok',
    })
  })

  // TODO: field type test
})

afterAll(async () => {
  await delay(100)
  await clearDb()
  await dbClient.current.close()
})
