const request = require('supertest')
const { assert } = require('chai')
const app = require('../../../src/app')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const WeeklyResponse = require('../../../src/models/weeklyResponse')

describe('/schedule DELETE', () => {
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

  describe('when user name is not given', () => {
    it('delete every weeklyResponse document have submitted', async () => {
      const response = await request(app)
        .delete('/schedule')
        .send()

      assert.strictEqual(response.status, 200)
    })
  })

  describe('when username is given via request param', () => {
    it('is able to delete weeklyResponse document from collection with username', async () => {
      const response = await request(app)
        .delete('/schedule/jinny')
        .send()

      assert.strictEqual(response.status, 200)
    })
  })
})
