import { connect } from 'mongo-fns'

export const connectDB = () => (req, res, next) => {
  connect(process.env.DB_URI)
    .then(() => next())
    .catch(next)
}
