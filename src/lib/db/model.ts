import { dbClient } from './db'
import { ObjectType, FIELD_TYPES } from './types'
import { Collection, Cursor } from 'mongodb'
import { field, Field, model, BASE_SYMBOL } from './decorators'
import { ValidationError } from '../error'

interface ModelMetadata {
  name?: string | Symbol
  fields?: {
    [key: string]: Field
  }
}

class MetadataStorage {
  private modelClasses: Function[]
  private modelNames: WeakMap<Function, string | Symbol>
  private modelFields: WeakMap<
    Function,
    {
      [key: string]: Field
    }
  >

  constructor() {
    this.modelClasses = []
    this.modelNames = new WeakMap()
    this.modelFields = new WeakMap()
  }

  setModelClass(modelClass: Function, name: string | Symbol) {
    if (name instanceof Symbol && name !== BASE_SYMBOL) {
      throw new Error(`only BaseModel can use Symbol as name`)
    }
    if (this.modelNames.get(modelClass)) {
      throw new Error(`${name} has already been used`)
    }
    this.modelClasses.push(modelClass)
    this.modelNames.set(modelClass, name)
  }

  setModelField(modelClass: Function, field: Field) {
    const fields = this.modelFields.get(modelClass)
    this.modelFields.set(modelClass, {
      ...fields,
      [field.config.name]: field,
    })
  }

  getMetadataByInstance(instance: object) {
    for (let modelClass of this.modelClasses) {
      // TODO: a better way to do this?
      // @ts-ignore
      if (instance.__proto__.constructor === modelClass) {
        return this.getMetadataByClass(modelClass)
      }
    }
  }

  getMetadataByName(name: string | Symbol) {
    for (let modelClass of this.modelClasses) {
      const result = this.getMetadataByClass(modelClass)
      if (name === result.name || name === BASE_SYMBOL) {
        return result
      }
    }
  }

  getMetadataByClass(modelClass: Function): ModelMetadata {
    const name = this.modelNames.get(modelClass)
    const fields = this.modelFields.get(modelClass)
    // TODO: check if modelClass is extended from BaseModel
    const baseFields = this.modelFields.get(BaseModel)
    return {
      name,
      fields: {
        ...baseFields,
        ...fields,
      },
    }
  }
}

export const metadataStorage = new MetadataStorage()

export class CursorContainer<T> {
  constructor(public cursor: Cursor<T>) {}

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
