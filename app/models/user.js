const mongoose = require('mongoose')
const bcryt = require('bcrypt')

let userSchema = new mogoose.Schema({
  name: String,
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  created_at: { type: Date, default: Date.now },
  updated_a: { type: Date, default: Date.now },
})

userSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('password')) {
    bcryt.hash(this.password, 20,
      (err, hashedPassword) => {
        if (err) {
          next(err)
        } else {
          this.password = hashedPassword
        }
      })
  }
})

module.exports = mongoose.model('User', userSchema)