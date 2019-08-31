import { dbClient } from '../lib/db/db'

export const connectDB = () => (req, res, next) => {
  dbClient
    .connect()
    .then(() => next())
    .catch(next)
}
