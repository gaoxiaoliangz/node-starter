import { dbClient } from '../lib/db'

export const dropTestDb = () => {
  const dbName = process.env.DB_NAME
  if (/node_starter_test_\d+/.test(dbName)) {
    return dbClient.current.db(process.env.DB_NAME).dropDatabase()
  }
  throw new Error(`db ${dbName} is not a valid test db`)
}
