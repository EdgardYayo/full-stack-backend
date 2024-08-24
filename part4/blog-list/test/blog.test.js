const { test, describe } = require('node:test');
const assert  = require('node:assert');
const listHelper = require('../utils/list-helper');
const logger = require('../utils/logger')

const listWithoutBlog = []
const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
]
const listWithMultipleBlogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aabg573h76234d17f8',
            title: 'Harmful things',
            author: 'Edgard Pazos',
            url: 'www.instagram.com/blogs',
            likes: 10,
            __v: 0
        },
        {
            _id: '5aedefra4bg573h76234d17f8',
            title: 'Another blog',
            author: 'Edgard Pazos',
            url: 'www.instagram.com/blogs',
            likes: 4,
            __v: 0
        },
        {
            _id: '5ahyd6739hkalsl08988',
            title: 'School Statement',
            author: 'Marlene Inda',
            url: 'www.google.com/blogs',
            likes: 4,
            __v: 0
        },
]


test('dummy returns one', () => {
    let blogs = []

    const result = listHelper.dummy(blogs);
    assert.strictEqual(result, 1);
})

describe('total likes in blogs', () => {
    

    test('with an empty list returns 0', () => {
        let result = listHelper.totalLikes(listWithoutBlog);
        assert.strictEqual(result, 0)
    })

    test('with one blog in the list return its likes', () => {
        let result = listHelper.totalLikes(listWithOneBlog)
        logger.error(result)
        assert.strictEqual(result, listWithOneBlog[0].likes)
    })

    test('with multiple blogs returns it total likes', () => {
        let result = listHelper.totalLikes(listWithMultipleBlogs)
        logger.error(result)
        assert.strictEqual(result, 23)
    })
})

describe('favorite blog', () => {
    test('when the list is empty, return an empty object', () => {
        let result = listHelper.favoriteBlog(listWithoutBlog);
        assert.deepStrictEqual(result, {})
    })

    test('when the list has only one element, returns that element', () => {
        let result = listHelper.favoriteBlog(listWithOneBlog);
        let blog = listWithOneBlog[0]
        let objectBlog = {
            title: blog.title,
            author: blog.author,
            likes: blog.likes
        }
        assert.deepStrictEqual(result, objectBlog)
    })

    test('when the has multiple elements, return the first one with most likes', () => {
        let result = listHelper.favoriteBlog(listWithMultipleBlogs);
        let objectBlog = {
            title: 'Harmful things',
            author: 'Edgard Pazos',
            likes: 10
        }
        assert.deepStrictEqual(result, objectBlog);
    })
})

describe('Most blogs', () => {
    test('when the list is empty return an empty object', () => {
        let result = listHelper.mostBlogs(listWithoutBlog)
        assert.deepStrictEqual(result, {})
    })

    test('when the list has only one element, return that element', () => {
        let result = listHelper.mostBlogs(listWithOneBlog)
        assert.deepStrictEqual(result, { author: listWithOneBlog[0].author, blogs: 1 })
    })

    test('when the list has many elements, return the author with most blogs', () => {
        let result = listHelper.mostBlogs(listWithMultipleBlogs);
        logger.error(result)
        let objectOfAuthor = {
            author: 'Edgard Pazos',
            blogs: 2
        }
        assert.deepStrictEqual(result, objectOfAuthor)
    })
})

describe('Author with most likes', () => {
    test('when the list is empty return an empty object', () => {
        let result = listHelper.mostLikes(listWithoutBlog)
        assert.deepStrictEqual(result, {})
    })

    test('when the list has only one element, return that element', () => {
        let result = listHelper.mostLikes(listWithOneBlog)
        assert.deepStrictEqual(result, { author: listWithOneBlog[0].author, likes: listWithOneBlog[0].likes })
    })

    test('when the list has many elements, return the author with most likes throught the blogs', () => {
        let result = listHelper.mostLikes(listWithMultipleBlogs);
        logger.error(result)
        let objectOfAuthor = {
            author: 'Edgard Pazos',
            likes: 14
        }
        assert.deepStrictEqual(result, objectOfAuthor)
    })
})