import * as express from 'express'
import debugFactory from 'debug'
const debug = debugFactory('myapp:site')

const router = express.Router()

const site = () => {
  debug('site up')

  router.get('/', (req, res) => {
    res.render('index', {
      title: 'node starter',
    })
  })

  return router
}

export default site
