const modelGlobalScope = {}

export const enum FIELD_TYPES {
  STRING,
  NUMBER,
  OBJECT,
  ARRAY,
  JSON,
  BOOLEAN,
  NULL,
  ID,
  DATE,
}

export type ObjectType<T> = { new (): T } | Function

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

export const model = (name: string) => target => {}

export class BaseModel {
  static collection: string

  static find<T extends BaseModel>(this: ObjectType<T>): Promise<T[]> {
    return Promise.resolve() as any
  }

  insert() {}

  save() {}

  remove() {}
}
