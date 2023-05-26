import { Router, Request, Response } from "express";
import { usersService } from "../domain/users-service";
import { STATUS_CODE } from "../enum/enumStatusCode";
import { validationAuth } from "../validations/validations-auth";

export const authRouter = Router({})

authRouter.post('/', 
validationAuth,
async (req: Request, res: Response) => {
    const {loginOrEmail, password} = req.body

    const isCheck = await usersService.checkCredentials({loginOrEmail, password})

    if(!isCheck){
        res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
        return
    }

    res.sendStatus(STATUS_CODE.NO_CONTENT_204)
})