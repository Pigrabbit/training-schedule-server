const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')

const app = express()
app.use(morgan('combined'))
app.use(cors())

const mongoDB = 'mongodb://localhost:27017/schedule'
mongoose.connect(mongoDB, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error'))
db.once('open', function (callback) {
  console.log('Connection Succeeded')
})

app.use(session({
  secret: 'asaewifjijslivni33',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}))

app.use(flash())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const passport = require('./lib/passport')(app)

const indexRouter = require('./routes/index')
const scheduleRouter = require('./routes/scheduleRouter')
const authRouter = require('./routes/authRouter')(passport)

app.use('/', indexRouter)
app.use('/', scheduleRouter)
app.use('/', authRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Listening to ${PORT}`)
})

module.exports = app
