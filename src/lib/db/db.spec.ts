// TODO: can it be placed in jest.config?
process.env.DEBUG = 'myapp:*'
process.env.SECRET = '0eiu09802i3uu980'

import { ObjectID } from 'mongodb'
import _ from 'lodash'
import { BaseModel } from './model'
import { field, model } from './decorators'
import { FieldTypes } from './types'
import { delay } from '../../utils'
import { initDB, dbClient } from './shared'

const postsCollectionName = 'posts'
const usersCollectionName = 'users'

initDB({
  dbName: 'node_starter_test',
  dbURI: 'mongodb://localhost:27017',
})

@model(postsCollectionName)
class PostModel extends BaseModel {
  @field({
    type: FieldTypes.String,
    nullable: false,
  })
  title: string

  @field({
    type: FieldTypes.Number,
  })
  count: number

  @field({
    type: FieldTypes.Date,
  })
  publishedAt: Date

  @field({
    type: FieldTypes.ID,
  })
  authorId: string

  @field({
    type: FieldTypes.String,
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
    type: FieldTypes.String,
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

describe('model class', () => {
  test('calling validate should not throw', () => {
    const post = new PostModel()
    const errors = post.validate()
    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe('title is not nullable')
  })
})

describe('model CRUD', () => {
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

  test('insertOne: id _id fields', async () => {
    const id = new ObjectID()
    const post = await PostModel.insertOne({
      title: 'ok233',
      id,
    })
    expect(Object.keys(post)).toEqual([
      'createdAt',
      'id',
      'title',
      'updatedAt',
      'count',
      'publishedAt',
      'authorId',
      'status',
    ])
    const model = await PostModel.findOne({
      _id: id.toHexString(),
    })
    const model2 = await PostModel.findOne({
      id: id.toHexString(),
    })
    const model3 = await PostModel.findOne({
      id,
    })

    expect(model.id.toString()).toBe(id.toHexString())
    expect(model.title).toBe('ok233')
    expect(model2.title).toBe('ok233')
    expect(model3.title).toBe('ok233')
  })

  test('insertOne with invalid data', async () => {
    expect.assertions(1)
    await PostModel.insertOne({
      title: 'test1',
      status: 'ok',
    }).catch(error => {
      expect(error.message).toBe('status is not valid')
    })
  })

  // test('remove', async () => {
  //   const post = await PostModel.insertOne({
  //     title: 'abc',
  //   })
  //   const match = await PostModel.find({
  //     _id: post._id,
  //   })
  //   await post.remove()
  //   // expect()
  // })
})

describe('model field validation', () => {
  test('test field null check', async () => {
    expect.assertions(1)
    await PostModel.from({})
      .save()
      .catch(async err => {
        expect(err.message).toBe('title is not nullable')
      })
  })

  test('test custom validator', () => {
    expect(() => {
      PostModel.from({
        title: 'test1',
        status: 'ok',
      })
    }).toThrow('status is not valid')
  })

  test('test field type string', () => {
    expect(() => {
      PostModel.from({
        title: (1 as any) as string,
      })
    }).toThrow('title is not of type String')
  })

  test('test field type id', () => {
    expect(() => {
      PostModel.from({
        authorId: 'abc',
      })
    }).toThrow('authorId is not of type ID')
  })

  test('test field type date', () => {
    expect(() => {
      PostModel.from({
        publishedAt: ('aaa' as any) as Date,
      })
    }).toThrow('publishedAt is not of type Date')
  })
})

/**
 * TODOs
 * - remove doc
 * - update doc
 * - find doc
 * - find doc & toArray
 * - list doc with pagination
 * - insertOne should not use Partial
 */

afterAll(async () => {
  await delay(100)
  // await clearDb()
  await dbClient.current.close()
})
