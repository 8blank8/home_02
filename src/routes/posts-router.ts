import { Router, Request, Response } from "express";
import { postsService } from "../domain/posts-service";
import { postsQueryRepository } from "../repositories/posts-query-repository";
import { autorizationMiddleware } from "../middlewares/authorization-middleware"
import { STATUS_CODE } from "../enum/enumStatusCode";
import { validationCreateOrUpdatePostAll } from "../validations/validations-posts";


export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response)=>{
    const {sortBy, sortDirection, pageNumber, pageSize} = req.query

    const posts = await postsQueryRepository.findPosts({
        pageNumber: pageNumber?.toString(), 
        pageSize: pageSize?.toString(),
        sortBy: sortBy?.toString(),
        sortDirection: sortDirection?.toString()
    })
    res.status(STATUS_CODE.OK_200).send(posts)
})

postsRouter.get('/:id', async (req: Request, res: Response)=>{
    const {id} = req.params

    const post = await postsQueryRepository.findPostById(id)

    if(post){
        res.status(STATUS_CODE.OK_200).send(post)
    }else{
        res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }
})

postsRouter.post('/', 
autorizationMiddleware,
validationCreateOrUpdatePostAll,
async (req: Request, res: Response)=>{
    const {title, shortDescription, content, blogId} = req.body

    const createdPostId = await postsService.createPost({title, shortDescription, content, blogId})
    const post = await postsQueryRepository.findPostById(createdPostId)

    res.status(STATUS_CODE.CREATED_201).send(post)
})

postsRouter.put('/:id', 
autorizationMiddleware,
validationCreateOrUpdatePostAll,
async (req: Request, res: Response)=>{
    const {title, shortDescription, content, blogId} = req.body
    const {id} = req.params

    const isUpadate = await postsService.updatePost({id, title, shortDescription, content, blogId})

    if(isUpadate){
        res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    }else{
        res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }
})

postsRouter.delete('/:id', 
autorizationMiddleware,
async (req: Request, res: Response)=>{
    const {id} = req.params

    const isDelete = await postsService.deletePost(id)

    if(isDelete){
        res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    }else{
        res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }
})