const WeeklyResponse = require('../../models/weeklyResponse.js')

module.exports = {
  create: function (req, res) {
    if (!req.body || !req.body['member'] || !req.body['responses']) {
      return res.send({
        status: 422,
        message: 'One or more required parameter is missing'
      })
    }

    const weeklyResponse = new WeeklyResponse({
      member: req.body['member'],
      responses: req.body['responses']
    })

    weeklyResponse.save(function (error) {
      if (error) {
        console.log(error)
        return res.send({
          status: 500,
          error: error
        })
      }
      return res.send({
        status: 200,
        success: true,
        message: 'Schedule submitted successfully!',
        data: weeklyResponse
      })
    })
  },
  fetch: function (req, res) {
    // if (!auth.isOwner(req, res)) {
    //   return res.status(401).send('login required')
    // }
    WeeklyResponse.find({}, function (error, weeklyResponses) {
      if (error) {
        console.error(error)
      }

      if (weeklyResponses.length === 0) {
        return res.status(404)
          .send({
            message: 'No response has been found'
          })
      }

      return res.status(200)
        .send({
          success: true,
          data: weeklyResponses
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
  updateByUsername: function (req, res) {
    if (!req.body || !req.body['responses']) {
      return res.send({
        status: 422,
        message: 'One or more required parameter is missing'
      })
    }

    const updatedResponse = req.body['responses']

    const query = { member: req.params.username }
    const update = { responses: updatedResponse }
    const option = { upsert: false }

    WeeklyResponse.findOneAndUpdate(query, update, option, function (error, responses) {
      if (error) {
        console.error(error)
        return res.send({
          status: 500,
          error: error,
          message: 'No response submitted with this username'
        })
      }
      return res.send({
        status: 200,
        success: true,
        data: updatedResponse
      })
    })
  },
  deleteByUsername: function (req, res) {
    WeeklyResponse.findOneAndRemove({ member: req.params.username }, function (error) {
      if (error) {
        console.error(error)
        return res.send({
          status: 500,
          error: error,
          message: 'No response submitted with this username'
        })
      }

      return res.send({
        status: 200,
        success: true
      })
    })
  },
  deleteAll: function (req, res) {
    WeeklyResponse.remove({}, function (error) {
      if (error) {
        return res.send({
          status: 500,
          error: error
        })
      }

      return res.send({
        status: 200,
        success: true
      })
    })
  }
}
