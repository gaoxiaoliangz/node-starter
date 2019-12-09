import {
  docSchema,
  ValueType,
  primitive,
  defineCollection,
  createCollectionFns,
  Fields,
} from 'mongo-fns'

const userSchema = docSchema({
  properties: {
    username: primitive(ValueType.String),
    password: primitive(ValueType.String),
    role: primitive(ValueType.String),
  },
})

export type User = Fields<{
  username: string
  password: string
  role: string
}>

export const userFns = createCollectionFns(defineCollection<User>('users', userSchema))
