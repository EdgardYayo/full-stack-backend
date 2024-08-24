require('dotenv').config()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const user = await User.findOne({ username })
    const passwordIsCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    
    if(!(user && passwordIsCorrect)) {
        return response
            .status(401)
            .json({ error: 'Invalid username or password' })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const TOKEN = jwt.sign(userForToken, process.env.SECRET)

    response
        .status(200)
        .send({ TOKEN, username: user.username, name: user.name })
})

module.exports = loginRouter;