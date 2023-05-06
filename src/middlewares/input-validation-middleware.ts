import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import { ErrorType } from "../models/ErrorModel"


export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction)=>{
   const errFormater = (err: any): ErrorType =>{
      return {
         message: err.msg, 
         field: err.path
      }
   }

    const errors = validationResult(req).formatWith(errFormater)

    if(!errors.isEmpty()){
      const err = errors.array({onlyFirstError: true})
       res.status(400).send({errorsMessages:  err})
    }else{
       next()
    }
}

