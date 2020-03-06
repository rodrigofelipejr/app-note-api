const express = require('express')
const router = express.Router()

const users = require('./users')

// rotas
router.use('/users', users)

module.exports = router
