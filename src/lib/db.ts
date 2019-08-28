import { MongoClient } from 'mongodb'

const debug = require('debug')('myapp:lib:db')

const DB_URI = process.env.DB_URI
const DB_NAME = process.env.DB_NAME

const connectDB = (() => {
  const connected = {}
  return (dbUri = DB_URI): Promise<MongoClient> => {
    if (connected[dbUri]) {
      return Promise.resolve(connected[dbUri])
    }
    const client = new MongoClient(dbUri, { useNewUrlParser: true })
    connected[dbUri] = client
    client.on('close', () => {
      console.log(`${dbUri} disconnected`)
    })

    return new Promise((resolve, reject) => {
      this.client.connect(err => {
        this.connected = true
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
  readonly client: MongoClient
  readonly database: string
  readonly dbURI: string

  constructor(config: { dbURI: string; database: string }) {
    this.client = null
    this.database = config.database
    this.dbURI = config.dbURI
  }

  connect() {
    return connectDB(this.dbURI)
  }

  getDb() {
    return this.client.db(this.database)
  }
}

export const mainDB = new DB({
  database: DB_NAME,
  dbURI: DB_URI,
})
