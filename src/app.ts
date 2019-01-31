import createError from 'http-errors'
import * as express from 'express'
import * as path from 'path'
import * as cookieParser from 'cookie-parser'
import * as logger from 'morgan'
import site from './web/site'
import restAPI from './web/rest-api'

const rootApp = express()

rootApp.use(logger('dev'))
rootApp.use(express.json())
rootApp.use(express.urlencoded({ extended: false }))
rootApp.use(cookieParser())
rootApp.use(express.static(path.resolve(__dirname, '../public')))

// view engine setup
rootApp.set('views', path.resolve(__dirname, './views'))
rootApp.set('view engine', 'ejs')

rootApp.use('/api', restAPI())
rootApp.use(site())

// catch 404 and forward to error handler
rootApp.use((req, res, next) => {
  next(createError(404))
})

// error handler
rootApp.use((err, req, res, next) => {
  // eslint-disable-line
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

export default rootApp
