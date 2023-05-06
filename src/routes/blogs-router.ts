import { Router, Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs-repository";
import { validationCreateOrUpdateBlog } from "../validations/validations-blogs";
import { autorizationMiddleware } from "../middlewares/authorization-middleware";


export const blogsRouter = Router({})

blogsRouter.get('/', (req: Request, res: Response)=>{
    const blogs = blogsRepository.findBlogs()
    res.status(200).send(blogs)
})

blogsRouter.get('/:id', (req: Request, res: Response)=>{
    const {id} = req.params

    const blog = blogsRepository.findBlogsById(id)
    
    if(blog){
        res.status(200).send(blog)
    }else{
        res.sendStatus(404)
    }
})

blogsRouter.post('/',
autorizationMiddleware, 
validationCreateOrUpdateBlog,
(req: Request, res: Response)=>{
    const {name, description, websiteUrl} = req.body

    const cretatedBlog = blogsRepository.createBlog({name, description, websiteUrl})
    res.status(201).send(cretatedBlog)
})

blogsRouter.put('/:id',
autorizationMiddleware, 
validationCreateOrUpdateBlog,
(req: Request, res: Response)=>{
    const {name, description, websiteUrl} = req.body
    const {id} = req.params

    const isUpdate = blogsRepository.updateBlog({id, name, description, websiteUrl})
    
    if(isUpdate){
        res.sendStatus(204)
    }else{
        res.sendStatus(404)
    }
})

blogsRouter.delete('/:id', 
autorizationMiddleware,
(req: Request, res: Response)=>{
    const {id} = req.params
    
    const isDelete = blogsRepository.deleteBlog(id)
    
    if(isDelete){
        res.sendStatus(204)
    }else{
        res.sendStatus(404)
    }
})