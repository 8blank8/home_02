import { Router, Request, Response } from "express";
import { STATUS_CODE } from "../enum/enumStatusCode";
import { validationAuth, validationConfirmationCode, validationConfirmationEmail } from "../validations/validations-auth";
import { jwtService } from "../application/jwt-service";
import { authMiddleware } from "../middlewares/authMiddlewares";
import { authService } from "../domain/auth-service";
import { validationUser } from "../validations/validations-user";
import { usersQueryRepository } from "../repositories/users-query-repository";
import { refreshTokenMiddleware } from "../middlewares/refresh-token-middleware";
import { securityService } from "../domain/security-service";
import { v4 as uuidv4 } from "uuid";

export const authRouter = Router({})

authRouter.post('/login', 
validationAuth,
async (req: Request, res: Response) => {
    const {loginOrEmail, password} = req.body  
    const ip = req.ip
    const title = req.headers['user-agent']

    const user = await authService.checkCredentials({loginOrEmail, password})
    if(!user) return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
       
    const deviceId = uuidv4()

    const accessToken = await jwtService.createAccessToken(user.id)
    const refreshToken = await jwtService.createRefreshToken(deviceId, user.id)

    // const date = await jwtService.getDatesToken(refreshToken)
    // if(!date) return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
    const date = new Date()
    await securityService.postDevice({
        ip: ip,
        title: title,
        lasActiveDate: date.toISOString(),
        experationDate: date.toISOString(),
        userId: user.id,
        deviceId: deviceId
    })

    return res
        .cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
        .status(STATUS_CODE.OK_200)
        .send(accessToken)
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
    
    const updateToken = await securityService.updateDates(refreshToken)
    if(!updateToken) return res.sendStatus(STATUS_CODE.BAD_REQUEST_400)

    return res
        .cookie('refreshToken', updateToken.newRefreshToken , {httpOnly: true, secure: true})
        .status(STATUS_CODE.OK_200)
        .send(updateToken.newAccessToken)
})

authRouter.post('/logout',
refreshTokenMiddleware,
async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    const deviceId = await jwtService.getDeviceIdByToken(refreshToken)

    const isDelete = await securityService.deleteOneDevice(deviceId)
    if(!isDelete) return res.sendStatus(STATUS_CODE.BAD_REQUEST_400)

    return res
        .clearCookie('refreshToken')
        .sendStatus(STATUS_CODE.NO_CONTENT_204)
})