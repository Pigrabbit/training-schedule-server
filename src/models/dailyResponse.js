const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DailyResponseSchema = new Schema({
  date: {
    type: String,
    required: true
  },
  willParticipate: {
    type: Boolean,
    required: true
  },
  from: {
    type: String,
    required: function () {
      return this.willParticipate
    }
  },
  to: {
    type: String,
    required: function () {
      return this.willParticipate
    }
  },
  reasonOfAbsence: {
    type: String,
    required: function () {
      return !this.willParticipate
    }
  }
})

const DailyResponse = mongoose.model('DailyResponse', DailyResponseSchema)
module.exports = DailyResponse
