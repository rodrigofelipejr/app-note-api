const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

require('dotenv').config()
const secret = process.env.JWT_TOKEN

const User = require('../models/user')

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

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    let user = await User.findOne({ email })

    if (!user)
      res.status(401).json({ error: 'E-mail ou senha invalidos' })
    else {
      user.isCorrectPassword(password, function (err, same) {
        if (!same)
          res.status(401).json({ error: 'E-mail ou senha invalidos' })
        else {
          user.password = undefined;
          const token = jwt.sign({ email }, secret, { expiresIn: '1d' })
          res.status(200).json({ user: user, token: token })
        }
      })
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno, por favor tente novamente' })
  }
})

module.exports = router
