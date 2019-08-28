import express from 'express'
import path from 'path'
import logger from 'morgan'
import site from './web/site'
import restAPI from './web/rest-api'
import { renderError } from './middlewares/error'
import { auth } from './middlewares/auth'
import { NotFoundError } from './error'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.resolve(__dirname, '../public')))

// view engine setup
app.set('views', path.resolve(__dirname, './views'))
app.set('view engine', 'ejs')

// app.use('/api', auth(), restAPI())
app.use('/api', restAPI())
app.use(site())

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new NotFoundError('Page not found'))
})

// error renderer
app.use(
  renderError({
    renderPage: true,
  }),
)

export default app
