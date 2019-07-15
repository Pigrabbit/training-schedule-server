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

DailyResponseSchema.statics.findByDateAndWillParticipate = function (date, willParticipate) {
  return this.find({ date: date, willParticipate: willParticipate })
}

const DailyResponse = mongoose.model('DailyResponse', DailyResponseSchema)
module.exports = DailyResponse
