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
    it('is required', async () => {
      const weeklyResponse = new WeeklyResponse({
        responses: [absenceResponse, participateResponse]
      })

      const error = await weeklyResponse.validateSync()

      assert.strictEqual(error.errors.member.message, 'Path `member` is required.')
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

      const stored = await WeeklyResponse.findByUsername(memberName, function () {
        console.log('response loaded from db')
      })

      assert.strictEqual(memberName, stored[0].member)
    })

    it('is able to find member with date and willParticipate value of response of single day', async () => {
      const weeklyResponseOfAnna = new WeeklyResponse({
        member: 'Anna',
        responses: [participateResponse, absenceResponse]
      })

      const weeklyResponseOfBen = new WeeklyResponse({
        member: 'Ben',
        responses: [{
          date: '2019-07-12',
          willParticipate: true,
          from: '17:00',
          to: '20:00'
        }, absenceResponse]
      })

      await weeklyResponseOfAnna.save()
      await weeklyResponseOfBen.save()

      const stored = await WeeklyResponse.findByDateAndWillParticipate('2019-07-12', true, function() {
        console.log('response loaded from db')
      })

      assert.include(stored[0], { member: 'Anna' })
      assert.include(stored[1], { member: 'Ben' })
    })
  })

  describe('deleting document from collection', () => {
    beforeEach(async () => {
      await mongoose.connect(databaseURL, options)
      await mongoose.connection.db.dropDatabase()

      const weeklyResponse = new WeeklyResponse({
        member: 'Jinny',
        responses: [participateResponse, absenceResponse]
      })

      await weeklyResponse.save()
    })

    afterEach(async () => {
      await mongoose.disconnect()
    })

    it('is able to delete the latest weeklyResponse by username', async () => {
      await WeeklyResponse.findOneAndDelete({ member: 'Jinny' })

      const stored = await WeeklyResponse.findByUsername('Jinny', function () {
        console.log('response loaded from db')
      })

      assert.isEmpty(stored)
    })
  })
})
