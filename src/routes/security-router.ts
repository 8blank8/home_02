import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddlewares";
import { securityQueryRepository } from "../repositories/security-query-repository";
import { STATUS_CODE } from "../enum/enumStatusCode";
import { jwtService } from "../application/jwt-service";
import { securityService } from "../domain/security-service";
import { refreshTokenMiddleware } from "../middlewares/refresh-token-middleware";

export const securityRouter = Router({})


securityRouter.get('/devices', 
refreshTokenMiddleware,
async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken

    const user = await jwtService.getFullUserByToken(refreshToken)
    if(!user) return res.sendStatus(STATUS_CODE.BAD_REQUEST_400)

    const devices = await securityQueryRepository.findDevice(user.id)

    return res
            .status(STATUS_CODE.OK_200)
            .send(devices)
})

securityRouter.delete('/devices', 
authMiddleware,
async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const userId = req.user!.id

    const deviceId = await jwtService.getDeviceIdByToken(refreshToken)

    await securityService.deleteDevices(userId, deviceId)

    return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
})

securityRouter.delete('/devices/:id',
refreshTokenMiddleware,
async (req: Request, res: Response) => {
    
    const deviceId = req.params.id
    const refreshToken = req.cookies.refreshToken

    const user = await jwtService.getFullUserByToken(refreshToken)
    if(!user) return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)

    const isDeleleDevice = await securityService.deleteOneDevice(deviceId) 
    if(!isDeleleDevice) return res.sendStatus(STATUS_CODE.NOT_FOUND_404)

    const isDeleting = await securityService.checkDeletingDevice(user.id, deviceId)
    if(!isDeleting) return res.sendStatus(STATUS_CODE.FORBIDDEN_403)

    return res.sendStatus(STATUS_CODE.NO_CONTENT_204)

})