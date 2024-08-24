const { test, after, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

describe('Cannot create invalid users', () => {
    test('When the password of the user is invalid status 400 is returned', async () => {
        await api
            .post('/api/users/')
            .send({ username: 'root', password: '15', name: 'Edgard Pazos' })
            .expect(400)
    })

    test('When the username of the user is invalid status 400 is returned', async () => {
        await api
            .post('/api/users/')
            .send({ username: 'rt', password: '15rfsdw', name: 'Edgard Pazos' })
            .expect(400)
    })

    test('When user is invalid the right message is returned', async () => {
        let newUser = await api
            .post('/api/users/')
            .send({ username: 'eddi', password: '15', name: 'Edgard Pazos' })

        assert(newUser.body.error.includes('Username and password must be at least 3 characters long'))
    })
})


after(async () => {
    await mongoose.connection.close()
})