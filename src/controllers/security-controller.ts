import { Request, Response } from "express";
import { STATUS_CODE } from "../enum/enumStatusCode";

import { JwtService } from "../application/jwt-service";
import { SecurityService } from "../domain/security-service";

import { SecurityQueryRepository } from "../repositories/security-query-repository";
import { inject, injectable } from "inversify";


@injectable()
export class SecurityController {
    
    constructor(
        @inject(JwtService) protected jwtService: JwtService,
        @inject(SecurityService) protected securityService: SecurityService,
        @inject(SecurityQueryRepository) protected securityQueryRepository: SecurityQueryRepository
    ){}
    
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