import { Router} from "express";
import { authMiddleware } from "../middlewares/authMiddlewares";
import { validationComment } from "../validations/validations-comments";
import { commentCheckUserMiddleware } from "../middlewares/comment-check-user-middleware";
import { getUserMiddleware } from "../middlewares/get-user-middleware";
import { validationCommentLikes } from "../validations/validation-comment-likes";
import { rateLimitMiddleware } from "../middlewares/rate-limit-middleware";
import { container } from "../composition-root/composition-root";
import { CommentController } from "../controllers/comments-controller";


const commentController = container.resolve(CommentController)

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
    authMiddleware,
    validationCommentLikes,
    commentController.updateLikeStatusComment.bind(commentController)
)