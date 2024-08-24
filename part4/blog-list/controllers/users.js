const bcrypt = require('bcryptjs');
const userRouter = require('express').Router();
const User = require('../models/user');

userRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        .populate('blogs', { title: 1, author: 1, url: 1, id: 1 })
    
    response.json(users)
})

userRouter.post('/', async (request, response) => {
    if(!request.body.username || !request.body.password) {
        return response.status(400).json({ error: "Username and password are required" });
    }


    if (request.body.username.length < 3 || request.body.password.length < 3) {
        return response.status(400).json({ error: "Username and password must be at least 3 characters long" });
    }

    const { username, name, password } = request.body;

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const createdUser = await user.save()    
    response.status(201).json(createdUser)
})

module.exports = userRouter;