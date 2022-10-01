import express, { Router } from 'express';
import {Request, Response} from 'express'
import Blog from '../models/blog.model'
import BlogPost from '../interfaces/blog-post.interface'
import { BlogModel } from '../interfaces/blog-model.interface';

// create app
const router:Router = express.Router() // no longer create an app, but rather a router

// replace app. with router.
// since we're scoping the /blogs (app.use(blogRoutes)) - the '/blogs' in here become '/'
router.get('/', (req:Request, res:Response) =>{
    Blog.find().sort({createdAt: -1})
    .then((result:BlogPost[])=>{
        res.render('index', { title: 'All blogs', blogs:result })
    })
    .catch((err)=>{
        console.log(err)
    })
})

router.post('/', (req:Request, res:Response) =>{
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

router.get('/create', (req:Request, res:Response) => {
    res.render('create', { title: 'Create a blog post' })
})

router.get('/:id', (req:Request, res:Response) =>{
    const id:string = req.params.id // get the id from the request params
    Blog.findById(id).sort({createdAt: -1})
    .then((result:BlogPost)=>{
        res.render('details', { title: 'Blog details', blog:result })
    })
    .catch((err)=>{
        console.log(err)
    })
})

router.delete('/:id', (req:Request, res:Response) =>{
    const id:string = req.params.id
    Blog.findByIdAndDelete(id)
    .then((result:BlogPost)=>{
        // after performing an AJAX request from the browser (the fetch call from the script tag), in Node, we can't do a redirect.
        // that's why we'll send back some JSON with a redirect property.
        res.json({ redirect: '/blogs'})
    })
    .catch((err)=>{
        console.log(err)
    })
})

export default router