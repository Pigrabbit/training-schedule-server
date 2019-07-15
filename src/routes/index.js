const express = require('express')
const template = require('../lib/template')
const auth = require('../lib/auth')

const router = express.Router()

router.get('/', (req, res) => {
  const html = template.HTML('index', '',
    `
    <a href="/schedule">all schedule</a>
    `, '',
    auth.statusUI(req, res))
  res.send(html)
})

module.exports = router
