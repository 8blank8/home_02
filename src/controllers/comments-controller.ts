import { Request, Response } from "express";
import { STATUS_CODE } from "../enum/enumStatusCode";
import { CommentsService } from "../domain/comments-service";
import { CommentsQueryRepository } from "../repositories/comments-query-repository";
import { inject, injectable } from "inversify";


@injectable()
export class CommentController {
    
    constructor(
        @inject(CommentsService) protected commentsService: CommentsService,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository
    ){}

    async getComments(req: Request, res: Response) {
        const id = req.params.id
        const userId = req.user?.id
    
        const comment = await this.commentsQueryRepository.findCommentById(id, userId)
    
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

    async updateLikeStatusComment(req: Request, res: Response){
        const id = req.params.id
        const likeStatus = req.body.likeStatus
        const userId = req.user!.id

        const comment = await this.commentsQueryRepository.findCommentById(id, userId)
        if(!comment) return res.sendStatus(STATUS_CODE.NOT_FOUND_404)

        const isUpdate = await this.commentsService.updateLikeStatus(id, likeStatus, userId)
        if(!isUpdate) return res.sendStatus(STATUS_CODE.BAD_REQUEST_400)
 
        return res.sendStatus(STATUS_CODE.NO_CONTENT_204)

    }
}