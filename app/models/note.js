const mongoose = require('mongoose')

let noteSchema = new mogoose.Schema({
  title: String,
  body: String,
  created_at: { type: Date, default: Date.now },
  updated_a: { type: Date, default: Date.now },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  }
})

module.exports = mongoose.model('Note', noteSchema)