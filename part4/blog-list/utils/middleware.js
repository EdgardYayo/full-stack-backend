require('dotenv').config()
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { info, error } = require('./logger');

const requestLogger = (request, response, next) => {
  info('Method:', request.method)
  info('Path:  ', request.path)
  info('Body:  ', request.body)
  info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  // console.log(error, error.message, error.name);
  // error(error.message, error.name);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'TypeError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const auth = request.get('authorization')
    
  if(auth && auth.startsWith('Bearer ')) { 
      auth.replace('Bearer ', '')
      request.token = auth.replace('Bearer ', '')
  }

  console.log(request.token, 'TOKEN IN THE REQUEST');
  

  next()
}

const userExtractor = async (request, response, next) => {
  let token = request.token;

  let userOfToken = null;
  if(token) {
    userOfToken = jwt.verify(token, process.env.SECRET);
  }

  if(userOfToken) {
    console.log(userOfToken, 'USER OF THE TOKEN');
    let user = await User.findById(userOfToken.id); 
    request.user = user;
  }

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler, 
  tokenExtractor,
  userExtractor
}