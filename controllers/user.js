const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if (body.password.length < 3) {
      return response.status(400).json({ error: 'Password must be greater than 3 characters' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (error) {
    return response.status(400).json({ error: error.message })
  }
})

usersRouter.get('/', async (request, response) => {
  try {
    const users = await User.find({}).populate('blogs', { title: 1, content: 1, likes: 1 })
    response.json(users.map(u => u.toJSON()))
  } catch (error) {
    console.log(error)
    response.status(400).end()
  }
})

module.exports = usersRouter
