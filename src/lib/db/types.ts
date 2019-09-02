import { ObjectID } from 'mongodb'
import { DefinedError } from '../error'

export type ObjectType<T> = { new (): T } | Function

export enum FieldTypes {
  String = 1,
  Number,
  Object,
  Array,
  JSON,
  Boolean,
  ID,
  Date,
}

export interface FieldConfig {
  name?: string
  nullable?: boolean
  type?: FieldTypes
  validate?: (value: any) => void | Error | DefinedError
}

export interface PaginationConfig {
  limit?: number
  next?: number | string | ObjectID
}

export interface Pagination<T> {
  items: T[]
  next: number | string | ObjectID
  hasNext: boolean
  limit: number
  total: number
}
