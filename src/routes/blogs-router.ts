import { Router, Request, Response } from "express";
import { blogsService } from "../domain/blogs-service";
import { postsService } from "../domain/posts-service";
import { blogsQueryRepository } from "../repositories/blogs-query-repository";
import { validationCreateOrUpdateBlog } from "../validations/validations-blogs";
import { autorizationMiddleware } from "../middlewares/authorization-middleware";
import { STATUS_CODE } from "../enum/enumStatusCode"; 
import { validationCreateOrUpdatePost } from "../validations/validations-posts";
import { postsQueryRepository } from "../repositories/posts-query-repository";

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response)=>{
    const {searchNameTerm, sortBy, sortDirection, pageNumber, pageSize} = req.query

    const blogs = await blogsQueryRepository.findBlogs({
        searchNameTerm: searchNameTerm?.toString(),
        pageNumber: Number(pageNumber),
        pageSize: Number(pageSize),
        sortBy: sortBy?.toString(),
        sortDirection: sortDirection?.toString()
    })
    res.status(STATUS_CODE.OK_200).send(blogs)
})

blogsRouter.get('/:id',  async (req: Request, res: Response)=>{
    const {id} = req.params

    const blog = await blogsQueryRepository.findBlogsById(id)
    
    if(blog){
        res.status(STATUS_CODE.OK_200).send(blog)
    }else{
        res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }
})

blogsRouter.get('/:id/posts', async (req: Request, res: Response) => {
    const {id} = req.params
    const {pageSize, pageNumber, sortBy, sortDirection} = req.query

    const posts = await postsQueryRepository.findPosts({
        pageNumber: Number(pageNumber), 
        pageSize: Number(pageSize), 
        sortBy: sortBy?.toString(), 
        sortDirection
    }, id)

    res.status(STATUS_CODE.OK_200).send(posts)
})

blogsRouter.post('/',
autorizationMiddleware, 
validationCreateOrUpdateBlog,
async (req: Request, res: Response)=>{
    const {name, description, websiteUrl} = req.body

    const cretatedBlog = await blogsService.createBlog({name, description, websiteUrl})
    res.status(STATUS_CODE.CREATED_201).send(cretatedBlog)
})

blogsRouter.post('/:id/posts', 
autorizationMiddleware, 
async (req: Request, res: Response) => {
    const {id} = req.params
    const {title, shortDescription, content} = req.body
    
    const isCreated = await postsService.createPost({title, shortDescription, content, blogId: id})
    
    res.sendStatus(STATUS_CODE.CREATED_201)
})

blogsRouter.put('/:id',
autorizationMiddleware, 
validationCreateOrUpdateBlog,
async (req: Request, res: Response)=>{
    const {name, description, websiteUrl} = req.body
    const {id} = req.params

    const isUpdate = await blogsService.updateBlog({id, name, description, websiteUrl})
    
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
    
    const isDelete = await blogsService.deleteBlog(id)
    
    if(isDelete){
        res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    }else{
        res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }
})