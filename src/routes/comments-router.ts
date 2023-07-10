import { Router, Request, Response } from "express";
import { STATUS_CODE } from "../enum/enumStatusCode";
import { authMiddleware } from "../middlewares/authMiddlewares";
import { validationComment } from "../validations/validations-comments";
import { commentCheckUserMiddleware } from "../middlewares/comment-check-user-middleware";

import { CommentsService } from "../domain/comments-service";

import { CommentsQueryRepository } from "../repositories/comments-query-repository";


export const commentsRouter = Router({})

class CommentController {

    commentsService: CommentsService
    commentsQueryRepository: CommentsQueryRepository
    constructor(){
        this.commentsService = new CommentsService()
        this.commentsQueryRepository = new CommentsQueryRepository()
    }

    async getComments(req: Request, res: Response) {
        const id = req.params.id
    
        const comment = await this.commentsQueryRepository.findCommentById(id)
    
        if(!comment) return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    
        return res.status(STATUS_CODE.OK_200).send(comment)
    }

    async deleteComment(req: Request, res: Response) {
        const id = req.params.id
       
        await this.commentsService.deleteComment(id)
    
        return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    }

    async updateComment(req: Request, res: Response) {
        const id = req.params.id
        const content = req.body.content
    
        await this.commentsService.updateComment(id, content)
    
        return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    }
}

const commentController = new CommentController()

commentsRouter.get(
    '/:id', 
    commentController.getComments.bind(commentController)
)

commentsRouter.delete(
    '/:id', 
    authMiddleware, 
    commentCheckUserMiddleware, 
    commentController.deleteComment.bind(commentController)
)

commentsRouter.put(
    '/:id', 
    authMiddleware, 
    validationComment, 
    commentCheckUserMiddleware, 
    commentController.updateComment.bind(commentController)
)