const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    if(blogs.length === 0) return 0;

    return blogs.reduce((acc, ele) => {
        return acc + ele.likes
    }, 0)
}


const favoriteBlog = (blogs) => {
    if(blogs.length === 0) return {};
    if(blogs.length === 1) {
        let blog = blogs[0];
        return {
            title: blog.title,
            author: blog.author,
            likes: blog.likes
        }
    }

    let likesArray = blogs.map((blog) => blog.likes);
    let mostPopularBlog = Math.max(...likesArray);
    let indexOfFavoriteBlog = likesArray.indexOf(mostPopularBlog);

    return {
        title: blogs[indexOfFavoriteBlog].title,
        author: blogs[indexOfFavoriteBlog].author,
        likes: blogs[indexOfFavoriteBlog].likes
    }
}

const mostBlogs = (blogs) => {
    if(blogs.length === 0) return {}
    if(blogs.length === 1) {
        let blog = blogs[0];
        return {
            author: blog.author,
            blogs: 1
        }
    }

    let authorBlogsArray = [];

    blogs.forEach((b) => {
        if(authorBlogsArray.map((ele) => ele.author).includes(b.author)) {
            let authorObject = authorBlogsArray.find((blog) => blog.author === b.author)
            authorObject.blogs++
        }

        authorBlogsArray.push({
            author: b.author,
            blogs: 1
        })
    })

    let numberOfBlogsArray = authorBlogsArray.map((b) => b.blogs);
    let maxNumberOfBlogs = Math.max(...numberOfBlogsArray)
    let indexOfBestBlogger = numberOfBlogsArray.indexOf(maxNumberOfBlogs);

    return {
        author: authorBlogsArray[indexOfBestBlogger].author,
        blogs: authorBlogsArray[indexOfBestBlogger].blogs
    }
}


const mostLikes = (blogs) => {
    if(blogs.length === 0) return {}
    if(blogs.length === 1) {
        let blog = blogs[0];
        return {
            author: blog.author,
            likes: blog.likes
        }
    }

    let authorLikesArray = [];

    blogs.forEach((b) => {
        if(authorLikesArray.map((ele) => ele.author).includes(b.author)) {
            let authorObject = authorLikesArray.find((blog) => blog.author === b.author)
            authorObject.likes+= b.likes
        }

        authorLikesArray.push({
            author: b.author,
            likes: b.likes
        })
    })

    let numberOfLikesArray = authorLikesArray.map((b) => b.likes);
    let maxNumberOfLikes = Math.max(...numberOfLikesArray)
    let indexOfBestBlogger = numberOfLikesArray.indexOf(maxNumberOfLikes);

    return {
        author: authorLikesArray[indexOfBestBlogger].author,
        likes: authorLikesArray[indexOfBestBlogger].likes
    }
}


module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };