const { test, after, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);


test('the blogs arrive with the correct status and content-type', async () => {
    await api
        .get('/api/blogs/')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('the id of the elements in the test is named "id"', async () => {
    let result = await api.get('/api/blogs/')
    // console.log(result.body);
    let namesOfIds = result.body.flatMap((blog) => Object.keys(blog));
    // console.log(namesOfIds);
    assert(namesOfIds.includes('id'))
})

let newBlog = {
    title: "Testing express apps",
    author: "Edgard Pazos",
    url: "www.google.com",
    likes: 54
}

let newBlogWithoutLikes = {
    title: "Testing express apps",
    author: "Edgard Pazos",
    url: "www.google.com",
}

let newBlogWithoutTitleAndUrl = {
    author: "Edgard Pazos",
}


describe('Can create new blogs', () => {

    test('when create status is 201', async () => {

        await api
            .post('/api/users')
            .send({ username: 'Edgard', name: 'Edgard', password: 'prana' })

       const loginRequest = await api
                .post('/api/login')
                .send({ username: 'Edgard',  password: 'prana' })
        
        await api
            .post('/api/blogs/')
            .send({ ...newBlog, user: loginRequest.body.id })
            .set('Authorization', `Bearer ${loginRequest.body.TOKEN}`)
            .expect(201)
    })

    test('when creates the blogs list has a length + 1', async () => {
        let getResult1 = await api.get('/api/blogs/')

        const loginRequest = await api
                .post('/api/login')
                .send({ username: 'Edgard',  password: 'prana' })

        await api
            .post('/api/blogs/')
            .send({ ...newBlog, user: loginRequest.body.id })
            .set('Authorization', `Bearer ${loginRequest.body.TOKEN}`)

        let getResult2 = await api.get('/api/blogs/')

        assert.strictEqual(getResult2.body.length, getResult1.body.length + 1)
    })

    test('When created and likes value it isn\'t given the likes value must be zero', async () => {
        const loginRequest = await api
                .post('/api/login')
                .send({ username: 'Edgard',  password: 'prana' })

        let newBlogCreated = await api
            .post('/api/blogs/')
            .send({ ...newBlogWithoutLikes, user: loginRequest.body.id })
            .set('Authorization', `Bearer ${loginRequest.body.TOKEN}`)

    
        assert.strictEqual(0, newBlogCreated.body.likes);    
    })

    test('When created and title or url field is missing returns status 400 bad request', async () => {

        const loginRequest = await api
                .post('/api/login')
                .send({ username: 'Edgard',  password: 'prana' })

        await api
            .post('/api/blogs/')
            .send({ ...newBlogWithoutTitleAndUrl, user: loginRequest.body.id })
            .set('Authorization', `Bearer ${loginRequest.body.TOKEN}`)
            .expect(400)
    })

    test('When the token is not provided responds with the status 401 Unauthorized', async () => {
        await api
            .post('/api/users')
            .send({ username: 'Edgard', name: 'Edgard', password: 'prana' })

       const loginRequest = await api
                .post('/api/login')
                .send({ username: 'Edgard',  password: 'prana' })
        
        await api
            .post('/api/blogs/')
            .send({ ...newBlog, user: loginRequest.body.id })
            .set('Authorization', `Bearer null`)
            .expect(401)
    })
})

describe('Can delete blog', () => {
    test('When the id is not given response with a 404', async () => {
        const loginRequest = await api
            .post('/api/login')
            .send({ username: 'Edgard',  password: 'prana' })


        await api
            .delete('/api/blogs/')
            .set('Authorization', `Bearer ${loginRequest.body.TOKEN}`)
            .expect(404)
    })

    test('When the blog is deleted response with the status 204', async () => {
        const loginRequest = await api
            .post('/api/login')
            .send({ username: 'Edgard',  password: 'prana' })

        await api
            .delete('/api/blogs/' + "66ca5f976dc9f232720309b6")
            .set('Authorization', `Bearer ${loginRequest.body.TOKEN}`)
            .expect(204)
    })
})

describe('Can edit blogs', () => {
    test('When the title is changed with the edit endpoint the DB reflects that changes', async () => {
        const loginRequest = await api
            .post('/api/login')
            .send({ username: 'Edgard',  password: 'prana' })


        let blogBefore = await api
            .post("/api/blogs/")
            .send({ ...newBlog, user: loginRequest.body.id })
            .set('Authorization', `Bearer ${loginRequest.body.TOKEN}`);

        let blogUpdated = await api
            .put("/api/blogs/" + blogBefore.body.id)
            .send({ ...newBlog, title: 'Changed' });

        assert.strictEqual('Changed', blogUpdated.body.title);
    })

    test('When the likes is changed with the edit endpoint the DB reflects that changes', async () => {
        const loginRequest = await api
            .post('/api/login')
            .send({ username: 'Edgard',  password: 'prana' })

        let blogBefore = await api
            .post("/api/blogs/")
            .send({ ...newBlog, user: loginRequest.body.id })
            .set('Authorization', `Bearer ${loginRequest.body.TOKEN}`);

        let blogUpdated = await api
            .put("/api/blogs/" + blogBefore.body.id)
            .send({ ...newBlog, likes: 10 });

        assert.strictEqual(10, blogUpdated.body.likes);
    })
})


after(async () => {
    await mongoose.connection.close()
})