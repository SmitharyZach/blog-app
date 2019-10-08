const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blog')


const mongoUrl = 'mongodb+srv://full_stack_zach:attack1993@cluster0-azqkn.mongodb.net/note-app?retryWrites=true&w=majority'
mongoose.connect(mongoUrl, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongodDB', error.message)
  })


app.use(cors())
app.use(bodyParser.json())
app.use('/api/blogs', blogsRouter)

PORT = 3003

module.exports = app
