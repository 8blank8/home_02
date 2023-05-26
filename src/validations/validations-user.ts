import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { body } from "express-validator";

export const validationUser = [
    body('login')
        .notEmpty().withMessage('login is required')
        .isString()
        .trim()
        .isLength({min: 3, max: 10}).withMessage('login length min 3 max 10')
        .matches(/^[a-zA-Z0-9_-]*$/).withMessage('incorrect login'),

    body('email')
        .notEmpty().withMessage('email is required')
        .isString()
        .trim()
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .withMessage('email should be email'),

    body('password')
        .notEmpty().withMessage('password is required')
        .isString()
        .trim()
        .isLength({min: 6, max: 20}).withMessage('password min length 6 max 20'),
    inputValidationMiddleware
]
