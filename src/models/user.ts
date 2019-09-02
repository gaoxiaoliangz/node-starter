import { BaseModel, FieldTypes } from '../lib/db'
import { model, field } from '../lib/db/decorators'

@model('users')
export class User extends BaseModel {
  @field({
    type: FieldTypes.String,
  })
  username: string

  @field({
    type: FieldTypes.String,
  })
  password: string

  @field({
    type: FieldTypes.String,
  })
  role: string
}
