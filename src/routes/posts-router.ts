import { Router } from "express";
import { autorizationMiddleware } from "../middlewares/authorization-middleware"
import { validationCreateOrUpdatePostAll } from "../validations/validations-posts";
import { authMiddleware } from "../middlewares/authMiddlewares";
import { validationComment } from "../validations/validations-comments";
import { getUserMiddleware } from "../middlewares/get-user-middleware";
import { container } from "../composition-root/composition-root";
import { PostController } from "../controllers/posts-controller";


const postController = container.resolve(PostController)

export const postsRouter = Router({}) 

postsRouter.get(
    '/', 
    postController.getPosts.bind(postController)
)

postsRouter.get(
    '/:id', 
    postController.getPost.bind(postController)
)

postsRouter.post(
    '/', 
    autorizationMiddleware, 
    validationCreateOrUpdatePostAll, 
    postController.createPost.bind(postController)
)

postsRouter.put(
    '/:id', 
    autorizationMiddleware, 
    validationCreateOrUpdatePostAll, 
    postController.updatePost.bind(postController)
)

postsRouter.delete(
    '/:id', 
    autorizationMiddleware, 
    postController.deletePost.bind(postController)
)

postsRouter.post(
    '/:id/comments', 
    authMiddleware, 
    validationComment, 
    postController.createCommentByPostId.bind(postController)
)

postsRouter.get(
    '/:id/comments',
    getUserMiddleware, 
    postController.getCommentByPostId.bind(postController)
)