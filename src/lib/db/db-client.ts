import { MongoClient } from 'mongodb'
import { DBConfig } from './db-config'
import { connectDB } from './helpers'
import { BaseModel } from './model'
import { ObjectType } from './types'
import { metadataStorage } from './shared'

export class DBClient {
  current: MongoClient

  constructor(private config: DBConfig) {
    this.current = null
  }

  async connect() {
    if (!this.config.ready) {
      throw new Error(`db config not ready`)
    }
    const client = await connectDB(this.config.dbURI)
    this.current = client
    return client
  }

  get db() {
    if (!this.current) {
      throw new Error(`db not connected`)
    }
    return this.current.db(this.config.dbName)
  }

  getCollectionByClass<T extends BaseModel>(modelClass: ObjectType<T>) {
    const match = metadataStorage.getMetadataByClass(modelClass)
    if (!match) {
      throw new Error(`${modelClass.name} cannot be resolved`)
    }
    return this.db.collection<T>(match.name as string)
  }
}
