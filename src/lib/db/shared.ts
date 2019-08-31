import { DBConfig } from './db-config'
import { DBClient } from './db-client'
import { MetadataStorage } from './metadata-storage'

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
export const metadataStorage = new MetadataStorage()
