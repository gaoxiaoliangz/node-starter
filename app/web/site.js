const express = require('express')
const path = require('path')
const debug = require('debug')('myapp:site')

const siteApp = express()

const site = () => {
  debug('site up')

  // view engine setup
  siteApp.set('views', path.resolve(__dirname, '../views'))
  siteApp.set('view engine', 'ejs')

  siteApp.get('/', (req, res) => {
    res.render('index', {
      title: 'Node.js REST starter'
    })
  })

  return siteApp
}

module.exports = site
