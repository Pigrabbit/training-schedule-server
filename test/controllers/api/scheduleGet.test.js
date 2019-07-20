const request = require('supertest')
const { assert } = require('chai')
const app = require('../../../src/app')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const WeeklyResponse = require('../../../src/models/weeklyResponse')

describe('/schedule GET', () => {
  const databaseURL = `mongodb://localhost:27017/schedule`
  const options = {
    useNewUrlParser: true
  }

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

  before(async () => {
    await mongoose.connect(databaseURL, options)
    await mongoose.connection.db.dropDatabase()

    await weeklyResponse.save()
  })

  after(async () => {
    await mongoose.disconnect()
  })

  describe('when username is not given', () => {
    it('respond with all schedules have been submitted', async () => {
      const response = await request(app)
        .get('/schedule')
        .send()

      assert.strictEqual(response.status, 200)
      assert.strictEqual(response.body.data.length, 1)
    })
  })

  describe('when username is given with param of request', () => {
    it('respond with the schedule which submitted by the user from db', async () => {
      const response = await request(app)
        .get('/schedule/jinny')
        .send()

      assert.strictEqual(response.status, 200)
    })

    it('returns error if schedule which has request username does not exist', async () => {
      const response = await request(app)
        .get('/schedule/jasmine')
        .send()

      assert.strictEqual(response.status, 404)
      assert.strictEqual(response.body.message, 'No responses has been found')
    })
  })
})
