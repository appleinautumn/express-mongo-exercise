const mongoose = require('mongoose')

const Schema = mongoose.Schema

const schema = new Schema({

  username: { type: String, required: true, index: { unique: true } },
  name: { type: String, required: true },
  password: { type: String, required: true },
  is_admin: { type: Boolean },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },

}, { collection: 'users' })

module.exports = mongoose.model('User', schema)
