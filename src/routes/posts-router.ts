import { Router, Request, Response } from "express";
import { postsRepository } from "../repositories/posts-repository";
import { validationCreateOrUpdatePost } from "../validations/validations-posts";
import { autorizationMiddleware } from "../middlewares/authorization-middleware"


export const postsRouter = Router({})

postsRouter.get('/', (req: Request, res: Response)=>{
    const posts = postsRepository.findPosts()
    res.status(200).send(posts)
})

postsRouter.get('/:id', (req: Request, res: Response)=>{
    const {id} = req.params

    const post = postsRepository.findPostById(id)

    if(post){
        res.status(200).send(post)
    }else{
        res.sendStatus(404)
    }
})

postsRouter.post('/', 
autorizationMiddleware,
validationCreateOrUpdatePost,
(req: Request, res: Response)=>{
    const {title, shortDescription, content, blogId} = req.body

    const createdPost = postsRepository.createPost({title, shortDescription, content, blogId})

    res.status(201).send(createdPost)
})

postsRouter.put('/:id', 
autorizationMiddleware,
validationCreateOrUpdatePost,
(req: Request, res: Response)=>{
    const {title, shortDescription, content, blogId} = req.body
    const {id} = req.params

    const isUpadate = postsRepository.updatePost({id, title, shortDescription, content, blogId})

    if(isUpadate){
        res.sendStatus(204)
    }else{
        res.sendStatus(404)
    }
})

postsRouter.delete('/:id', 
autorizationMiddleware,
(req: Request, res: Response)=>{
    const {id} = req.params

    const isDelete = postsRepository.deletePost(id)

    if(isDelete){
        res.sendStatus(204)
    }else{
        res.sendStatus(404)
    }
})