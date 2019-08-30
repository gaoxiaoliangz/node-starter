import { FIELD_TYPES } from './types'
import { metadataStorage, BaseModel } from './model'
import { ValidationError } from '../error'

export const BASE_SYMBOL = Symbol('base_model')

// TODO: should not be here
export class Field {
  constructor(public config: FieldConfig) {}

  validate(value: any) {
    if (value === null || value === undefined) {
      if (!this.config.nullable) {
        throw new ValidationError(`${this.config.name} is not nullable`)
      }
      return value
    }
    if (this.config.validate) {
      this.config.validate(value)
    }
  }
}

// decorators
export interface FieldConfig {
  name?: string
  nullable?: boolean
  type?: FIELD_TYPES
  validate?: (value: any) => void
}
export const field = (config: FieldConfig = {}) => (target, prop) => {
  const finalConfig = {
    name: prop,
    nullable: false,
    type: FIELD_TYPES.STRING,
    ...config,
  }

  metadataStorage.setModelField(target.constructor, new Field(finalConfig))
}

export const model = (name: string | Symbol) => target => {
  // 为什么和 field decorator 里的 target 不一样？
  metadataStorage.setModelClass(target, name)
}
