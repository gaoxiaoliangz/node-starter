import { MongoClient } from 'mongodb'
import { Model, ModelClass } from '../models/user'

const debug = require('debug')('myapp:lib:db')

const DB_URI = process.env.DB_URI
const DB_NAME = process.env.DB_NAME

const connectDB = (() => {
  const connected = {}
  return (dbUri = DB_URI): Promise<MongoClient> => {
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

export class DB {
  client: MongoClient
  readonly database: string
  readonly dbURI: string

  constructor(config: { dbURI: string; database: string }) {
    this.client = null
    this.database = config.database
    this.dbURI = config.dbURI
  }

  connect() {
    return connectDB(this.dbURI).then(client => (this.client = client))
  }

  getDb() {
    if (!this.client) {
      throw new Error(`db not connected`)
    }
    return this.client.db(this.database)
  }

  // find<T>(modelClass: ModelClass<Model<T>>, query, session?) {
  //   const collection = modelClass.collection
  //   const ctx = this.getDb().collection(collection)
  //   return ctx.find.call(ctx, query, session)
  // }
}

export class Repo {
  find(modelClass) {}
}

export const mainDB = new DB({
  database: DB_NAME,
  dbURI: DB_URI,
})
