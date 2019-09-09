import { dbClient } from '../lib/db'

export const dropTestDb = async () => {
  const dbName = process.env.DB_NAME
  await dbClient.connect()
  if (/node_starter_test_\d+/.test(dbName)) {
    return dbClient.current.db(process.env.DB_NAME).dropDatabase()
  }
  throw new Error(`db ${dbName} is not a valid test db`)
}

export const dropColl = async collectionName => {
  await dbClient.connect()
  const coll = dbClient.db.collection(collectionName)
  const result = await coll.find().toArray()
  if (result.length) {
    return coll.drop()
  }
}
