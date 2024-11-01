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

     // Populate the 'user' field with the user's details (username and name)
     const populatedBlog = await Blog.findById(newBlog._id).populate('user', { username: 1, name: 1 });

     response.status(201).json(populatedBlog); 
})

blogRouter.post('/:id/comments', async (request, response) => {

    if(!request.body.comment) {
        return response.status(400)
            .json({ error: 'Bad request, the comment is needed' })
    }

    let blog = await Blog.findById(request.params.id);
    if (!blog) {
        return response.status(404).json({ error: 'Blog not found' });
    }


    blog.comments.push(request.body.comment);
    await blog.save();

    return response.status(201).json(blog)
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

    let blogUpdated = await Blog
        .findByIdAndUpdate(id, blog, { new: true, runValidators: true, context: 'query' })
        .populate('user', { username: 1, name: 1 })
        
    return response.json(blogUpdated);
})

module.exports = blogRouter;