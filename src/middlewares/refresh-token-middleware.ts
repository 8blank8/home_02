import { Request, Response, NextFunction } from "express";
import { STATUS_CODE } from "../enum/enumStatusCode";
import { AuthRepository } from "../repositories/auth-repository";
import { jwtService } from "../composition-root/composition-root";

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authRepository = new AuthRepository()

    const refreshTokenCookie = req.cookies.refreshToken
    if(!refreshTokenCookie) return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)

    const isRefreshToken = await authRepository.findRefreshToken(refreshTokenCookie)
    if(isRefreshToken) return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)

    const isExpired = await jwtService.checkExperedToken(refreshTokenCookie)
    if(!isExpired) return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)

    return next()
}