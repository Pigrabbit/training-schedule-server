const WeeklyResponse = require('../../models/weeklyResponse.js')

module.exports = {
  create: function (req, res) {
    if (!req.body || !req.body['member'] || !req.body['responses']) {
      return res.status(422)
        .send({
          message: 'One or more required parameter is missing'
        })
    }

    const weeklyResponse = new WeeklyResponse({
      member: req.body['member'],
      responses: req.body['responses']
    })

    console.log(weeklyResponse)

    weeklyResponse.save(function (error) {
      if (error) {
        console.error(error)
        return res.status(500)
          .send({
            error: error
          })
      }
      return res.status(200)
        .send({
          data: weeklyResponse
        })
    })
  },
  fetch: function (req, res) {
    // if (!auth.isOwner(req, res)) {
    //   return res.status(401).send('login required')
    // }
    WeeklyResponse.find({}, function (error, doc) {
      if (error) {
        console.error(error)
      }

      if (doc.length === 0) {
        return res.status(404)
          .send({
            message: 'No response has been found'
          })
      }

      return res.status(200)
        .send({
          success: true,
          data: doc
        })
    }).sort({ _id: -1 })
  },
  read: function (req, res) {
    const member = req.params.username

    WeeklyResponse.findByUsername(member, function (err, result) {
      if (err) {
        console.error(err)
      }

      if (result.length === 0) {
        return res.status(404)
          .send({
            message: 'No responses has been found'
          })
      }

      return res.status(200)
        .send({
          data: result
        })
    })
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
            error: err,
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
