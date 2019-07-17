const request = require('supertest')
const { assert } = require('chai')
const app = require('../../../src/app')

describe('/schedule', () => {
  describe('GET', () => {
    it('respond with all schedules have been submitted', async () => {
      const response = await request(app)
        .get('/schedule')
        .send()

      // console.log(response)
      assert.strictEqual(response.status, 200)
    })
  })
})
