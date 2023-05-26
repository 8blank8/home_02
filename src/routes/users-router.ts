import { Router, Request, Response } from "express";
import { STATUS_CODE } from "../enum/enumStatusCode";
import { usersService } from "../domain/users-service";
import { usersQueryRepository } from "../repositories/users-query-repository";
import { autorizationMiddleware } from "../middlewares/authorization-middleware";
import { validationUser } from "../validations/validations-user";

export const userRouter = Router({})

userRouter.post('/', 
autorizationMiddleware,
validationUser,
async (req: Request, res: Response) => {
    const {login, email, password} = req.body

    await usersService.createUser({login, email, password})
    
    res.sendStatus(STATUS_CODE.CREATED_201)
})

userRouter.get('/', 
autorizationMiddleware,
async (req: Request, res: Response) => {
    const {searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize} = req.query

    const users = await usersQueryRepository.findUsers({
        searchLoginTerm: searchLoginTerm?.toString(), 
        searchEmailTerm: searchEmailTerm?.toString(), 
        sortBy: sortBy?.toString(), 
        sortDirection: sortDirection?.toString(), 
        pageNumber: pageNumber?.toString(), 
        pageSize: pageSize?.toString()
    }) 

    res.status(STATUS_CODE.OK_200).send(users)
})

userRouter.delete('/:id', 
autorizationMiddleware,
async (req: Request, res: Response) => {
    const {id} = req.params

    const isDelete = await usersService.deleteUser(id)

    if(!isDelete){
        res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }
 
    res.sendStatus(STATUS_CODE.NO_CONTENT_204) 
})