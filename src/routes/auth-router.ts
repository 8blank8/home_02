import { Router, Request, Response } from "express";
import { STATUS_CODE } from "../enum/enumStatusCode";
import { validationAuth, validationConfirmationCode, validationConfirmationEmail } from "../validations/validations-auth";
import { authMiddleware } from "../middlewares/authMiddlewares";
import { validationUser } from "../validations/validations-user";
import { refreshTokenMiddleware } from "../middlewares/refresh-token-middleware";
import { v4 as uuidv4 } from "uuid";
import { rateLimitMiddleware } from "../middlewares/rate-limit-middleware";
import { validationEmail, validationPassword } from "../validations/validation-password-recovery";
import { validationRecoveryCode } from "../validations/validation-recovery-code";

import { JwtService } from "../application/jwt-service";
import { AuthService } from "../domain/auth-service";
import { SecurityService } from "../domain/security-service";


export const authRouter = Router({})

class AuthController {
    
    jwtService: JwtService
    authService: AuthService
    securityService: SecurityService
    constructor(){
        this.jwtService = new JwtService()
        this.authService = new AuthService()
        this.securityService = new SecurityService()
    }

    async authLogin(req: Request, res: Response){
        const {loginOrEmail, password} = req.body  
        const ip = req.ip
        const title = req.headers['user-agent']
    
        const user = await this.authService.checkCredentials({loginOrEmail, password})
        if(!user) return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
           
        const deviceId = uuidv4()
    
        const accessToken = await this.jwtService.createAccessToken(user.id)
        const refreshToken = await this.jwtService.createRefreshToken(deviceId, user.id)
    
        await this.securityService.postDevice({
            ip: ip,
            title: title,
            lastActiveDate: new Date().toISOString(),
            experationDate: new Date().toISOString(),
            userId: user.id,
            deviceId: deviceId
        })
    
        return res
            .cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            .status(STATUS_CODE.OK_200)
            .send(accessToken)
    }

    async authGetMe(req: Request, res: Response){
        const email = req.user!.email
        const login = req.user!.login
        const userId = req.user!.id
    
        return res.status(STATUS_CODE.OK_200).send({email, login, userId})
    }

    async authRegistration(req: Request, res: Response) {
        const {login, email, password} = req.body 
    
        await this.authService.createUser({login, email, password}, false)
    
        return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    }

    async authRegistrationConfirmation(req: Request, res: Response) {
        const {code} = req.body
    
        const isConfirm = await this.authService.confirmationCode(code)
    
        if(!isConfirm) return res.status(STATUS_CODE.BAD_REQUEST_400).send({ errorsMessages: [{ message: 'code invalid', field: "code" }] })
    
        return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    }

    async authEmailResending(req: Request, res: Response) {

        const email = req.body.email
    
        const isUpdateCode = await this.authService.resendConfirmationCode(email)
        if(!isUpdateCode) return res.sendStatus(STATUS_CODE.BAD_REQUEST_400)
    
        return res.sendStatus(STATUS_CODE.NO_CONTENT_204) 
    }

    async authRefreshToken(req:Request, res: Response) {
    
        const refreshToken = req.cookies.refreshToken
        
        const updateToken = await this.securityService.updateDates(refreshToken)
        if(!updateToken) return res.sendStatus(STATUS_CODE.BAD_REQUEST_400)
    
        return res
            .cookie('refreshToken', updateToken.newRefreshToken , {httpOnly: true, secure: true})
            .status(STATUS_CODE.OK_200)
            .send(updateToken.newAccessToken)
    }

    async authLogout(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
    
        const deviceId = await this.jwtService.getDeviceIdByToken(refreshToken)
    
        const isDelete = await this.securityService.deleteOneDevice(deviceId)
        if(!isDelete) return res.sendStatus(STATUS_CODE.BAD_REQUEST_400)
    
        return res
            .clearCookie('refreshToken')
            .sendStatus(STATUS_CODE.NO_CONTENT_204)
    }

    async authPasswordRecovery(req: Request, res: Response) {
        const email = req.body.email
    
        const isSendCode = await this.authService.sendEmailPasswordRecovery(email)
        if(!isSendCode) return res.sendStatus(STATUS_CODE.BAD_REQUEST_400)
    
        return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    }

    async authNewPassword(req: Request, res: Response) {
        const newPassword = req.body.newPassword
        const recoveryCode = req.body.recoveryCode
        
        const isUpdate = await this.authService.updatePassword(recoveryCode, newPassword)
        if(!isUpdate) return res.sendStatus(STATUS_CODE.BAD_REQUEST_400)
    
        return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    }
}

const authController = new AuthController()

authRouter.post(
    '/login', 
    rateLimitMiddleware, 
    validationAuth, 
    authController.authLogin.bind(authController)
)

authRouter.get(
    '/me', 
    authMiddleware, 
    authController.authGetMe.bind(authController)
)

authRouter.post(
    '/registration', 
    rateLimitMiddleware, 
    validationUser, 
    authController.authRegistration.bind(authController)
)

authRouter.post(
    '/registration-confirmation', 
    rateLimitMiddleware,
    validationConfirmationCode, 
    authController.authRegistrationConfirmation.bind(authController)
)

authRouter.post(
    '/registration-email-resending', 
    rateLimitMiddleware, 
    validationConfirmationEmail, 
    authController.authEmailResending.bind(authController)
)

authRouter.post(
    '/refresh-token', 
    refreshTokenMiddleware, 
    authController.authRefreshToken.bind(authController)
)

authRouter.post(
    '/logout', 
    refreshTokenMiddleware, 
    authController.authLogout.bind(authController)
)

authRouter.post(
    '/password-recovery', 
    validationEmail, 
    rateLimitMiddleware, 
    authController.authPasswordRecovery.bind(authController)
)

authRouter.post(
    '/new-password', 
    rateLimitMiddleware, 
    validationPassword, 
    validationRecoveryCode, 
    authController.authNewPassword.bind(authController)
)