import createError from 'http-errors'
import express from 'express'
import path from 'path'
import logger from 'morgan'
import site from './web/site'
import restAPI from './web/rest-api'
import { appError } from './middlewares/app-error'
import { auth } from './middlewares/auth'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.resolve(__dirname, '../public')))

// view engine setup
app.set('views', path.resolve(__dirname, './views'))
app.set('view engine', 'ejs')

app.use('/api', auth(), restAPI())
app.use(site())

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error renderer
app.use(appError())

export default app
