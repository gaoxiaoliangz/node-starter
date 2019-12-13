import { connect } from 'mongo-fns'

export const connectDB = () => (req, res, next) => {
  connect(`${process.env.DB_URI}/${process.env.DB_NAME}`)
    .then(() => next())
    .catch(next)
}
