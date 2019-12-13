import * as express from 'express'
import { getLogger } from '../logger'

const logger = getLogger('site')
const router = express.Router()

const site = () => {
  logger.info('site up')

  router.get('/', (req, res) => {
    res.render('home', {
      title: 'node starter',
    })
  })

  return router
}

export default site
