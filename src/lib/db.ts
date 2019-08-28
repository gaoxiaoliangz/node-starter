import { MongoClient } from 'mongodb'

const debug = require('debug')('myapp:lib:db')

const defaultDbUri = process.env.DB_URI || `mongodb://localhost:27017`
const defaultDbName = process.env.DB_NAME

class Db {
  client: MongoClient
  private connected: boolean

  constructor() {
    this.connected = false
    this.client = null
  }

  connect(dbUri = defaultDbUri) {
    if (this.connected) {
      return Promise.resolve()
    }
    this.client = new MongoClient(dbUri, { useNewUrlParser: true })
    return new Promise((resolve, reject) => {
      this.client.connect(err => {
        this.connected = true
        if (err) {
          return reject(err)
        }
        debug(`connected to ${dbUri}`)
        resolve()
      })
    })
  }

  getDb(db = defaultDbName) {
    return this.client.db(db)
  }
}

export default new Db()
