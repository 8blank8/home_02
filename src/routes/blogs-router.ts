import { Router, Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs-repository";
import { validationCreateOrUpdateBlog } from "../validations/validations-blogs";
import { autorizationMiddleware } from "../middlewares/authorization-middleware";
import { STATUS_CODE } from "../enum/enumStatusCode"; 

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response)=>{
    const blogs = await blogsRepository.findBlogs()
    res.status(STATUS_CODE.OK_200).send(blogs)
})

blogsRouter.get('/:id',  async (req: Request, res: Response)=>{
    const {id} = req.params

    const blog = await blogsRepository.findBlogsById(id)
    
    if(blog){
        res.status(STATUS_CODE.OK_200).send(blog)
    }else{
        res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }
})

blogsRouter.post('/',
autorizationMiddleware, 
validationCreateOrUpdateBlog,
async (req: Request, res: Response)=>{
    const {name, description, websiteUrl} = req.body

    const cretatedBlog = await blogsRepository.createBlog({name, description, websiteUrl})
    res.status(STATUS_CODE.CREATED_201).send(cretatedBlog)
})

blogsRouter.put('/:id',
autorizationMiddleware, 
validationCreateOrUpdateBlog,
async (req: Request, res: Response)=>{
    const {name, description, websiteUrl} = req.body
    const {id} = req.params

    const isUpdate = await blogsRepository.updateBlog({id, name, description, websiteUrl})
    
    if(isUpdate){
        res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    }else{
        res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }
})

blogsRouter.delete('/:id', 
autorizationMiddleware,
async (req: Request, res: Response)=>{
    const {id} = req.params
    
    const isDelete = await blogsRepository.deleteBlog(id)
    
    if(isDelete){
        res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    }else{
        res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }
})