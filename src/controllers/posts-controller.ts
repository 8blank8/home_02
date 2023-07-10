import { Request, Response } from "express";
import { DEFAULT_QUERY } from "../enum/enumDefaultQuery";
import { STATUS_CODE } from "../enum/enumStatusCode";

import { PostsService } from "../domain/posts-service";
import { CommentsService } from "../domain/comments-service";

import { PostsQueryRepository } from "../repositories/posts-query-repository";
import { CommentsQueryRepository } from "../repositories/comments-query-repository";

export class PostController {

    constructor(
        protected postsService: PostsService,
        protected commentsService: CommentsService,
        protected commentsQueryRepository: CommentsQueryRepository,
        protected postsQueryRepository: PostsQueryRepository
    ){}

    async getPosts(req: Request, res: Response) {
        const {
            sortBy = DEFAULT_QUERY.SORT_BY, 
            sortDirection = DEFAULT_QUERY.SORT_DIRECTION, 
            pageNumber = DEFAULT_QUERY.PAGE_NUMBER, 
            pageSize = DEFAULT_QUERY.PAGE_SIZE
        } = req.query
    
        const posts = await this.postsQueryRepository.findPosts({
            pageNumber: +pageNumber, 
            pageSize: +pageSize,
            sortBy: sortBy.toString(),
            sortDirection: sortDirection
        })
        res.status(STATUS_CODE.OK_200).send(posts)
    }

    async getPost(req: Request, res: Response) {
        const {id} = req.params
    
        const post = await this.postsQueryRepository.findPostById(id)
    
        if(post){
            res.status(STATUS_CODE.OK_200).send(post)
        }else{ 
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        }
    }

    async createPost(req: Request, res: Response) {
        const {title, shortDescription, content, blogId} = req.body
    
        const createdPostId = await this.postsService.createPost({title, shortDescription, content, blogId})
        const post = await this.postsQueryRepository.findPostById(createdPostId)
    
        res.status(STATUS_CODE.CREATED_201).send(post)
    }

    async updatePost(req: Request, res: Response) {
        const {title, shortDescription, content, blogId} = req.body
        const {id} = req.params
    
        const isUpadate = await this.postsService.updatePost({id, title, shortDescription, content, blogId})
    
        if(isUpadate){
            res.sendStatus(STATUS_CODE.NO_CONTENT_204)
        }else{
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        }
    }

    async deletePost(req: Request, res: Response){
        const {id} = req.params
    
        const isDelete = await this.postsService.deletePost(id)
    
        if(isDelete){
            res.sendStatus(STATUS_CODE.NO_CONTENT_204)
        }else{
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        }
    }

    async createCommentByPostId(req: Request, res: Response) {
        const id = req.params.id
        const content = req.body.content
    
        const isPost = await this.postsQueryRepository.findPostById(id)
    
        if(!isPost) return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    
        const commentId = await this.commentsService.createComment({
            id,
            content,
            user:  {
                id: req.user!.id,
                login: req.user!.login
            }
        })
    
        const comment = await this.commentsQueryRepository.findCommentById(commentId)
    
        return res.status(STATUS_CODE.CREATED_201).send(comment)
    }

    async getCommentByPostId(req: Request, res: Response) {
        const id = req.params.id
        const {pageNumber, pageSize, sortBy, sortDirection} = req.query
    
        const isPost = await this.postsQueryRepository.findPostById(id)
    
        if(!isPost) return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    
        const comments = await this.commentsQueryRepository.findComments(id, {
            pageNumber: pageNumber?.toString(),
            sortBy: sortBy?.toString(),
            sortDirection: sortDirection,
            pageSize: pageSize?.toString()
        })
    
        return res.status(STATUS_CODE.OK_200).send(comments)
    }
}
