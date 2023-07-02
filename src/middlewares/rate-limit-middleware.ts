import { Request, Response, NextFunction } from "express";
import { RateLimitType } from "../models/rate_limit/rateLimitDbModel";
import { rateLimitRepository } from "../repositories/rate-limit-repository";
import { STATUS_CODE } from "../enum/enumStatusCode";


export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const ip = req.ip

    const result = await rateLimitRepository.findRateLimit(ip)

    if(!result) {
        const rateLimit: RateLimitType = {
            ip: ip,
            time: +(new Date()),
            count: 1
        }

        await rateLimitRepository.createRateLimit(rateLimit)

        return next()
    }

    if((+(new Date()) - 10000) < result.time && result.count === 5) return res.sendStatus(STATUS_CODE.TOO_MANY_REQUESTS_429)
    
    if((+(new Date()) - 10000) > result.time){
        const isUpdate = await rateLimitRepository.updateRateLimitAll({
            ip: ip, 
            time: +(new Date()),
            count: 1
        })
        
        if(!isUpdate) return res.sendStatus(STATUS_CODE.TOO_MANY_REQUESTS_429)

        return next()
    }
    console.log({ 
        ip: ip,
        time: result.time,
        count: result.count++
    })
    
    const isUpdate = await rateLimitRepository.updateRateLimitCount({ 
        ip: ip,
        time: result.time,
        count: result.count++
    })
    if(!isUpdate) return res.sendStatus(STATUS_CODE.TOO_MANY_REQUESTS_429)

    return next()
}