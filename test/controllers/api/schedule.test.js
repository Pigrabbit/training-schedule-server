const request = require('supertest')
const { assert } = require('chai')
const app = require('../../../src/app')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const WeeklyResponse = require('../../../src/models/weeklyResponse')

describe('/schedule', () => {
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

  describe('GET', () => {
    before(async () => {
      await mongoose.connect(databaseURL, options)
      await mongoose.connection.db.dropDatabase()

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
    })

    it('returns error if schedule which has request username does not exist', async () => {
      const response = await request(app)
        .get('/schedule/jasmine')
        .send()

      assert.strictEqual(response.status, 404)
      assert.strictEqual(response.body.message, 'No responses has been found')
    })
  })

  describe('POST', () => {
    describe('when request is valid', () => {
      it('creates new weeklyResponse document in collection', async () => {
        const response = await request(app)
          .post('/schedule')
          .send({
            member: weeklyResponse.member,
            responses: weeklyResponse.responses
          })

        assert.strictEqual(response.status, 200)
      })
    })

    describe('when one or more parameter is missing or is null', () => {
      describe('when member parameter is missing or is null', () => {
        it('is not able to create new weeklyResponse document', async () => {
          const response = await request(app)
            .post('/schedule')
            .send({
              member: null,
              responses: weeklyResponse.responses
            })

          assert.strictEqual(response.status, 422)
        })
      })

      describe('when responses parameter is missing or is null', () => {
        it('is not able to create new weeklyResponse document', async () => {
          const response = await request(app)
            .post('/schedule')
            .send({
              member: weeklyResponse.member,
              responses: null
            })

          assert.strictEqual(response.status, 422)
        })
      })
    })
  })

  describe('DELETE', () => {
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

        const stored = await WeeklyResponse.find({})

        assert.strictEqual(response.status, 200)
        assert.isEmpty(stored)
      })
    })

    describe('when username is given via request param', () => {
      it('is able to delete weeklyResponse document from collection with username', async () => {
        const response = await request(app)
          .delete('/schedule/jinny')
          .send()

        const stored = await WeeklyResponse.findByUsername('jinny')

        assert.strictEqual(response.status, 200)
        assert.isEmpty(stored)
      })
    })
  })
})
