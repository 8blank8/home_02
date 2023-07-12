import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { body, param } from "express-validator";
import { BlogsQueryRepository } from "../repositories/blogs-query-repository";

const blogsQueryRepository = new BlogsQueryRepository()

const validationCreateOrUpdatePost = [
    body('title')
        .notEmpty()
        .withMessage('title is required')
        .isString()
        .trim()
        .isLength({min: 1, max: 30})
        .withMessage('title length min 1 max 30'),

    body('shortDescription')
        .notEmpty()
        .withMessage('shortDescription is required')
        .isString().trim()
        .isLength({min: 1, max: 100})
        .withMessage('shortDescription length min 1 max 100'),
    
    body('content')
        .notEmpty()
        .withMessage('content is required')
        .isString()
        .trim()
        .isLength({min: 1, max: 1000})
        .withMessage('content length min 1 max 1000'),
]

export const validationCreateOrUpdatePostAll = [
    ...validationCreateOrUpdatePost,
    body('blogId')
        .notEmpty()
        .withMessage('blogId is required')
        .isString()
        .trim()
        .withMessage('blogId must be string'),

    body('blogId').custom(async (id)=> {
        const isBlog = await blogsQueryRepository.findBlogsById(id)

        if(isBlog === null){
            throw Error('blog not found')
        } 
    }),
    inputValidationMiddleware
]

export const validationCreateOrUpdatePostById = [
    ...validationCreateOrUpdatePost,
    param('id').custom(async (id) => {
        
        const isBlog = await blogsQueryRepository.findBlogsById(id)

        if(isBlog === null){
            throw Error('blog not found')
        } 
    }),
    inputValidationMiddleware
]
