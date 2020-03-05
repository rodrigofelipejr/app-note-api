var express = require('express')
var router = express.Router()

const users = require('./users')

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' })
  res.json({ messsage: 'Hello world' })
})

// rotas
router.use('/users', users)

module.exports = router
