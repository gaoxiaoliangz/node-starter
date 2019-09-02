import { createOneOffFn } from '../../utils'

export class DBConfig {
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
