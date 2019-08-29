import { db } from './db'
import { ObjectType, FIELD_TYPES } from './types'
import { Collection, Cursor } from 'mongodb'
import { field } from './decorators'

// modelClass -> collectionName
export const modelGlobalScope = new WeakMap()

export class CursorContainer<T> {
  constructor(public cursor: Cursor<T>) {}

  // TODO: change name
  toArray() {
    console.log('todo')
  }
}

export class BaseModel {
  static collection: string

  static getCollection<T extends BaseModel>(this: ObjectType<T>): Collection<T> {
    return db.getCollection(this)
  }

  static find<T extends BaseModel>(this: ObjectType<T>, query?): CursorContainer<T> {
    const cursor = db.getCollection(this).find(query)
    return new CursorContainer<T>(cursor)
  }

  static insertOne<T extends BaseModel>(this: ObjectType<T>, data?): Promise<T> {
    return db
      .getCollection(this)
      .insertOne(data)
      .then(result => {
        return (this as any).from(data)
      })
  }

  static from<T extends BaseModel>(this: ObjectType<T>, data: object): T {
    const ins = new (this as any)()
    // TODO
    Object.assign(ins, data)
    return ins
  }

  @field({
    type: FIELD_TYPES.DATE,
  })
  createdAt: Date

  @field({
    type: FIELD_TYPES.DATE,
  })
  updatedAt: Date

  insert() {}

  save() {}

  remove() {}
}
