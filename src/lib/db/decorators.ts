import { FIELD_TYPES } from './types'
import { modelGlobalScope } from './model'

// decorators
interface FieldConfig {
  nullable?: boolean
  type?: FIELD_TYPES
}
export const field = (config: FieldConfig = {}) => (target, prop) => {
  const finalConfig = {
    nullable: false,
    type: FIELD_TYPES.STRING,
    ...config,
  }
}

export const model = (name: string) => target => {
  if (!modelGlobalScope.get(target)) {
    modelGlobalScope.set(target, name)
  }
}
