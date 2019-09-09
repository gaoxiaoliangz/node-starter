import { DBConfig } from './config'
import { DBClient } from './client'
import { MetadataStorage } from './metadata-storage'

const debug = require('debug')('myapp:lib:shared')

export const dbConfig = new DBConfig()

interface InitDBConfig {
  dbName: string
  dbURI: string
}

export const initDB = (config: InitDBConfig) => {
  dbConfig.dbName = config.dbName
  dbConfig.dbURI = config.dbURI
  debug('dbName', config.dbName)
  debug('dbURI', config.dbURI)
}

export const createDBClient = () => {
  return new DBClient(dbConfig)
}

export const dbClient = createDBClient()
export const metadataStorage = new MetadataStorage()
