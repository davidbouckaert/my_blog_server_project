const mongoose = require('mongoose')
const Schema = mongoose.Schema; //constructor function to create a new schema


//create schema
const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, 
{timestamps: true
})

//create model based on schema
//because the use of 'Blog' mongoose will automatically search for a collection called blogs, we don't have to pass it.
const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog;

