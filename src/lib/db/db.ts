import { MongoClient } from 'mongodb'
import { metadataStorage, BaseModel } from './model'
import { ObjectType } from './types'
import { createOneOffFn } from '../../utils'

const debug = require('debug')('myapp:lib:db')

const connectDB = (() => {
  const connected = {}
  // https://docs.mongodb.com/manual/reference/connection-string/#standard-connection-string-format
  return (dbUri: string): Promise<MongoClient> => {
    if (connected[dbUri]) {
      return Promise.resolve(connected[dbUri])
    }
    const client = new MongoClient(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })

    client.on('close', () => {
      connected[dbUri] = undefined
      debug(`closed connection to ${dbUri}`)
    })

    return new Promise((resolve, reject) => {
      client.connect(err => {
        connected[dbUri] = client
        if (err) {
          return reject(err)
        }
        debug(`connected to ${dbUri}`)
        resolve(client)
      })
    })
  }
})()

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

class DBConfig {
  private _dbName: string
  private _dbURI: string

  private setDbName = createOneOffFn(
    name => {
      this._dbName = name
    },
    () => {
      throw new Error(`dbName can only be set once`)
    },
  )

  private setDbURI = createOneOffFn(
    uri => {
      this._dbURI = uri
    },
    () => {
      throw new Error(`dbURI can only be set once`)
    },
  )

  get dbName() {
    return this._dbName
  }

  set dbName(name: string) {
    this.setDbName(name)
  }

  get dbURI() {
    return this._dbURI
  }

  set dbURI(uri: string) {
    this.setDbURI(uri)
  }

  get ready() {
    return this._dbName && this._dbURI
  }
}

const dbConfig = new DBConfig()

interface InitDBConfig {
  dbName: string
  dbURI: string
}

export const initDB = (config: InitDBConfig) => {
  dbConfig.dbName = config.dbName
  dbConfig.dbURI = config.dbURI
}

export const dbClient = new DBClient(dbConfig)
