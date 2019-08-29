import { Collection as _Collection, FilterQuery } from 'mongodb'

export class Collection<T> {
  constructor(public collection: _Collection<T>) {}

  find<T>(query, options) {
    return this.collection.find(query)
  }
}
