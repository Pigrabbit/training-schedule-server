const User = require('../../src/models/user')
const { assert } = require('chai')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

describe('User', () => {
  const databaseURL = `mongodb://localhost:27017/schedule`
  const options = {
    useNewUrlParser: true
  }

  const sampleUser = new User({})
  const sampleEmail = 'terry@example.com'
  const sampleUsername = 'terry101'
  const samplePassword = '0123456789'

  describe('#email', () => {
    beforeEach(() => {
      sampleUser.username = sampleUsername
      sampleUser.password = samplePassword
    })

    it('is valid if it satisfies email regex', () => {
      const validEmail = 'example@email.com'
      sampleUser.email = validEmail

      const error = sampleUser.validateSync()

      assert.isUndefined(error)
    })

    it('is invalid if it does not satisfy email regex', () => {
      const invalidEmail = 'example.email.com'
      sampleUser.email = invalidEmail

      const error = sampleUser.validateSync()

      assert.strictEqual(error.errors.email.message, 'Please fill a valid email address.')
    })
  })

  describe('#username', () => {
    beforeEach(() => {
      sampleUser.email = sampleEmail
      sampleUser.password = samplePassword
    })

    it('converts every letters to lowercase', () => {
      const usernameInUppercase = 'EXAMPLEUSER'
      sampleUser.username = usernameInUppercase

      assert.strictEqual(sampleUser.username, usernameInUppercase.toLowerCase())
    })

    it('is valid with alphanumeric', () => {
      const invalidUsername = 'example_user'
      sampleUser.username = invalidUsername

      const error = sampleUser.validateSync()

      assert.strictEqual(error.errors.username.message,
        'Make username with alphabet and numbers. Special characters are not allowed.')
    })
  })

  describe('#password', () => {
    beforeEach(() => {
      sampleUser.email = sampleEmail
      sampleUser.username = sampleUsername
    })

    it('is valid when it\'s length is between 10 and 20', () => {
      const validPassword = '0123456789'
      sampleUser.password = validPassword

      const error = sampleUser.validateSync()

      assert.isUndefined(error)
    })

    it('is invalid when it\'s length is shorter than 10', () => {
      const tooShortPassword = '0123'
      sampleUser.password = tooShortPassword

      const error = sampleUser.validateSync()

      assert.strictEqual(error.errors.password.message,
        'Password should be longer than 10 characters.')
    })

    it('is invalid when it\'s length is longer than 20', () => {
      const tooLongPassword = '0123'.repeat(10)
      sampleUser.password = tooLongPassword

      const error = sampleUser.validateSync()

      assert.strictEqual(error.errors.password.message,
        'Password should be shorter than 20 characters.')
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

    it('creates user', async () => {
      sampleUser.email = sampleEmail
      sampleUser.username = sampleUsername
      sampleUser.password = samplePassword

      await sampleUser.save()

      assert(!sampleUser.isNew)
    })
  })

  describe('reading document from collection', () => {
    before(async () => {
      await mongoose.connect(databaseURL, options)
      await mongoose.connection.db.dropDatabase()
    })

    after(async () => {
      await mongoose.disconnect()
    })

    it('is able to get single user by username from collection', async () => {
      const user = new User({
        email: sampleEmail,
        username: sampleUsername,
        password: samplePassword
      })

      await user.save()

      const stored = await User.findByUsername(sampleUsername)

      assert.strictEqual(sampleUsername, stored.username)
    })
  })
})
