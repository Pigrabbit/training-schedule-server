const mongoose = require('mongoose')
const Schema = mongoose.Schema
const DailyResponse = require('./dailyResponse').schema

const WeeklyResponseSchema = new Schema({
  member: {
    type: String,
    required: true
  },
  responses: {
    type: [DailyResponse],
    validate: {
      validator: function (value) {
        return value.length > 0
      },
      message: 'You should provide at least one daily response.'
    }
  }
})

WeeklyResponseSchema.statics.findByUsername = function (username) {
  return this.find({ member: username })
}

WeeklyResponseSchema.statics.findByDateAndWillParticipate = function (date, willParticipate) {
  return this.aggregate([{
    $unwind: '$responses'
  }, {
    $match: {
      'responses.date': date,
      'responses.willParticipate': willParticipate
    }
  }])
}

const WeeklyResponse = mongoose.model('WeeklyResponse', WeeklyResponseSchema)
module.exports = WeeklyResponse
