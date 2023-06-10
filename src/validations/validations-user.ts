import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { body } from "express-validator";
import { usersQueryRepository } from "../repositories/users-query-repository";

export const validationUser = [
    body('login')
        .notEmpty().withMessage('login is required')
        .isString()
        .trim()
        .isLength({min: 3, max: 10}).withMessage('login length min 3 max 10')
        .matches(/^[a-zA-Z0-9_-]*$/).withMessage('incorrect login')
        .custom(async (login)=>{
            const user = await usersQueryRepository.findUserByLoginOrEmail(login)
            if(user) throw Error('user is register')
        }),

    body('email')
        .notEmpty().withMessage('email is required')
        .isString()
        .trim()
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .withMessage('email should be email')
        .custom(async (email)=>{
            const user = await usersQueryRepository.findUserByLoginOrEmail(email)
            if(user) throw Error('user is register')
        }),

    body('password')
        .notEmpty().withMessage('password is required')
        .isString()
        .trim()
        .isLength({min: 6, max: 20}).withMessage('password min length 6 max 20'),
    inputValidationMiddleware
]
