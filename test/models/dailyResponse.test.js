const DailyResponse = require('../../src/models/dailyResponse')
const { assert } = require('chai')

describe('Daily response', () => {
  describe('#from and #to', () => {
    it('are required if willParticipate is true', () => {
      const dailyResponse = new DailyResponse({
        date: '2019-07-12',
        willParticipate: true
      })

      const error = dailyResponse.validateSync()

      assert.strictEqual(error.errors.from.message, 'Path `from` is required.')
      assert.strictEqual(error.errors.to.message, 'Path `to` is required.')
    })

    it('are not required if willParticipate is false', () => {
      const dailyResponse = new DailyResponse({
        date: '2019-07-12',
        willParticipate: false,
        reasonOfAbsence: 'exam'
      })

      const error = dailyResponse.validateSync()

      assert.isUndefined(error)
    })
  })

  describe('#reasonOfAbsence', () => {
    it('is required when willParticipate is false', () => {
      const dailyResponse = new DailyResponse({
        date: '20xx-xx-xx',
        willParticipate: false
      })

      const error = dailyResponse.validateSync()

      assert.strictEqual(error.errors.reasonOfAbsence.message, 'Path `reasonOfAbsence` is required.')
    })
  })
})
