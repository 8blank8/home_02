import { UserType } from "../models/user_models/UserModel";
import { collectionUser } from "../db/db";


export const usersRepository = {
    async createUser(user: UserType){
       return await collectionUser.insertOne(user)
    },

    async findUserByLoginOrEmail(loginOrEmail: string){
        const user = await collectionUser.findOne({$or: [{"acountData.email": loginOrEmail}, {"acountData.login": loginOrEmail}]})
        return user
    },

    async deleteUser(id: string){
        const user = await collectionUser.deleteOne({id: id})
        
        return user.deletedCount === 1
    },

    async deleteAllUsers(){
        await collectionUser.deleteMany({})
    },

    async updateIsConfirmation(id: string){
        const user = await collectionUser.updateOne({id: id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return user.modifiedCount === 1
    },

    async updateConfirmationCode(id: string, code: string){
        const isUpdate = await collectionUser.updateOne({id}, {$set: {'emailConfirmation.confirmationCode': code}})
        return isUpdate.modifiedCount === 1
    }
}