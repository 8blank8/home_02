import { DEFAULT_QUERY } from "../enum/enumDefaultQuery";
import { Sort } from "../models/PostAndBlogSortModel";
import { UserFindType } from "../models/UserFindModel";
import { collectionUser } from "../db/db";
import { UserType } from "../models/UserModel";
import { UserViewType } from "../models/UserViewModel";


export const usersQueryRepository = {
    async findUsers(option: UserFindType){

        const filter: any =  {$or: []}
         

        const pageNumber: number = typeof option.pageNumber == 'undefined' ? DEFAULT_QUERY.PAGE_NUMBER : +option.pageNumber
        const pageSize: number = typeof option.pageSize == 'undefined' ? DEFAULT_QUERY.PAGE_SIZE : +option.pageSize

        const sort: Sort = {
            sortBy: option.sortBy ?? DEFAULT_QUERY.SORT_BY,
            sortDirection: option.sortDirection ?? DEFAULT_QUERY.SORT_DIRECTION
        }

        if(option.searchLoginTerm){
            const filterName = new RegExp(`${option.searchLoginTerm}`, 'i')
            filter.$or.push({login: {$regex: filterName}})
        }
        
        if(option.searchEmailTerm){
            const filterEmail = new RegExp(`${option.searchEmailTerm}`, 'i')
            filter.$or.push({email: {$regex: filterEmail}})
        }

        const users = await collectionUser.find(filter.$or.length ? filter : {})
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort(sort.sortBy, sort.sortDirection)
        .toArray()

        const usersCount = (await collectionUser.find(filter.$or.length ? filter : {}).toArray()).length
        
        return {
            pagesCount: Math.ceil(usersCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: usersCount,
            items: users.map((user)=> this._mapUser(user))
        }
    },

    async getFullUserById(id: string) {
        return collectionUser.findOne({id: id})
    },

    async findUserById(id: string){
        const user = await collectionUser.findOne({id: id})

        if(!user) return false

        return this._mapUser(user)
    },

    _mapUser(user: UserType): UserViewType{
        return {
            id: user.id, 
            login: user.login, 
            email: user.email, 
            createdAt: user.createdAt
        }
    }
}