const request = require('supertest')
const { assert } = require('chai')
const app = require('../../../src/app')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const DailyResponse = require('../../../src/models/dailyResponse')
const WeeklyResponse = require('../../../src/models/weeklyResponse')

describe('/schedule', () => {
  const databaseURL = `mongodb://localhost:27017/schedule`
  const options = {
    useNewUrlParser: true
  }

  describe('GET', () => {
    before(async () => {
      await mongoose.connect(databaseURL, options)
      await mongoose.connection.db.dropDatabase()

      const weeklyResponse = new WeeklyResponse({
        member: 'jinny',
        responses: [{
          date: '2017-07-13',
          willParticipate: true,
          from: '16:00',
          to: '20:00'
        }, {
          date: '2017-07-14',
          willParticipate: false,
          reasonOfAbsence: 'exam'
        }]
      })

      await weeklyResponse.save()
    })

    after(async () => {
      await mongoose.disconnect()
    })

    it('respond with all schedules have been submitted', async () => {
      const response = await request(app)
        .get('/schedule')
        .send()

      assert.strictEqual(response.status, 200)
      assert.strictEqual(response.body.data.length, 1)
    })

    it('respond with the schedule which submitted by the user from db', async () => {
      const response = await request(app)
        .get('/schedule/jinny')
        .send()

      assert.strictEqual(response.status, 200)
      assert.strictEqual(response.body.data[0].member, 'jinny')
    })

    it('returns error if schedule which has request username does not exist', async () => {
      const response = await request(app)
        .get('/schedule/jasmine')
        .send()

      assert.strictEqual(response.status, 404)
      assert.strictEqual(response.message, 'no schedule has been submitted from this user')
    })
  })
})
