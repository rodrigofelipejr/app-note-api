require('dotenv').config()
const secret = process.env.JWT_TOKEN

const jwt = require('jsonwebtoken')
const User = require('../models/user')

const WithAuth = (req, res, next) => {
  const token = req.headers['x=access-token']
  if (!token) {
    res.status(401).json({ error: 'Não autorizado: nenhum token fornecido.' })
  } else {
    jwt.verify(token, secret, (err, decode) => {
      if (err) {
        res.status(401).json({ error: 'Não autorizado: token inválido.' })
      } else {
        req.email = decode.email
        User.findOne({ email: decode.email })
          .then(user => {
            req.user = user
          })
          .catch(err => {
            res.status(401).json({ error: err })
          })
      }
    })
  }
}

module.exports = WithAuth