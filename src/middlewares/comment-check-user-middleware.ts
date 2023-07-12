import { Request, Response, NextFunction } from "express";
import { CommentsQueryRepository } from "../repositories/comments-query-repository";
import { STATUS_CODE } from "../enum/enumStatusCode";

export const commentCheckUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const commentsQueryRepository = new CommentsQueryRepository()

    const id = req.params.id

    const comment = await commentsQueryRepository.findCommentById(id, req.user!.id)

    if(!comment) return res.sendStatus(STATUS_CODE.NOT_FOUND_404)

    if(comment.commentatorInfo.userId !== req.user!.id) return res.sendStatus(STATUS_CODE.FORBIDDEN_403)

    next()
    return
}
