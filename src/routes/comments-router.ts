import { Router} from "express";
import { authMiddleware } from "../middlewares/authMiddlewares";
import { validationComment } from "../validations/validations-comments";
import { commentCheckUserMiddleware } from "../middlewares/comment-check-user-middleware";
import { commentController } from "../composition-root/composition-root";
import { getUserMiddleware } from "../middlewares/get-user-middleware";
import { validationCommentLikes } from "../validations/validation-comment-likes";
import { rateLimitMiddleware } from "../middlewares/rate-limit-middleware";



export const commentsRouter = Router({})

commentsRouter.get(
    '/:id', 
    getUserMiddleware,
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

commentsRouter.put(
    '/:id/like-status',
    rateLimitMiddleware,
    validationCommentLikes,
    authMiddleware,
    commentController.updateLikeStatusComment.bind(commentController)
)