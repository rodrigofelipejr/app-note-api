const express = require('express')
const path = require('path')
const logger = require('morgan');

require('./config/database')

const indexRouter = require('./app/routes/index');

const app = express();

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

module.exports = app
