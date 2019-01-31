const express = require('express')
const debug = require('debug')('myapp:site')

const router = express.Router()

const site = () => {
  debug('site up')

  router.get('/', (req, res) => {
    res.render('index', {
      title: 'Node.js REST starter'
    })
  })

  return router
}

module.exports = site
