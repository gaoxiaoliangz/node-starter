import { FieldTypes, FieldConfig } from './types'
import { metadataStorage } from './shared'
import { Field } from './field'

export const field = (config: FieldConfig = {}) => (target, prop) => {
  const finalConfig = {
    name: prop,
    nullable: true,
    type: FieldTypes.String,
    ...config,
  }

  metadataStorage.setModelField(target.constructor, new Field(finalConfig))
}

export const model = (name: string | Symbol) => target => {
  // 为什么和 field decorator 里的 target 不一样？
  metadataStorage.setModelClass(target, name)
}
