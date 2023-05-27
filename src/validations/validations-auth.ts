import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { body } from "express-validator";

export const validationAuth = [
    body('loginOrEmail')
        .notEmpty()
        .withMessage('is required')
        .trim()
        .isString()
        .withMessage('should be type string'),

    body('password')
        .notEmpty()
        .withMessage('password is reqiured')
        .trim()
        .isString()
        .withMessage('password should be type string'),
    inputValidationMiddleware
]
