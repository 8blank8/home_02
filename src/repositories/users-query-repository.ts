import { DEFAULT_QUERY } from "../enum/enumDefaultQuery";
import { Sort } from "../models/post_models/PostAndBlogSortModel";
import { UserFindType } from "../models/user_models/UserFindModel";
import { collectionUser } from "../db/db";
import { UserType } from "../models/user_models/UserModel";
import { UserViewType } from "../models/user_models/UserViewModel";


export const usersQueryRepository = {
    async findUsers(option: UserFindType){

        const {searchEmailTerm, searchLoginTerm, pageNumber, pageSize, sortBy, sortDirection} = option

        const filter: any =  {$or: []}
         
        if(searchLoginTerm){
            const filterName = new RegExp(`${searchLoginTerm}`, 'i')
            filter.$or.push({login: {$regex: filterName}})
        }
        
        if(searchEmailTerm){
            const filterEmail = new RegExp(`${searchEmailTerm}`, 'i')
            filter.$or.push({email: {$regex: filterEmail}})
        }

        const users = await collectionUser.find(filter.$or.length ? filter : {})
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort(sortBy, sortDirection)
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

    async findFullUserByEmail(email: string) {
        return await collectionUser.findOne({"acountData.email": email})
    },

    async findUserByConfirmationCode(code: string){
        return await collectionUser.findOne({"emailConfirmation.confirmationCode": code})
    },  

    async findUserByLoginOrEmail(loginOrEmail: string){
        const user = await collectionUser.findOne({$or: [{"acountData.email": loginOrEmail}, {"acountData.login": loginOrEmail}]})
        return user
    },

    _mapUser(user: UserType): UserViewType{
        return {
            id: user.id, 
            login: user.acountData.login, 
            email: user.acountData.email, 
            createdAt: user.acountData.createdAt
        }
    }
}