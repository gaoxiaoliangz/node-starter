import { BaseModel, model, field, FIELD_TYPES } from '../lib/model'

// import { createModel, FIELD_TYPES } from '../lib/model'
// export default createModel({
//   docName: 'users',
//   schema: {
//     username: {
//       nullable: false,
//       type: FIELD_TYPES.STRING,
//     },
//     password: {
//       nullable: false,
//       type: FIELD_TYPES.STRING,
//     },
//     role: {
//       nullable: false,
//       type: FIELD_TYPES.STRING,
//     },
//   },
// })

@model('users')
export class User extends BaseModel {
  @field({
    type: FIELD_TYPES.STRING,
  })
  username: string

  @field({
    type: FIELD_TYPES.STRING,
  })
  password: string

  @field({
    type: FIELD_TYPES.STRING,
  })
  role: string
}

// export interface ModelClass<T> {
//   collection: string

//   new (): T
// }

// export class Model<Schema> {
//   static collection: string

//   static find<T extends Model<Schema>>(this: ObjectType<T>, options?: FindManyOptions<T>): Promise<T[]>;

//   constructor(public model?: Schema) {}

//   save(): Promise<Schema> {
//     return Promise.resolve({}) as any
//   }
// }

// // Model.collection

// interface UserSchema {
//   email: string
//   age: number
// }

// class User extends Model<UserSchema> {
//   static collection = 'users'
// }

// const user = new User({
//   email: 'a',
//   age: 19,
// })

// user.save()

// user.model.age

// export type ObjectType<T> = { new (): T } | Function

// export class Model {
//   static collection: string

//   // static find<T extends Model>(this: ObjectType<T>, hehe?: number): Promise<T[]> {
//   //   return Promise.resolve() as any
//   // }

//   static find<T extends Model>(this: ObjectType<T>, hehe?: number): Promise<T[]> {
//     return Promise.resolve() as any
//   }

//   constructor() {}

//   // save(): Promise {
//   //   return Promise.resolve({}) as any
//   // }
// }

// Model.collection

// class User extends Model {
//   // static collection = 'users'
//   fields = {
//     email: {
//       type: 'string',
//     },
//     age: {
//       type: 'number',
//     },
//   }

//   email: string
//   age: number
// }

// const user = new User()

// User.find().then(v => {
//   v[0].age
// })
