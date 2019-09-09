import { BaseModel, FieldTypes } from '../lib/db'
import { model, field } from '../lib/db/decorators'

export const postsCollectionName = 'posts'

@model(postsCollectionName)
export class PostModel extends BaseModel {
  @field({
    type: FieldTypes.String,
    nullable: false,
  })
  title: string

  @field({
    type: FieldTypes.Number,
  })
  count?: number

  @field({
    type: FieldTypes.Date,
  })
  publishedAt?: Date

  @field({
    type: FieldTypes.ID,
  })
  authorId?: string

  @field({
    type: FieldTypes.String,
    validate: val => {
      if (!['published', 'draft'].includes(val)) {
        throw new Error(`status is not valid`)
      }
    },
  })
  status?: string
}
