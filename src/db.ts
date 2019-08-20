import { MongoClient } from 'mongodb'

const defaultDbUri = process.env.DB_URI || `mongodb://localhost:27017`
const defaultDbName = process.env.DB_NAME

let client
let connected = false

export const connect = (dbUri = defaultDbUri) => {
  if (connected) {
    return Promise.resolve()
  }
  client = new MongoClient(dbUri, { useNewUrlParser: true })
  return new Promise((resolve, reject) => {
    client.connect(err => {
      connected = true
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

export const getDb = (db = defaultDbName) => {
  return client.db(db)
}
