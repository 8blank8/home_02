import { Router } from "express";
import { validationCreateOrUpdateBlog } from "../validations/validations-blogs";
import { autorizationMiddleware } from "../middlewares/authorization-middleware";
import { validationCreateOrUpdatePostById } from "../validations/validations-posts";
import { container } from "../composition-root/composition-root";
import { BlogController } from "../controllers/blogs-controller";

const blogController = container.resolve(BlogController)

export const blogsRouter = Router({})

blogsRouter.get(
    '/', 
    blogController.getBlogs.bind(blogController)
)

blogsRouter.get(
    '/:id', 
    blogController.getBlog.bind(blogController)
)

blogsRouter.get(
    '/:id/posts', 
    blogController.getPostsByBlogId.bind(blogController)
)

blogsRouter.post(
    '/', 
    autorizationMiddleware, 
    validationCreateOrUpdateBlog, 
    blogController.createBlog.bind(blogController)
)

blogsRouter.post(
    '/:id/posts', 
    autorizationMiddleware, 
    validationCreateOrUpdatePostById, 
    blogController.createPostByBlogId.bind(blogController)
)

blogsRouter.put(
    '/:id', 
    autorizationMiddleware, 
    validationCreateOrUpdateBlog, 
    blogController.updateBlog.bind(blogController)
)

blogsRouter.delete(
    '/:id', 
    autorizationMiddleware, 
    blogController.deleteBlog.bind(blogController)
)