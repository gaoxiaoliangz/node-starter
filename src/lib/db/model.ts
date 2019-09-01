import { ObjectType, FieldTypes } from './types'
import { Collection, Cursor, ObjectID } from 'mongodb'
import { field, model } from './decorators'
import { ValidationError, DefinedError } from '../error'
import { dbClient, metadataStorage } from './shared'
import { Field } from './field'

export const BASE_SYMBOL = Symbol('base_model')

export class CursorContainer<T> {
  constructor(public cursor: Cursor<T>, private modelClass: T) {}

  // TODO: impl
  toArray() {}
}

class ModelAdapter {
  constructor(
    public fields: {
      [key: string]: Field
    },
  ) {}

  toMongodbDoc(model) {
    const doc = {}
    const { fields } = this
    for (let key of Object.keys(fields)) {
      const field = fields[key]
      let value = model[key]
      if (field.config.type === FieldTypes.ID && value) {
        // TODO: put it in Field
        value = new ObjectID(value)
        if (field.config.name === 'id') {
          key = '_id'
        }
      }
      doc[key] = value
    }
    return doc
  }

  // 从外界来的数据，可能直接来自 mongodb doc，或者用户输入
  from(rawData) {
    const { fields } = this
    const id = new ObjectID()
    const data = {
      // default values
      createdAt: new Date(),
      id,
      ...rawData,
    }

    // validation
    for (let key of Object.keys(fields)) {
      const field = fields[key]
      let value = data[key]
      if (field.config.name === 'id') {
        // _id id 同时存在时，优先使用 _id
        value = data._id || data.id
      }
      if (value !== null && value !== undefined) {
        const error = field.validate(value)
        if (error) {
          throw error
        }
        if (field.config.type === FieldTypes.ID) {
          value = new ObjectID(value)
        }
      } else {
        value = null
      }
      data[key] = value
      // 未定义的 field 会被忽略
      // throw new ValidationError(`${key} not permitted in ${name}`)
    }
    return data
  }
}

@model(BASE_SYMBOL)
export class BaseModel {
  static collection: string

  static getCollection<T extends BaseModel>(this: ObjectType<T>): Collection<T> {
    return dbClient.getCollectionByClass(this)
  }

  static find<T extends BaseModel>(this: ObjectType<T>, query?): CursorContainer<T> {
    const Model: any = this
    const cursor = Model.getCollection(this).find(query)
    return new CursorContainer<T>(cursor, this as any)
  }

  // _id, id key, id 的值是 ObjectId 实例还是 字符串，这些问题 mongodb 默认已经做了处理
  // TODO: 其他字段如果是 id 呢？
  static async findOne<T extends BaseModel>(this: ObjectType<T>, query?): Promise<T> {
    const Model: any = this
    const data = await Model.getCollection(this).findOne(query)
    if (data) {
      return Model.from(data)
    }
    return null
  }

  static async insertOne<T extends BaseModel>(this: ObjectType<T>, data: Partial<T>): Promise<T> {
    const Model: any = this
    return Model.from(data).save()
  }

  static from<T extends BaseModel>(this: ObjectType<T>, data: Partial<T>): T {
    const Model: any = this
    return new Model(data)
  }

  private modelAdapter: ModelAdapter

  constructor(data = {}) {
    const { fields } = metadataStorage.getMetadataByInstance(this)
    this.modelAdapter = new ModelAdapter(fields)
    // TODO: use decorator
    Object.defineProperty(this, 'modelAdapter', {
      enumerable: false,
    })

    Object.assign(this, this.modelAdapter.from(data))
  }

  @field({
    type: FieldTypes.ID,
  })
  id: string | ObjectID

  @field({
    type: FieldTypes.Date,
    nullable: false,
  })
  createdAt: Date

  @field({
    type: FieldTypes.Date,
    nullable: true,
  })
  updatedAt: Date

  validate(): (Error | DefinedError)[] {
    const { fields } = metadataStorage.getMetadataByInstance(this)
    const errors = []
    for (let key of Object.keys(fields)) {
      const field = fields[key]
      const error = field.validate(this[key])
      if (error) {
        errors.push(error)
      }
    }
    if (errors.length) {
      return errors
    }
  }

  toDoc() {
    return this.modelAdapter.toMongodbDoc(this)
  }

  async save() {
    const { name } = metadataStorage.getMetadataByInstance(this)
    const errors = this.validate()
    if (errors) {
      return Promise.reject(errors[0])
    }
    const result = await dbClient.db.collection(name as string).insertOne(this.toDoc())
    return this
  }

  remove() {}
}
