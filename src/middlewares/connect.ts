import { mainDB } from '../lib/db'

export const connectDB = () => (req, res, next) => {
  mainDB
    .connect()
    .then(() => next())
    .catch(next)
}
