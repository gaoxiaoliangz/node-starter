import db from '../lib/db'

export const connectDB = () => (req, res, next) => {
  db.connect()
    .then(() => next())
    .catch(next)
}
