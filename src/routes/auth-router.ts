import { Router, Request, Response } from "express";
import { STATUS_CODE } from "../enum/enumStatusCode";
import { validationAuth, validationConfirmationCode, validationConfirmationEmail } from "../validations/validations-auth";
import { jwtService } from "../application/jwt-service";
import { authMiddleware } from "../middlewares/authMiddlewares";
import { authService } from "../domain/auth-service";
import { usersQueryRepository } from "../repositories/users-query-repository";
import { validationUser } from "../validations/validations-user";

export const authRouter = Router({})

authRouter.post('/login', 
validationAuth,
async (req: Request, res: Response) => {
    const {loginOrEmail, password} = req.body  

    const user = await authService.checkCredentials({loginOrEmail, password})

    if(!user){
        res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
        return
    }   
    
    const token = await jwtService.createJWT(user)
    res.status(STATUS_CODE.OK_200).send(token)
})

authRouter.get('/me', 
authMiddleware,
async (req: Request, res: Response) => {
    const email = req.user!.email
    const login = req.user!.login
    const userId = req.user!.id

    return res.status(STATUS_CODE.OK_200).send({email, login, userId})
})

authRouter.post('/registration', 
validationUser,
async (req: Request, res: Response) => {
    const {login, email, password} = req.body 

    await authService.createUser({login, email, password}, false)

    return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
})

authRouter.post('/registration-confirmation', 
validationConfirmationCode,
async (req: Request, res: Response) => {
    const {code} = req.body

    const isConfirm = await authService.confirmationEmail(code)

    if(!isConfirm) return res.sendStatus(STATUS_CODE.BAD_REQUEST_400)

    return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
})

authRouter.post('/registration-email-resending', 
validationConfirmationEmail,
async (req: Request, res: Response) => {

    const email = req.body.email

    const isUpdateCode = await authService.resendConfirmationCode(email)
    if(!isUpdateCode) return res.sendStatus(STATUS_CODE.BAD_REQUEST_400)

    return res.sendStatus(STATUS_CODE.NO_CONTENT_204) 

})