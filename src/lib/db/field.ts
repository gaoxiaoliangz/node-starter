import { FieldConfig, FieldTypes } from './types'
import { ValidationError, RuntimeError } from '../error'
import { ObjectID } from 'bson'

const isString = value => typeof value === 'string'
const isNumber = value => typeof value === 'number'
const isObject = value => typeof value === 'object' && value !== null
const isArray = value => Array.isArray(value)
const isJSON = value => {
  try {
    JSON.parse(value)
    return true
  } catch (error) {
    return false
  }
}
const isBoolean = value => typeof value === 'boolean'
const isID = value => ObjectID.isValid(value)
const isDate = value => {
  try {
    return !isNaN(new Date(value).valueOf())
  } catch (error) {
    return false
  }
}

const typeValidatorMap = {
  [FieldTypes.String]: isString,
  [FieldTypes.Number]: isNumber,
  [FieldTypes.Object]: isObject,
  [FieldTypes.Array]: isArray,
  [FieldTypes.JSON]: isJSON,
  [FieldTypes.Boolean]: isBoolean,
  [FieldTypes.ID]: isID,
  [FieldTypes.Date]: isDate,
}

export class Field {
  static getValueType(value) {}

  constructor(public config: FieldConfig) {}

  validate(value: any) {
    if (value === null || value === undefined) {
      if (!this.config.nullable) {
        throw new ValidationError(`${this.config.name} is not nullable`)
      }
      return value
    }

    const typeValidator = typeValidatorMap[this.config.type]
    if (!typeValidator) {
      throw new RuntimeError(`type ${this.config.type} is not supported`)
    }

    if (!typeValidator(value)) {
      throw new ValidationError(
        `${this.config.name} is not of type ${FieldTypes[this.config.type]}`,
      )
    }

    if (this.config.validate) {
      this.config.validate(value)
    }
  }
}
