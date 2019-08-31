import { ObjectType, FieldTypes } from './types'
import { Collection, Cursor } from 'mongodb'
import { field, model } from './decorators'
import { ValidationError, DefinedError } from '../error'
import { dbClient, metadataStorage } from './shared'

export const BASE_SYMBOL = Symbol('base_model')

export class CursorContainer<T> {
  constructor(public cursor: Cursor<T>) {}

  // TODO: impl
  toArray() {}
}

@model(BASE_SYMBOL)
export class BaseModel {
  static collection: string

  static getCollection<T extends BaseModel>(this: ObjectType<T>): Collection<T> {
    return dbClient.getCollectionByClass(this)
  }

  static find<T extends BaseModel>(this: ObjectType<T>, query?): CursorContainer<T> {
    const self: any = this
    const cursor = self.getCollection(this).find(query)
    return new CursorContainer<T>(cursor)
  }

  static async insertOne<T extends BaseModel>(this: ObjectType<T>, data: Partial<T>): Promise<T> {
    const self: any = this
    return self.from(data).save()
  }

  static from<T extends BaseModel>(this: ObjectType<T>, data: Partial<T>): T {
    const self: any = this
    return new self(data)
  }

  constructor(data?) {
    if (data) {
      const { fields, name } = metadataStorage.getMetadataByInstance(this)
      const finalData = {
        createdAt: new Date(),
      }

      for (let key of Object.keys(data)) {
        const field = fields[key]
        if (field) {
          const error = field.validate(data[key])
          if (error) {
            throw error
          }
          finalData[key] = data[key]
        } else {
          throw new ValidationError(`${key} not permitted in ${name}`)
        }
      }
      Object.assign(this, finalData)
    }
  }

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
    const doc = {}
    const { fields } = metadataStorage.getMetadataByInstance(this)
    for (let key of Object.keys(fields)) {
      doc[key] = this[key]
    }
    return doc
  }

  async save() {
    const { name } = metadataStorage.getMetadataByInstance(this)
    const errors = this.validate()
    if (errors) {
      return Promise.reject(errors[0])
    }
    await dbClient.db.collection(name as string).insertOne(this.toDoc())
    return this
  }

  remove() {}
}
