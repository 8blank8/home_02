import { Request, Response } from "express";
import { DEFAULT_QUERY } from "../enum/enumDefaultQuery";
import { STATUS_CODE } from "../enum/enumStatusCode";

import { AuthService } from "../domain/auth-service";
import { UsersService } from "../domain/users-service";

import { UsersQueryRepository } from "../repositories/users-query-repository";
import { inject, injectable } from "inversify";

@injectable()
export class UserController {

    constructor(
        @inject(AuthService) protected authService: AuthService,
        @inject(UsersService) protected usersService: UsersService,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
    ){}

    async createUser(req: Request, res: Response) {
        const {login, email, password} = req.body
        console.log(login, email, password);
        
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