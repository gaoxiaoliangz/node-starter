export type ObjectType<T> = { new (): T } | Function

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
