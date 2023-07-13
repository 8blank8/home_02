import { Request, Response, NextFunction } from "express";
import { STATUS_CODE } from "../enum/enumStatusCode";
import { SecurityQueryRepository } from "../repositories/security-query-repository";
import { container } from "../composition-root/composition-root";
import { JwtService } from "../application/jwt-service";


export const checkUserDeviceMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const securityQueryRepository = container.resolve(SecurityQueryRepository)
    const jwtService = container.resolve(JwtService)

    const deviceId = req.params.id
    const refreshToken = req.cookies.refreshToken

    const device = await securityQueryRepository.findDeviceById(deviceId)
    if(!device) return res.sendStatus(STATUS_CODE.NOT_FOUND_404)

    const user = await jwtService.getFullUserByToken(refreshToken)
    if(!user) return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)

    if(device.userId !== user.id) return res.sendStatus(STATUS_CODE.FORBIDDEN_403)
    
    return next()
}