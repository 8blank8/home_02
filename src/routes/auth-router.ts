import { Router, Request, Response } from "express";
import { usersService } from "../domain/users-service";
import { STATUS_CODE } from "../enum/enumStatusCode";
import { validationAuth } from "../validations/validations-auth";
import { jwtService } from "../application/jwt-service";
import { authMiddleware } from "../middlewares/authMiddlewares";

export const authRouter = Router({})

authRouter.post('/login', 
validationAuth,
async (req: Request, res: Response) => {
    const {loginOrEmail, password} = req.body  

    const user = await usersService.checkCredentials({loginOrEmail, password})

    if(!user){
        res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
        return
    }   
    
    const token = await jwtService.createJWT(user)
    res.status(STATUS_CODE.OK_200).send(token)
})

authRouter.get('/me', 
authMiddleware,
async (req: Request, res: Response) => {
    const email = req.user!.email
    const login = req.user!.login
    const userId = req.user!.id

    return res.status(STATUS_CODE.OK_200).send({email, login, userId})
})