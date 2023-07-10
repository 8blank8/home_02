import { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares/authMiddlewares";
import { validationComment } from "../validations/validations-comments";
import { commentCheckUserMiddleware } from "../middlewares/comment-check-user-middleware";
import { commentController } from "../composition-root/composition-root";



export const commentsRouter = Router({})

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