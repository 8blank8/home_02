import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { body } from "express-validator";
import { blogsRepository } from "../repositories/blogs-repository";

export const validationCreateOrUpdatePost = [
    body('title').notEmpty().withMessage('title is required'),
    body('title').isString().trim().isLength({min: 1, max: 30}).withMessage('title length min 1 max 30'),
    body('shortDescription').notEmpty().withMessage('shortDescription is required'),
    body('shortDescription').isString().trim().isLength({min: 1, max: 100}).withMessage('shortDescription length min 1 max 100'),
    body('content').notEmpty().withMessage('content is required'),
    body('content').isString().trim().isLength({min: 1, max: 1000}).withMessage('content length min 1 max 1000'),
    body('blogId').notEmpty().withMessage('blogId is required'),
    body('blogId').isString().trim().withMessage('blogId must be string'),
    body('blogId').custom(async (id)=> await blogsRepository.findBlogsById(id) === null).withMessage('blog not found'),
    inputValidationMiddleware
]


