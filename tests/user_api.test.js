const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

describe('when there is initally one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User ({ username: 'Test Zach', password: 'thankyou'})
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'bvmoney',
      name: 'Becca Volk',
      password: 'pookie'
    }

    await api
    .post('/api/users')
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

describe('validation errors', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User ({ username: 'Test Zach', password: 'thankyou'})
    await user.save()
  })

  test('username required', async () => {
    const usersAtStart = await usersInDb()

    const noUsername = {
      username: "",
      name: "Noname",
      password: "blahblah"
    }

    await api
      .post('/api/users')
      .send(noUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toEqual(
      expect.not.stringContaining(noUsername.username))
  })

  test('password > 3', async () => {
    const noUsername = {
      username: "sfsfsfsf",
      name: "Noname",
      password: "b"
    }

    await api
      .post('/api/users')
      .send(noUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    })

    test('unique username', async () => {
      const noUsername = {
        username: "Test Zach",
        name: "Noname",
        password: "bdddd"
      }

      await api
        .post('/api/users')
        .send(noUsername)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      })
})

afterAll(() => {
  mongoose.connection.close()
})
