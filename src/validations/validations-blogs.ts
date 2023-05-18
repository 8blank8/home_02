import { inputValidationMiddleware } from "../middlewares/input-validation-middleware"
import { body } from "express-validator"

export const validationCreateOrUpdateBlog = [
    body('name')
        .notEmpty()
        .withMessage('name is required')
        .isString()
        .trim()
        .isLength({min: 1, max: 15})
        .withMessage('name must not be empty and name length min 1 max 15'),

    body('description')
        .notEmpty()
        .withMessage('description is required')
        .isString()
        .trim()
        .isLength({min: 1, max: 500})
        .withMessage('description must not be empty and description length min 1 max 15'),

    body('websiteUrl')
        .notEmpty()
        .withMessage('websiteUrl is required')
        .isURL()
        .withMessage('websiteUrl must be URL')
        .isString()
        .trim()
        .isLength({max: 100})
        .withMessage('websiteURL max length 100'),

    inputValidationMiddleware
]