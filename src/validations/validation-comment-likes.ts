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
        .custom((likeStatus)=> {
            console.log(likeStatus)
            if(likeStatus !== LIKE_STATUS.LIKE || likeStatus !== LIKE_STATUS.DISLIKE || likeStatus !== LIKE_STATUS.NONE){
                throw Error('data should be ["Like", "Dislike", "None"]')
            }
        }),
    inputValidationMiddleware
]