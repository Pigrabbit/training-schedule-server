const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function (value) {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        return emailRegex.test(value)
      },
      message: 'Please fill a valid email address.'
    }
  },
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    validate: {
      validator: function (value) {
        const usernameRegex = /^[a-z0-9]+$/i
        return usernameRegex.test(value)
      },
      message: 'Make username with alphabet and numbers. Special characters are not allowed.'
    },
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: [10, 'Password should be longer than 10 characters.'],
    maxlength: [20, 'Password should be shorter than 20 characters.']
  }
})

const User = mongoose.model('User', UserSchema)
module.exports = User
