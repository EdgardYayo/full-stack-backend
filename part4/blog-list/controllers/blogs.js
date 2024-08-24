require('dotenv').config()
const jwt = require('jsonwebtoken');
const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

const obtainToken = (request) => {
    const auth = request.get('authorization')
    
    if(auth && auth.startsWith('Bearer ')) { 
        return auth.replace('Bearer ', '')
    }

    return null;
}

blogRouter.get('/', async (request, response) => {
    let blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {

    const user = request.user;

    if(!user) {
        return response
            .status(401)
            .json({ error: 'The token is invalid!'})
    }

    if (!request.body.title || !request.body.url) {
        return response.status(400).json({ error: "Bad request" });
    }

    const blog = new Blog({
        ...request.body,
        user: user.id
    })


    const newBlog = await blog.save()
    user.blogs = user.blogs.concat(newBlog._id)
    await user.save()
    
    response.status(201).json(newBlog)
})

blogRouter.delete('/:id', async (request, response) => {
    const user = request.user;

    if(!user) {
        return response
            .status(401)
            .json({ error: 'You cannot delete blogs because your token is invalid!'})
    }


    
    let blog = await Blog.findById(request.params.id);
    let userId = blog.user.toString();
    

    if(user.id.toString() !== userId) {
       return response
            .status(401)
            .json({ error: 'You are not authorized to delete this blog because you are not the owner' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
})

blogRouter.put('/:id', async (request, response, next) => {
    let { id } = request.params
    let { title, author, url, likes } = request.body
    let blog = {
        title,
        author,
        url,
        likes
    }

    let blogUpdated = await Blog.findByIdAndUpdate(id, blog, { new: true, runValidators: true, context: 'query' })
    return response.json(blogUpdated);
})

module.exports = blogRouter;