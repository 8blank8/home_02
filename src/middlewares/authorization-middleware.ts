import { Request, Response, NextFunction } from "express"
import { STATUS_CODE } from "../enum/enumStatusCode"

export const autorizationMiddleware = (req: Request, res: Response, next: NextFunction) =>{
    const auth = 'Basic ' + btoa('admin:qwerty')
    
    if(req.headers.authorization === auth){
        next()
    }else{
        res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
    }
    
}