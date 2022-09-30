const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const fs = require('fs')
const MONGO_ATLAS_CONNECTION_STRING = process.env.MONGO_ATLAS_CONNECTION_STRING
const Blog = require('./models/blog')
const { get } = require('http')

// create app
const app = express()

// connect to Mongodb
mongoose.connect(MONGO_ATLAS_CONNECTION_STRING, {useNewUrlParser:true, useUnifiedTopology:true})
.then((result)=>{
    console.log('Connected to Mongodb Atlas')
    // listen for requests
    app.listen(3000)
})
.catch((err) =>{
    console.log(err)
})

// register view engine
app.set('view engine', 'ejs')

// serve static content
app.use(express.static('public'))

// log to console
app.use(morgan('combined'))

// log to access.log
app.use(morgan('combined', {
    stream: fs.createWriteStream('./access.log', {flags: 'a'})
}));

// mongoose and mongo sandbox routes
/* app.get('/add-blog', (req, res) =>{
    const blog = new Blog({
        title: 'New Blog',
        snippet:'This is a test for mongo',
        body: 'More details about this test blog'
    })

    blog.save() //save to database
    .then((result)=>{
        res.send(result) //send the response back to the browser
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/all-blogs', (req,res)=>{
    Blog.find() // gets all documents inside the blogs collection
    .then((result)=>{
        res.send(result)
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/single-blog',(req,res)=>{
    Blog.findById('6336f01fdb426d9e05101d54') // gets blog with this ID
    .then((result)=> {
        res.send(result)
    }).catch((err)=>{console.log(err)})
}) */

// routs
app.get('/', (req, res) => {
    res.redirect('/blogs')
})

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' })
})

// blog routes
app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a blog post' })
})

// get all blogs with the find() method. Then render them inside the 'index' view as the property 'blogs'.
app.get('/blogs', (req, res)=>{
    Blog.find().sort({createdAt: -1})
    .then((result)=>{
        res.render('index', { title: 'All blogs', blogs:result })
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.use((req, res) => {
    res.status(404).render('404', { title: '404' })
})


