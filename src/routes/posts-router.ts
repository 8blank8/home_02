import { Router, Request, Response } from "express";
import { postsService } from "../domain/posts-service";
import { postsQueryRepository } from "../repositories/posts-query-repository";
import { autorizationMiddleware } from "../middlewares/authorization-middleware"
import { STATUS_CODE } from "../enum/enumStatusCode";
import { validationCreateOrUpdatePostAll } from "../validations/validations-posts";
import { authMiddleware } from "../middlewares/authMiddlewares";
import { commentsService } from "../domain/comments-service";
import { commentsQueryRepository } from "../repositories/comments-query-repository";
import { validationComment } from "../validations/validations-comments";
import { DEFAULT_QUERY } from "../enum/enumDefaultQuery";


export const postsRouter = Router({}) 

class PostController {

    async getPosts(req: Request, res: Response) {
        const {
            sortBy = DEFAULT_QUERY.SORT_BY, 
            sortDirection = DEFAULT_QUERY.SORT_DIRECTION, 
            pageNumber = DEFAULT_QUERY.PAGE_NUMBER, 
            pageSize = DEFAULT_QUERY.PAGE_SIZE
        } = req.query
    
        const posts = await postsQueryRepository.findPosts({
            pageNumber: +pageNumber, 
            pageSize: +pageSize,
            sortBy: sortBy.toString(),
            sortDirection: sortDirection
        })
        res.status(STATUS_CODE.OK_200).send(posts)
    }

    async getPost(req: Request, res: Response) {
        const {id} = req.params
    
        const post = await postsQueryRepository.findPostById(id)
    
        if(post){
            res.status(STATUS_CODE.OK_200).send(post)
        }else{ 
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        }
    }

    async createPost(req: Request, res: Response) {
        const {title, shortDescription, content, blogId} = req.body
    
        const createdPostId = await postsService.createPost({title, shortDescription, content, blogId})
        const post = await postsQueryRepository.findPostById(createdPostId)
    
        res.status(STATUS_CODE.CREATED_201).send(post)
    }

    async updatePost(req: Request, res: Response) {
        const {title, shortDescription, content, blogId} = req.body
        const {id} = req.params
    
        const isUpadate = await postsService.updatePost({id, title, shortDescription, content, blogId})
    
        if(isUpadate){
            res.sendStatus(STATUS_CODE.NO_CONTENT_204)
        }else{
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        }
    }

    async deletePost(req: Request, res: Response){
        const {id} = req.params
    
        const isDelete = await postsService.deletePost(id)
    
        if(isDelete){
            res.sendStatus(STATUS_CODE.NO_CONTENT_204)
        }else{
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        }
    }

    async createCommentByPostId(req: Request, res: Response) {
        const id = req.params.id
        const content = req.body.content
    
        const isPost = await postsQueryRepository.findPostById(id)
    
        if(!isPost) return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    
        const commentId = await commentsService.createComment({
            id,
            content,
            user:  {
                id: req.user!.id,
                login: req.user!.login
            }
        })
    
        const comment = await commentsQueryRepository.findCommentById(commentId)
    
        return res.status(STATUS_CODE.CREATED_201).send(comment)
    }

    async getCommentByPostId(req: Request, res: Response) {
        const id = req.params.id
        const {pageNumber, pageSize, sortBy, sortDirection} = req.query
    
        const isPost = await postsQueryRepository.findPostById(id)
    
        if(!isPost) return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    
        const comments = await commentsQueryRepository.findComments(id, {
            pageNumber: pageNumber?.toString(),
            sortBy: sortBy?.toString(),
            sortDirection: sortDirection,
            pageSize: pageSize?.toString()
        })
    
        return res.status(STATUS_CODE.OK_200).send(comments)
    }
}

const postController = new PostController()

postsRouter.get('/', postController.getPosts)
postsRouter.get('/:id', postController.getPost)
postsRouter.post('/', autorizationMiddleware, validationCreateOrUpdatePostAll, postController.createPost)
postsRouter.put('/:id', autorizationMiddleware, validationCreateOrUpdatePostAll, postController.updatePost)
postsRouter.delete('/:id', autorizationMiddleware, postController.deletePost)
postsRouter.post('/:id/comments', authMiddleware, validationComment, postController.createCommentByPostId)
postsRouter.get('/:id/comments', postController.getCommentByPostId)