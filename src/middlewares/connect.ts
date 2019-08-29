import { db } from '../lib/db/db'

export const connectDB = () => (req, res, next) => {
  db.connect()
    .then(() => next())
    .catch(next)
}
