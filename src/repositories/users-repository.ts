import { UserType } from "../models/UserModel";
import { collectionUser } from "../db/db";


export const usersRepository = {
    async createUser(user: UserType){
       return await collectionUser.insertOne(user)
    },

    async findUserByLoginOrEmail(loginOrEmail: string){
        const user = await collectionUser.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
        return user
    },

    async deleteUser(id: string){
        const user = await collectionUser.deleteOne({id: id})
        
        return user.deletedCount === 1
    },

    async deleteAllUsers(){
        await collectionUser.deleteMany({})
    }
}