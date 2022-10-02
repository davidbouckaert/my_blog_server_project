import express, { Router } from 'express';
import { Request, Response } from 'express'
import Blog from '../models/blog.model'
import BlogPost from '../interfaces/blog-post.interface'
import { BlogModel } from '../interfaces/blog-model.interface';
import blogController from '../controllers/blogController'

// create app
const router: Router = express.Router() // no longer create an app, but rather a router

// replace app. with router.
// since we're scoping the /blogs (app.use(blogRoutes)) - the '/blogs' in here become '/'
// this is the first way of doing this, creating and invoking the call back function here..
/* router.get('/', (req:Request, res:Response) =>{
    Blog.find().sort({createdAt: -1})
    .then((result:BlogPost[])=>{
        res.render('index', { title: 'All blogs', blogs:result })
    })
    .catch((err)=>{
        console.log(err)
    })
}) */
// this is the second way: using the MVC model and using a seperate controller
router.get('/', blogController.blog_index)

router.post('/', blogController.blog_create_post)

router.get('/create', blogController.blog_create_get)

router.get('/:id', blogController.blog_details)

router.delete('/:id', blogController.blog_delete)

export default router