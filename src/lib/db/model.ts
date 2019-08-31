import { ObjectType, FIELD_TYPES } from './types'
import { Collection, Cursor } from 'mongodb'
import { field, model, BASE_SYMBOL } from './decorators'
import { ValidationError } from '../error'
import { dbClient, metadataStorage } from './shared'

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

  // TODO
  private static validate<T extends BaseModel>(this: ObjectType<T>, data?: any): Promise<T> {
    return Promise.resolve(data)
  }

  static async insertOne<T extends BaseModel>(this: ObjectType<T>, data: Partial<T>): Promise<T> {
    const self: any = this
    return self.from(data).save()
  }

  static from<T extends BaseModel>(this: ObjectType<T>, data: Partial<T>): T {
    const self: any = this
    const { fields, name } = metadataStorage.getMetadataByClass(self)
    const finalData = {
      createdAt: new Date(),
    }

    for (let key of Object.keys(data)) {
      const field = fields[key]
      if (field) {
        field.validate(data[key])
        finalData[key] = data[key]
      } else {
        throw new ValidationError(`${key} not permitted in ${name}`)
      }
    }
    return new self(finalData)
  }

  constructor(data) {
    // TODO: TypeORM 是怎么做的？
    Object.assign(this, data)
  }

  @field({
    type: FIELD_TYPES.DATE,
  })
  createdAt: Date

  @field({
    type: FIELD_TYPES.DATE,
    nullable: true,
  })
  updatedAt: Date

  // TODO: should not be async
  async validate() {
    const { fields } = metadataStorage.getMetadataByInstance(this)
    for (let key of Object.keys(fields)) {
      const field = fields[key]
      field.validate(this[key])
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
    await this.validate()
    await dbClient.db.collection(name as string).insertOne(this.toDoc())
    return this
  }

  remove() {}
}
