import { connect } from 'mongo-fns'
import { getLogger } from '../logger'

const logger = getLogger('middlewares:connect')

export const connectDB = () => (req, res, next) => {
  const dbUri = `${process.env.DB_URI}/${process.env.DB_NAME}?retryWrites=true`
  logger.info('connect', dbUri)

  connect(dbUri)
    .then(() => next())
    .catch(next)
}
