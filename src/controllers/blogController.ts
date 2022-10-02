import Blog from '../models/blog.model'
import BlogPost from '../interfaces/blog-post.interface'
import { BlogModel } from '../interfaces/blog-model.interface';
import { Request, Response } from 'express'


const blog_index = (req: Request, res: Response) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result: BlogPost[]) => {
            res.render('index', { title: 'All blogs', blogs: result })
        })
        .catch((err) => {
            console.log(err)
        })
}

const blog_details = (req: Request, res: Response) => {
    const id: string = req.params.id // get the id from the request params
    Blog.findById(id).sort({ createdAt: -1 })
        .then((result: BlogPost) => {
            res.render('details', { title: 'Blog details', blog: result })
        })
        .catch((err) => {
            console.log(err)
        })
}

const blog_create_get = (req: Request, res: Response) => { res.render('create', { title: 'Create a blog post' }) }

const blog_create_post = (req: Request, res: Response) => {
    const blog: BlogModel = new Blog(
        req.body
    )
    blog.save()
        .then((result) => {
            console.log('new blog post created')
            res.redirect('/blogs')
        })
        .catch((err) => {
            console.log(err)
        })
}

const blog_delete = (req: Request, res: Response) => {
    const id: string = req.params.id
    Blog.findByIdAndDelete(id)
        .then((result: BlogPost) => {
            // after performing an AJAX request from the browser (the fetch call from the script tag), in Node, we can't do a redirect.
            // that's why we'll send back some JSON with a redirect property.
            res.json({ redirect: '/blogs' })
        })
        .catch((err) => {
            console.log(err)
        })
}

export default { blog_index, blog_details, blog_create_get, blog_create_post, blog_delete } 