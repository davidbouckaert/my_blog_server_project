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
import { BlogModel } from './interfaces/blog-model.interface';

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

// this takes all the URL encoded data and passes that into an object (body) that you can use on the request object
app.use(express.urlencoded({extended:true}))

// routs
app.get('/', (req:Request, res:Response) => {
    res.redirect('/blogs')
})

app.get('/about', (req:Request, res:Response) => {
    res.render('about', { title: 'About' })
})

// blog routes
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

app.post('/blogs', (req:Request, res:Response) =>{
    const blog:BlogModel = new Blog(
       // title:req.body.title,
       // snippet:req.body.snippet,
       // body:req.body.body
       req.body
    )
    blog.save()
    .then((result)=> {
        console.log('new blog post created')
        res.redirect('/blogs')
    })
    .catch((err)=>{
        console.log(err)
    })
})

/*app.get('/blogs/:id', (req:Request, res:Response) =>{
    Blog.findById({id:''}).sort({createdAt: -1})
    .then((result:BlogPost)=>{
        res.render('index', { title: 'All blogs', blogs:result })
    })
    .catch((err)=>{
        console.log(err)
    })
})

/* app.put('/blogs/:id', (req:Request, res:Response) =>{
    Blog.findById({id:''}).sort({createdAt: -1})
    .then((result:BlogPost)=>{
        res.render('index', { title: 'All blogs', blogs:result })
    })
    .catch((err)=>{
        console.log(err)
    })
}) */

/*app.delete('/blogs/:id', (req:Request, res:Response) =>{
    Blog.findById({id:''}).sort({createdAt: -1})
    .then((result:BlogPost)=>{
        res.render('index', { title: 'All blogs', blogs:result })
    })
    .catch((err)=>{
        console.log(err)
    })
})*/

app.get('/blogs/create', (req:Request, res:Response) => {
    res.render('create', { title: 'Create a blog post' })
})

app.use((req:Request, res:Response) => {
    res.status(404).render('404', { title: '404' })
})


