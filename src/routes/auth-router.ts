import { Router, Request, Response } from "express";
import { STATUS_CODE } from "../enum/enumStatusCode";
import { validationAuth, validationConfirmationCode, validationConfirmationEmail } from "../validations/validations-auth";
import { jwtService } from "../application/jwt-service";
import { authMiddleware } from "../middlewares/authMiddlewares";
import { authService } from "../domain/auth-service";
import { validationUser } from "../validations/validations-user";
import { usersQueryRepository } from "../repositories/users-query-repository";
import { refreshTokenMiddleware } from "../middlewares/refresh-token-middleware";

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

    return res
        .cookie('refreshToken', token.refreshToken, {httpOnly: true, secure: true})
        .status(STATUS_CODE.OK_200)
        .send({accessToken: token.accessToken})
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

    const isConfirm = await authService.confirmationCode(code)

    if(!isConfirm) return res.status(STATUS_CODE.BAD_REQUEST_400).send({ errorsMessages: [{ message: 'code invalid', field: "code" }] })

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

authRouter.post('/refresh-token', 
refreshTokenMiddleware,
async (req:Request, res: Response) => {
    
    const refreshToken = req.cookies.refreshToken

    const user = await jwtService.getFullUserByToken(refreshToken)
    if(!user) return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)

    await jwtService.postRefreshToken(refreshToken)

    const token = await jwtService.createJWT(user)

    return res
        .cookie('refreshToken', token.refreshToken , {httpOnly: true, secure: true})
        .status(STATUS_CODE.OK_200)
        .send({accessToken: token.accessToken})
})

authRouter.post('/logout',
refreshTokenMiddleware,
async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    await jwtService.postRefreshToken(refreshToken)

    return res
        .clearCookie('refreshToken')
        .sendStatus(STATUS_CODE.NO_CONTENT_204)
})