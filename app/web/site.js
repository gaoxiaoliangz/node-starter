const express = require('express')
const debug = require('debug')('myapp:site')

const siteApp = express()

const site = () => {
  debug('site up')

  siteApp.get('/', (req, res) => {
    res.render('index', {
      title: 'Node.js REST starter'
    })
  })

  return siteApp
}

module.exports = site
