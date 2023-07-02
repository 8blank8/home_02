import { Request, Response, NextFunction } from "express";
import { jwtService } from "../application/jwt-service";
import { STATUS_CODE } from "../enum/enumStatusCode";
import { securityQueryRepository } from "../repositories/security-query-repository";


export const checkUserDeviceMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    
    const deviceId = req.params.id
    const refreshToken = req.cookies.refreshToken

    const device = await securityQueryRepository.findDeviceById(deviceId)
    if(!device) return res.sendStatus(STATUS_CODE.NOT_FOUND_404)

    const user = await jwtService.getFullUserByToken(refreshToken)
    if(!user) return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)

    if(device.userId !== user.id) return res.sendStatus(STATUS_CODE.FORBIDDEN_403)
    
    return next()
}