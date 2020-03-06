const express = require('express')
const router = express.Router()

const User = require('../models/user')

router.get('/', function (req, res) {
  res.json({ messsage: 'Hello user!' })
})

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  const user = new User({ name, email, password })
  try {
    await user.save()
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Error ao registrando um novo usuário', message: error })
  }
})

module.exports = router
