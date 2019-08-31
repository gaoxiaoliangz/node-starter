import { FieldConfig } from './types'
import { ValidationError } from '../error'

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
