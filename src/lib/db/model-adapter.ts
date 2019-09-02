import { Field } from './field'
import { FieldTypes } from './types'
import { ObjectID } from 'mongodb'

export class ModelAdapter {
  constructor(
    public fields: {
      [key: string]: Field
    },
  ) {}

  toMongodbDoc(model) {
    const doc = {}
    const { fields } = this
    for (let key of Object.keys(fields)) {
      const field = fields[key]
      let value = model[key]
      if (field.config.type === FieldTypes.ID && value) {
        // TODO: put it in Field
        value = new ObjectID(value)
        if (field.config.name === 'id') {
          key = '_id'
        }
      }
      doc[key] = value
    }
    return doc
  }

  // 从外界来的数据，可能直接来自 mongodb doc，或者用户输入
  from(rawData) {
    const { fields } = this
    const id = new ObjectID()
    const data = {
      // default values
      createdAt: new Date(),
      id,
      ...rawData,
    }

    // validation & field value transformation
    for (let key of Object.keys(fields)) {
      const field = fields[key]
      let value = data[key]
      if (field.config.name === 'id') {
        // _id id 同时存在时，优先使用 _id
        value = data._id || data.id
      }
      if (value !== null && value !== undefined) {
        const error = field.validate(value)
        if (error) {
          throw error
        }
        if (field.config.type === FieldTypes.ID) {
          value = new ObjectID(value)
        }
      } else {
        value = null
      }
      data[key] = value
      // 未定义的 field 会被忽略
      // throw new ValidationError(`${key} not permitted in ${name}`)
    }
    return data
  }
}
