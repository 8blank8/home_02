import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { body } from "express-validator";
import { usersQueryRepository } from "../repositories/users-query-repository";

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

export const validationConfirmationCode = [
    body('code')
        .notEmpty()
        .withMessage('is required')
        .trim()
        .isString()
        .withMessage('should be type string')
        .custom(async (code)=>{
            const user = await usersQueryRepository.findUserByConfirmationCode(code)
            if(user?.emailConfirmation.isConfirmed) throw Error('code is confirmed')
        }),
    inputValidationMiddleware
]

export const validationConfirmationEmail = [
    body('email')
        .notEmpty()
        .withMessage('is required')
        .trim()
        .isString()
        .withMessage('should be type string')
        .custom(async (email)=>{
            const user = await usersQueryRepository.findUserByLoginOrEmail(email)
            console.log(user)
            if(!user) throw Error('user not found')
            if(user.emailConfirmation.isConfirmed) throw Error('email is confirmed')
        }),
    inputValidationMiddleware
]