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
  validate?: (value: any) => void
}
