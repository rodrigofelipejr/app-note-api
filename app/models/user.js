const mongoose = require('mongoose')

let userSchema = new mogoose.Schema({
  name: String,
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  created_at: { type: Date, default: Date.now },
  updated_a: { type: Date, default: Date.now },
})

module.exports = mongoose.model('User', userSchema)