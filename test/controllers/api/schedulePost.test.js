const request = require('supertest')
const { assert } = require('chai')
const app = require('../../../src/app')

const WeeklyResponse = require('../../../src/models/weeklyResponse')

describe('/schedule POST', () => {
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

  describe('when request is invalid', () => {
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
