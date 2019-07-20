const request = require('supertest')
const { assert } = require('chai')
const app = require('../../../src/app')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const WeeklyResponse = require('../../../src/models/weeklyResponse')

describe('/schedule PUT', () => {
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

  beforeEach(async () => {
    await mongoose.connect(databaseURL, options)
    await mongoose.connection.db.dropDatabase()

    await weeklyResponse.save()
  })

  afterEach(async () => {
    await mongoose.disconnect()
  })

  const newWeeklyResponse = new WeeklyResponse({
    member: 'jinny',
    responses: [{
      date: '2017-07-13',
      willParticipate: false,
      reasonOfAbsence: 'exam'
    }, {
      date: '2017-07-14',
      willParticipate: false,
      reasonOfAbsence: 'exam'
    }]
  })

  describe('when request is valid', () => {
    it('is able to update original responses to new responses', async () => {
      const response = await request(app)
        .put('/schedule/jinny')
        .send({
          responses: newWeeklyResponse.responses
        })

      assert.strictEqual(response.status, 200)
      assert.equal(response.body.data[0].date, newWeeklyResponse.responses[0].date)
      assert.equal(response.body.data[0].willParticipate,
        newWeeklyResponse.responses[0].willParticipate)
    })
  })

  describe('when request is invalid', () => {
    describe('when username in parameter is invalid', () => {
      it('is not able to find match in collection', async () => {
        const response = await request(app)
          .put('/schedule/jasmine')
          .send({
            responses: newWeeklyResponse.responses
          })

        assert.strictEqual(response.status, 404)
      })
    })

    describe('when new responses are missing or null', () => {
      it('is not able to update responses to new value', async () => {
        const response = await request(app)
          .put('/schedule/jinny')
          .send({
            responses: null
          })

        assert.strictEqual(response.status, 422)
      })
    })
  })
})
