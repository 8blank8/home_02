import { Request, Response } from "express";
import { DEFAULT_QUERY } from "../enum/enumDefaultQuery";
import { STATUS_CODE } from "../enum/enumStatusCode";

import { AuthService } from "../domain/auth-service";
import { UsersService } from "../domain/users-service";

import { UsersQueryRepository } from "../repositories/users-query-repository";

export class UserController {

    constructor(
        protected authService: AuthService,
        protected usersService: UsersService,
        protected usersQueryRepository: UsersQueryRepository
    ){}

    async createUser(req: Request, res: Response) {
        const {login, email, password} = req.body
    
        const createdUserId = await this.authService.createUser({login, email, password}, true)
    
        const user = await this.usersQueryRepository.findUserById(createdUserId)
    
        return res.status(STATUS_CODE.CREATED_201).send(user)
    }

    async getUsers(req: Request, res: Response) {
        const {
            searchLoginTerm, 
            searchEmailTerm, 
            sortBy = DEFAULT_QUERY.SORT_BY, 
            sortDirection = DEFAULT_QUERY.SORT_DIRECTION, 
            pageNumber = DEFAULT_QUERY.PAGE_NUMBER, 
            pageSize = DEFAULT_QUERY.PAGE_SIZE
        } = req.query
    
        const users = await this.usersQueryRepository.findUsers({
            searchLoginTerm: searchLoginTerm?.toString(), 
            searchEmailTerm: searchEmailTerm?.toString(), 
            sortBy: sortBy.toString(), 
            sortDirection: sortDirection, 
            pageNumber: +pageNumber, 
            pageSize: +pageSize
        }) 
    
        res.status(STATUS_CODE.OK_200).send(users)
    }

    async deleteUser(req: Request, res: Response) {
        const {id} = req.params
    
        const isDelete = await this.usersService.deleteUser(id)
    
        if(!isDelete){
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
            return
        }
     
        res.sendStatus(STATUS_CODE.NO_CONTENT_204) 
    }
}