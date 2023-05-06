import { Request, Response, NextFunction } from "express"

export const autorizationMiddleware = (req: Request, res: Response, next: NextFunction) =>{
    const auth = 'Basic ' + btoa('admin:qwerty')
    
    if(req.headers.authorization === auth){
        next()
    }else{
        res.sendStatus(401)
    }
    
}