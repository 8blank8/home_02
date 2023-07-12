import { body } from "express-validator";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { LIKE_STATUS } from "../enum/enumLikeStatus";

export const validationCommentLikes = [
    body('likeStatus')
        .notEmpty()
        .withMessage('is required')
        .trim()
        .isString()
        .withMessage('should be type string')
        .custom((likeStatus) => {
            const res = [LIKE_STATUS.LIKE, LIKE_STATUS.DISLIKE, LIKE_STATUS.NONE].find(item => likeStatus === item)
            if(!res){
                throw Error('incorrect data')
            }
            return true
        }),
    inputValidationMiddleware
]