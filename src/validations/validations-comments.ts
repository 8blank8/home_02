import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { body } from "express-validator";

export const validationComment = [
    body('content')
        .notEmpty()
        .withMessage('content is required')
        .trim()
        .isString()
        .withMessage('content type should be string')
        .isLength({min: 20, max: 300})
        .withMessage('content length min: 20, max: 300'),
        inputValidationMiddleware
]