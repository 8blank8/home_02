import { inputValidationMiddleware } from "../middlewares/input-validation-middleware"
import { body } from "express-validator"

export const validationCreateOrUpdateBlog = [
    body('name').notEmpty().withMessage('name is required'),
    body('name').trim().isString().isLength({min: 1, max: 15}).withMessage('name must not be empty and name length min 1 max 15'),
    body('description').notEmpty().withMessage('description is required'),
    body('description').trim().isString().isLength({min: 1, max: 500}).withMessage('description must not be empty and description length min 1 max 15'),
    body('websiteUrl').notEmpty().withMessage('websiteUrl is required'),
    body('websiteUrl').isURL().withMessage('websiteUrl must be URL'),
    body('websiteUrl').trim().isLength({max: 100}).withMessage('websiteURL max length 100'),
    inputValidationMiddleware
]