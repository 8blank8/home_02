import { Request, Response, NextFunction } from "express";
import { STATUS_CODE } from "../enum/enumStatusCode";
import { container } from "../composition-root/composition-root";
import { JwtService } from "../application/jwt-service";


export const getUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const jwtService = container.resolve(JwtService)

    const auth = req.headers.authorization
    if(!auth) return next()

    const [authType, token] = auth.split(' ')
    if(authType !== 'Bearer') return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)

    const isExpired = await jwtService.checkExperedToken(token)
    if(!isExpired) return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)

    const user = await jwtService.getUserByToken(token)
    if(!user) return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)

    req.user = user
    return next()
}