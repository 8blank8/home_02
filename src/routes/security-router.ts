import { Request, Response, Router } from "express";
import { STATUS_CODE } from "../enum/enumStatusCode";
import { refreshTokenMiddleware } from "../middlewares/refresh-token-middleware";
import { checkUserDeviceMiddleware } from "../middlewares/check-user-device-middleware";

import { JwtService } from "../application/jwt-service";
import { SecurityService } from "../domain/security-service";

import { SecurityQueryRepository } from "../repositories/security-query-repository";


export const securityRouter = Router({})

class SecurityController {

    jwtService: JwtService
    securityService: SecurityService
    securityQueryRepository: SecurityQueryRepository
    constructor(){
        this.jwtService = new JwtService()
        this.securityService = new SecurityService()
        this.securityQueryRepository = new SecurityQueryRepository()
    }
    
    async getDevices(req: Request, res: Response) {

        const refreshToken = req.cookies.refreshToken
    
        const user = await this.jwtService.getFullUserByToken(refreshToken)
        if(!user) return res.sendStatus(STATUS_CODE.BAD_REQUEST_400)
    
        const devices = await this.securityQueryRepository.findDevice(user.id)
    
        return res
                .status(STATUS_CODE.OK_200)
                .send(devices)
    }

    async deleteDevices(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
    
        const user = await this.jwtService.getFullUserByToken(refreshToken)
        if(!user) return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
    
        const deviceId = await this.jwtService.getDeviceIdByToken(refreshToken)
    
        await this.securityService.deleteDevices(user.id, deviceId)
    
        return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    }

    async deleteDevice(req: Request, res: Response) {
    
        const deviceId = req.params.id
    
        const isDeleleDevice = await this.securityService.deleteOneDevice(deviceId) 
        if(!isDeleleDevice) return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    
        return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    
    }
}

const securityController = new SecurityController()

securityRouter.get(
    '/devices', 
    refreshTokenMiddleware, 
    securityController.getDevices.bind(securityController)
)

securityRouter.delete(
    '/devices', 
    refreshTokenMiddleware, 
    securityController.deleteDevices.bind(securityController)
)

securityRouter.delete(
    '/devices/:id', 
    refreshTokenMiddleware, 
    checkUserDeviceMiddleware, 
    securityController.deleteDevice.bind(securityController)
)