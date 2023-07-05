import { Request, Response, NextFunction } from "express";
import { STATUS_CODE } from "../enum/enumStatusCode";
// import { collectionRateLimit } from "../db/db";
import { RateLimitModel } from "../db/db";
import { addSeconds } from "date-fns";


export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const {ip, url} = req
    const connectionTime = new Date()
    const interval = addSeconds(connectionTime, -10)

    const countOfConnections = await RateLimitModel.countDocuments({ip, url, connectionTime: {$gte: interval}})

    if(countOfConnections + 1 > 5){
        return res.sendStatus(STATUS_CODE.TOO_MANY_REQUESTS_429)
    }

    await RateLimitModel.insertMany({ip, url, connectionTime})
    return next()
}