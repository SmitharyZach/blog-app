const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const app = require('../app')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'How to change a flat tire',
    author: 'Ziggity Z',
    url: 'medium.com',
    likes: 45
  },
  {
    title: 'How to use state with react hooks',
    author: 'Ziggity Z',
    url: 'medium.com',
    likes: 45
  }
]

beforeEach(async () => {
  await Blog.deleteMany(({}))

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()

})

test('all blogs formatted in JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs present', async() => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toEqual(initialBlogs.length)
})

test('the unique identifier for blog posts is id', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[1].id).toBeDefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Getting the most out of Jest',
    author: 'Ziggity Z',
    url: 'medium.com',
    likes: 45,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body.length).toEqual(initialBlogs.length +1)

  const titles = response.body.map(r => r.title)
  expect(titles).toContain(
    'Getting the most out of Jest'
  )
})

test('null like property returns a 0', async () => {
  const noLikesBlog = {
    title: 'No likes for this poor blog',
    author: 'Lame Zach',
    url: 'medium.com',
    likes: null,
  }

  await api
    .post('/api/blogs')
    .send(noLikesBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const likesArrary = response.body.map(r => r.likes)
  console.log(response.body[2].likes)

  expect(response.body[2].likes).toBeGreaterThanOrEqual(0)
})

test('blogs without title and url properites are rejected', async () => {
  const badBlog = {
    title: null,
    author: "Zach Smith",
    url: null,
    likes: 45,
  }

  await api
    .post('/api/blogs')
    .send(badBlog)
    .expect(400)
})

test('blog is successfully deleted', async () => {
  const response = await api.get('/api/blogs')
  const blogToDelete = response.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

})

afterAll(() => {
  mongoose.connection.close()
})
