import { Request, Response, NextFunction } from "express";
import { commentsQueryRepository } from "../repositories/comments-query-repository";
import { STATUS_CODE } from "../enum/enumStatusCode";

export const commentCheckUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id

    const comment = await commentsQueryRepository.findCommentById(id)

    if(!comment) return res.sendStatus(STATUS_CODE.NOT_FOUND_404)

    if(comment.commentatorInfo.userId !== req.user!.id) return res.sendStatus(STATUS_CODE.FORBIDDEN_403)

    next()
    return
}
