import _ from 'lodash'
import { ObjectID } from 'mongodb'
import db from './db'
import { ValidationError } from './error'

const paginate = d => d

export const FIELD_TYPES = {
  STRING: 'string',
  NUMBER: 'number',
  OBJECT: 'object',
  ARRAY: 'array',
  JSON: 'json',
  BOOLEAN: 'boolean',
  NULL: 'null',
  ID: 'id',
  DATE: 'date',
}

const defaultSchema = {
  id: {
    type: FIELD_TYPES.ID,
    // when not provided by user, Mongodb will create one
    nullable: true,
  },
}

const findMatches = (keyword, input) => {
  const reg = new RegExp(keyword, 'g')
  const matches = []
  let match
  do {
    match = reg.exec(input)
    if (match) {
      const matchInfo = {
        index: match.index,
        keyword: match[0],
      }
      matches.push(matchInfo)
    }
  } while (match)
  return matches.length === 0 ? null : matches
}

const getValueType = value => {
  if (value === 'undefined') {
    return 'undefined'
  }
  if (value === null || value === '') {
    return FIELD_TYPES.NULL
  }
  // TODO: new Date(post 1) 居然是有效的？
  if (value instanceof Date || !isNaN(new Date(value).valueOf())) {
    return FIELD_TYPES.DATE
  }
  let type = typeof value

  if (type === 'object' && Array.isArray(value)) {
    return FIELD_TYPES.ARRAY
  }
  return type
}

const withoutUndefined = data => _.pickBy(data, value => value !== undefined)

export class Model {
  schema: any
  docName: string
  computed: any

  constructor(docName, schema, computed) {
    this.schema = {
      ...defaultSchema,
      ...schema,
    }
    this.docName = docName
    this.computed = computed
  }

  get collection() {
    return db.getDb().collection(this.docName)
  }

  _validateField(key, value) {
    const field = this.schema[key]
    let valueType = getValueType(value)
    const fieldTypeError = new ValidationError(
      `${this.docName}.${key}[${field.type}]: ${value} is invalid`,
    )

    if (valueType === FIELD_TYPES.NULL) {
      if (field.nullable) {
        return
      }
      throw new ValidationError(`${this.docName}.${key}[${field.type}] is required`)
    }

    // validate id type
    if (field.type === FIELD_TYPES.ID) {
      if (valueType !== 'string') {
        throw fieldTypeError
      }
      // TODO: check if it is valid ObjectID
      return
    }

    if (valueType !== field.type) {
      throw fieldTypeError
    }
  }

  _processInputEntity(
    entity,
    {
      // when `false`, undefined fields will be skipped, useful for updates
      useNullAsFallback = false,
    } = {},
  ) {
    const data = {}
    for (let key of Object.keys(this.schema)) {
      const field = this.schema[key]
      let value = entity[key]

      if (value === undefined) {
        if (useNullAsFallback) {
          value = null
        } else {
          continue
        }
      }

      this._validateField(key, value)

      switch (field.type) {
        case FIELD_TYPES.ID:
          // value can be null
          data[key] = value && new ObjectID(value)
          break

        case FIELD_TYPES.DATE:
          data[key] = new Date(value)

        default:
          data[key] = value
          break
      }
    }
    return data
  }

  _processOutputEntity({ _id, ...rest }) {
    const entity = {
      ...rest,
      id: _id,
    }
    return {
      ...entity,
      ...(this.computed && _.mapValues(this.computed, fn => fn(entity))),
    }
  }

  _processQuery(query) {
    return withoutUndefined(
      _.reduce(
        query,
        (obj, val, k) => {
          let key = k
          const field = this.schema[key]
          let value = val
          if (field.type === FIELD_TYPES.ID) {
            value = val && new ObjectID(val)
          }
          if (key === 'id') {
            key = '_id'
          }
          return {
            ...obj,
            [key]: value,
          }
        },
        {},
      ),
    )
  }

  /**
   * @returns {Promise<any>}
   */
  async find({ search = null, getSearchContent = null, pagination = null, query = {} } = {}) {
    const collection = this.collection
    let list = await collection
      .find(this._processQuery(query))
      .sort({
        createdAt: -1,
      })
      .toArray()

    if (search && getSearchContent) {
      list = list
        .map(item => {
          return {
            ...item,
            matches: findMatches(search, getSearchContent(item)),
          }
        })
        .filter(item => item.matches)
    }

    list = list.map(this._processOutputEntity.bind(this))

    if (!pagination) {
      return list
    }
    // TODO: impl pagination
    return list
    // return paginate(list, {
    //   limit: _.isNumber(+pagination.limit) ? Number(pagination.limit) : undefined,
    //   ...pagination,
    // })
  }

  /**
   * @param {{
   *  [key: string]: any
   * }} query
   */
  async findOne(query) {
    const collection = this.collection
    const item = await collection.findOne(this._processQuery(query))
    return item ? this._processOutputEntity(item) : null
  }

  findById(id) {
    return this.findOne({ id })
  }

  async create(entity) {
    if (!entity || typeof entity !== 'object') {
      throw new ValidationError(`${entity} is invalid`)
    }

    const collection = this.collection
    const { id, ...entityData } = this._processInputEntity(entity, {
      useNullAsFallback: true,
    }) as any

    const result = await collection.insertOne({
      ...entityData,
      _id: id ? new ObjectID(id) : undefined,
      createdAt: new Date(),
      updatedAt: null,
    })
    return this.findById(result.insertedId)
  }

  /**
   *
   * @param {*} query
   * @param {*} data
   */
  async updateOne(query, data) {
    const collection = this.collection
    const processedQuery = this._processQuery(query)
    await collection.updateOne(processedQuery, {
      $set: {
        ...this._processInputEntity(data),
        updatedAt: new Date(),
      },
    })
    const item = await this.findOne(query)

    return item
  }

  async removeOne(query) {
    const collection = this.collection
    const result = await collection.deleteOne(this._processQuery(query))
    return result
  }

  removeById(id) {
    return this.removeOne({ id })
  }
}

// TODO: ts 类型推导有问题
// type: 'string' | 'number' | 'array' | 'object' | 'json' | 'boolean'
/**
 * @param {{
 *   docName: string
 *   schema: {
 *     [field: string]: {
 *       nullable?: boolean // if type is string, '' is considered null
 *       type: string
 *       default?: any
 *       validator?: (value: any, context) => string?
 *     }
 *   }
 *   computed?: {
 *      [key: string]: (entity) => any
 *   }
 * }} config
 */
export const createModel = ({ docName, schema, computed = {} }) => {
  return new Model(docName, schema, computed)
}
