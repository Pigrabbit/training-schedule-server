const User = require('../../models/user.js')

module.exports = {
  create: (req, res, next) => {
    if (!req.body ||
        !req.body['email'] ||
        !req.body['username'] ||
        !req.body['password'] ||
        !req.body['passwordConf']) {
      return res.status(422).send()
    }

    if (req.body['password'] !== req.body['passwordConf']) {
      const err = new Error('Passwords do not match.')
      res.status(400).send('Passwords do not match')
      return next(err)
    }

    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    })

    user.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.status(200)
        .send({
          success: true,
          message: 'Registered successfully!',
          data: user
        })
    })
  },
  // login: (req, res, next) => {
  //   const flashMessage = req.flash()
  //   let feedback = ''
  //   if (flashMessage.error) {
  //     feedback = flashMessage.error[0]
  //   }
  //
  //   const title = 'login'
  //   const html = template.HTML(title, '', `
  //   <div style="color:red">${feedback}</div>
  //   <form action="/login_process" method="post">
  //     <p><input type="text" name="email" placeholder="email"></p>
  //     <p><input type="password" name="password" placeholder="password"></p>
  //     <p><input type="submit" value="login"></p>
  //   </form>
  // `, '')
  //   res.send(html)
  // },
  logout: (req, res, next) => {
    req.logout()
    req.session.save(function () {
      res.status(200)
        .send({
          success: true
        })
    })
  }
}
