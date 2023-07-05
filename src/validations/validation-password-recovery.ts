import { body } from "express-validator";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";

export const validationEmail = [
    body('email')
        .notEmpty()
        .withMessage('email is required')
        .isString()
        .trim()
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .withMessage('email should be email'),

        inputValidationMiddleware
]


export const validationPassword = [
    body('newPassword')
        .notEmpty().withMessage('password is required')
        .isString()
        .trim()
        .isLength({min: 6, max: 20}).withMessage('password min length 6 max 20'),
    inputValidationMiddleware
]