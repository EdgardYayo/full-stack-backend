require('dotenv').config()


PORT = process.env.PORT
MONGO_URI = process.env.NODE_ENV === 'test' 
    ? process.env.TEST_MONGO_URI
    : process.env.MONGO_URI

console.log("NODE_ENV: " + process.env.NODE_ENV);
console.log("MONGO_URI: " + MONGO_URI);

    
module.exports = {
    PORT,
    MONGO_URI
}