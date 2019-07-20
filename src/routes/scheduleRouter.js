const express = require('express')
const schedule = require('../controllers/api/schedule')

const router = express.Router()

router.get('/schedule/:username', schedule.read)
router.get('/schedule', schedule.fetch)
router.post('/schedule', schedule.create)
router.put('/schedule/:username', schedule.update)
router.delete('/schedule/:username', schedule.deleteByUsername)
router.delete('/schedule', schedule.deleteAll)

module.exports = router
