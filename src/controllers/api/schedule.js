const WeeklyResponse = require('../../models/weeklyResponse.js')

module.exports = {
  create: async function (req, res) {
    if (!req.body || !req.body['member'] || !req.body['responses']) {
      return res.status(422)
        .send({
          message: 'One or more required parameter is missing'
        })
    }

    try {
      const weeklyResponse = new WeeklyResponse({
        member: req.body['member'],
        responses: req.body['responses']
      })

      console.log('before save')
      const savedResponse = await weeklyResponse.save()
      console.log('after save')
      console.log(savedResponse)

      res.status(200)
        .send({
          data: weeklyResponse
        })
    } catch (err) {
      console.error(err)
      res.status(500)
        .send({
          error: err
        })
    }
  },
  fetch: async function (req, res) {
    // if (!auth.isOwner(req, res)) {
    //   return res.status(401).send('login required')
    // }
    try {
      const stored = await WeeklyResponse.find({})

      if (stored.length === 0) {
        return res.status(404)
          .send({
            message: 'No response has been found'
          })
      }

      return res.status(200)
        .send({
          data: stored
        })
    } catch (err) {
      console.log(err)
      res.status(500)
        .send({
          error: err
        })
    }
  },
  read: async function (req, res) {
    try {
      const member = req.params.username
      const stored = await WeeklyResponse.findByUsername(member)

      if (stored.length === 0) {
        return res.status(404)
          .send({
            message: 'No responses has been found'
          })
      }

      return res.status(200)
        .send({
          data: stored
        })
    } catch (err) {
      console.error(err)
      res.status(500)
        .send({
          error: err
        })
    }
  },
  update: function (req, res) {
    if (!req.body || !req.body['responses']) {
      return res.status(422)
        .send({
          message: 'One or more required parameter is missing'
        })
    }

    const newResponses = req.body['responses']

    const query = { member: req.params.username }
    const update = { responses: newResponses }
    const option = {
      upsert: false,
      new: true
    }

    WeeklyResponse.findOneAndUpdate(query, update, option, function (err, doc) {
      if (err) {
        console.error(err)
        return res.status(500)
          .send({
            error: err
          })
      }

      if (!doc) {
        return res.status(404)
          .send({
            message: 'No response has been found'
          })
      }

      return res.status(200)
        .send({
          data: newResponses
        })
    })
  },
  deleteByUsername: function (req, res) {
    const query = { member: req.params.username }

    WeeklyResponse.findOneAndRemove(query, function (err) {
      if (err) {
        console.error(err)
        return res.status(500)
          .send({
            error: err
          })
      }

      return res.status(200).send()
    })
  },
  deleteAll: function (req, res) {
    WeeklyResponse.remove({}, function (err) {
      if (err) {
        return res.status(500)
          .send({
            error: err
          })
      }

      return res.status(200).send()
    })
  }
}
