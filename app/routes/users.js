const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

require('dotenv').config()
const secret = process.env.JWT_TOKEN

const User = require('../models/user')
const withAuth = require('../middlewares/auth')

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
          user.password = undefined
          const token = jwt.sign({ email }, secret, { expiresIn: '1d' })
          res.status(200).json({ user: user, token: token })
        }
      })
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno, por favor tente novamente' })
  }
})

router.put('/password', withAuth, async (req, res) => {
  const { password } = req.body

  try {
    let user = await User.findOne({ _id: req.user._id })
    user.password = password
    user.save()
    res.json(user)
  } catch (error) {
    res.status(401).json({ error: 'Error ao atualizar senha', message: { error } })
  }
})

router.put('/', withAuth, async (req, res) => {
  const { name, email } = req.body

  try {
    let user = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $set: { name, email } },
      { upsert: true, 'new': true }
    )
    res.json(user)
  } catch (error) {
    res.status(401).json({ error: 'Error ao atualizar usuário', message: { error } })
  }
})

router.delete('/', withAuth, async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user._id })
    await user.delete()
    res.json({ message: 'OK' }).status(201)
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

module.exports = router
