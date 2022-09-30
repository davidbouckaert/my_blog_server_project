import express, { Application } from 'express';
import {Request, Response, NextFunction} from 'express'
import morgan from 'morgan'
import helmet from 'helmet';
import mongoose, { ConnectOptions } from 'mongoose';
import fs from 'fs';
import path from 'path'
const MONGO_ATLAS_CONNECTION_STRING:string = process.env.MONGO_ATLAS_CONNECTION_STRING;
import Blog from './models/blog.model'
import BlogPost from './interfaces/blog-post.interface'

// create app
const app:Application = express()

// security headers
app.use(helmet())

// connect to Mongodb
mongoose.connect(MONGO_ATLAS_CONNECTION_STRING, {useNewUrlParser:true, useUnifiedTopology:true} as ConnectOptions)
.then((result) =>{
    console.log('Connected to Mongodb Atlas')
    // listen for requests
    app.listen(3000)
})
.catch((err) =>{
    console.log(err)
})

// register view engine
app.set('view engine', 'ejs')

// re-configuring the views directory (no longer default ./views)
app.set('views', path.join(__dirname, './views'))

// serve static content
app.use(express.static(path.join(__dirname, './public')))

// log to console
app.use(morgan('combined'))

// log to access.log
app.use(morgan('combined', {
    stream: fs.createWriteStream('./access.log', {flags: 'a'})
}));

// mongoose and mongo sandbox routes
 app.get('/add-blog', (req, res) =>{
    const blog = new Blog({
        title: 'New Blog 2',
        snippet:'This is a test for mongo 2',
        body: 'More details about this test blog 2'
    })

    blog.save() //save to database
    .then((result)=>{
        res.send(result) //send the response back to the browser
    }).catch((err)=>{
        console.log(err)
    })
})

/*
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
app.get('/', (req:Request, res:Response) => {
    res.redirect('/blogs')
})

app.get('/about', (req:Request, res:Response) => {
    res.render('about', { title: 'About' })
})

// blog routes
app.get('/blogs/create', (req:Request, res:Response) => {
    res.render('create', { title: 'Create a blog post' })
})

// get all blogs with the find() method. Then render them inside the 'index' view as the property 'blogs'.
app.get('/blogs', (req:Request, res:Response) =>{
    Blog.find().sort({createdAt: -1})
    .then((result:BlogPost[])=>{
        res.render('index', { title: 'All blogs', blogs:result })
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.use((req:Request, res:Response) => {
    res.status(404).render('404', { title: '404' })
})


