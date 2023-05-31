import { Router, Request, Response } from "express";
import { commentsQueryRepository } from "../repositories/comments-query-repository";
import { STATUS_CODE } from "../enum/enumStatusCode";
import { commentsService } from "../domain/comments-service";
import { authMiddleware } from "../middlewares/authMiddlewares";
import { validationComment } from "../validations/validations-comments";
import { commentCheckUserMiddleware } from "../middlewares/comment-check-user-middleware";


export const commentsRouter = Router({})

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id

    const comment = await commentsQueryRepository.findCommentById(id)

    if(!comment) return res.sendStatus(STATUS_CODE.NOT_FOUND_404)

    return res.status(STATUS_CODE.OK_200).send(comment)
})

commentsRouter.delete('/:id', 
authMiddleware,
commentCheckUserMiddleware,
async (req: Request, res: Response) => {
    const id = req.params.id
   
    await commentsService.deleteComment(id)

    return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
})

commentsRouter.put('/:id', 
authMiddleware,
validationComment,
commentCheckUserMiddleware,
async (req: Request, res: Response) => {
    const id = req.params.id
    const content = req.body.content

    await commentsService.updateComment(id, content)

    return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
})