import { MongoClient } from 'mongodb'

const debug = require('debug')('myapp:lib:db:helpers')

export const connectDB = (() => {
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
