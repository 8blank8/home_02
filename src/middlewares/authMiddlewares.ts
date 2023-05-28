import { NextFunction, Request, Response } from "express";
import { STATUS_CODE } from "../enum/enumStatusCode";
import { usersQueryRepository } from "../repositories/users-query-repository";
import { jwtService } from "../application/jwt-service";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if(!auth) return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
        
    const [authType, token] = auth.split(' ')
    if(authType !== 'Bearer') return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)

    const userId = await jwtService.getUserIdByToken(token)
    if(!userId) return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)

    const user = await usersQueryRepository.findUserById(userId)
    if(!user) return res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)

    req.user = user
    return next()
    
}