const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { MONGO_URI } = require('./utils/config')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')
const userRouter = require('./controllers/users')
const blogRouter = require('./controllers/blogs')

mongoose.set('strictQuery', false)
mongoose.connect(MONGO_URI).then(() => console.log('Connected to mongo')).catch((error) => console.log(error));


app.use(cors())
app.use(express.json())

app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)

app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)
app.use('/api/blogs', middleware.userExtractor, blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app