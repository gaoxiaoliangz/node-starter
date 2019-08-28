import express from 'express'
import path from 'path'
import logger from 'morgan'
import site from './web/site'
import { renderError } from './middlewares/error'
import { NotFoundError } from './lib/error'
import { connectDB } from './middlewares/connect'
import { setupAPI } from './web/api'
import { API_BASE_PATH } from './constants'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.resolve(__dirname, '../public')))

app.set('views', path.resolve(__dirname, './views'))
app.set('view engine', 'ejs')

app.use(connectDB())
app.use(API_BASE_PATH, setupAPI())
app.use(site())

app.use((req, res, next) => {
  next(new NotFoundError('Page not found'))
})

app.use(
  renderError({
    renderPage: true,
  }),
)

export default app
