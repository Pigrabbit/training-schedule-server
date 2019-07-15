const WeeklyResponse = require('../../src/models/weeklyResponse')
const DailyResponse = require('../../src/models/dailyResponse')
const { assert } = require('chai')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

describe('WeeklyResponse', () => {
  const databaseURL = `mongodb://localhost:27017/schedule`
  const options = {
    useNewUrlParser: true
  }

  const participateResponse = new DailyResponse({
    date: '2019-07-12',
    willParticipate: true,
    from: '16:00',
    to: '20:00'
  })

  const absenceResponse = new DailyResponse({
    date: '2019-07-11',
    willParticipate: false,
    reasonOfAbsence: 'trip'
  })

  describe('#member', () => {
    it('is required', (done) => {
      const weeklyResponse = new WeeklyResponse({
        responses: [absenceResponse, participateResponse]
      })

      const error = weeklyResponse.validateSync()

      assert.strictEqual(error.errors.member.message, 'Path `member` is required.')
      done()
    })
  })

  describe('#responses', () => {
    it('need to contain at least one daily response', () => {
      const weeklyResponse = new WeeklyResponse({
        member: 'Jinny',
        responses: []
      })

      const error = weeklyResponse.validateSync()

      assert.strictEqual(error.errors.responses.message, 'You should provide at least one daily response.')
    })

    it('is valid when it have more than one daily responses', () => {
      const weeklyResponse = new WeeklyResponse({
        member: 'James',
        responses: [absenceResponse, participateResponse]
      })

      const error = weeklyResponse.validateSync()

      assert.isUndefined(error)
    })
  })

  describe('creating document into collection', () => {
    before(async () => {
      await mongoose.connect(databaseURL, options)
      await mongoose.connection.db.dropDatabase()
    })

    after(async () => {
      await mongoose.disconnect()
    })

    it('creates weeklyResponse', async () => {
      const weeklyResponse = new WeeklyResponse({
        member: 'Jason',
        responses: [absenceResponse, participateResponse]
      })

      await weeklyResponse.save()

      assert(!weeklyResponse.isNew)
    })
  })

  describe('reading document from collection', () => {
    beforeEach(async () => {
      await mongoose.connect(databaseURL, options)
      await mongoose.connection.db.dropDatabase()
    })

    afterEach(async () => {
      await mongoose.disconnect()
    })

    it('is able to read one by member name from collection', async () => {
      const memberName = 'Jason'
      const weeklyResponse = new WeeklyResponse({
        member: memberName,
        responses: [absenceResponse, participateResponse]
      })
      await weeklyResponse.save()

      const stored = await WeeklyResponse.findByUsername(memberName)

      assert.strictEqual(memberName, stored[0].member)
    })
  })
})
