import { createModel, FIELD_TYPES } from '../lib/model'

export default createModel({
  docName: 'users',
  schema: {
    username: {
      nullable: false,
      type: FIELD_TYPES.STRING,
    },
    password: {
      nullable: false,
      type: FIELD_TYPES.STRING,
    },
    role: {
      nullable: false,
      type: FIELD_TYPES.STRING,
    },
  },
})
