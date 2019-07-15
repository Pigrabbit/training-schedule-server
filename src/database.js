const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const databaseURL = `mongodb://localhost:27017/schedule`
const options = {
  useNewUrlParser: true
}

const connectAndDrop = async () => {
  await mongoose.connect(databaseURL, options, (err) => {
    if (err) {
      console.error('Error occured while connecting...', err)
    }
  })
  await mongoose.connection.db.dropDatabase()
}

const disconnect = async () => {
  await mongoose.disconnect()
}

module.exports = {
  connectAndDrop,
  disconnect,
  mongoose,
  databaseURL,
  options
}
