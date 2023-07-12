import { body } from "express-validator";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";

const validationCommentLikes = [
    body('likeStatus')
        .notEmpty()
        .withMessage('is required')
        .trim()
        .isString()
        .withMessage('should be type string'),
]