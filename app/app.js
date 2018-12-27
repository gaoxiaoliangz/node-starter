const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const site = require('./web/site')
const restAPI = require('./web/rest-api')

const rootApp = express()

rootApp.use(logger('dev'))
rootApp.use(express.json())
rootApp.use(express.urlencoded({ extended: false }))
rootApp.use(cookieParser())
rootApp.use(express.static(path.resolve(__dirname, '../public')))

rootApp.use('/api', restAPI())
rootApp.use(site())

// catch 404 and forward to error handler
rootApp.use((req, res, next) => {
  next(createError(404))
})

// error handler
rootApp.use((err, req, res, next) => { // eslint-disable-line
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = rootApp
