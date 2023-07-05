import { UserType } from "../models/user_models/UserModel";
// import { collectionUser } from "../db/db";
import { UserModel } from "../db/db";


export const usersRepository = {
    async createUser(user: UserType){
       return await UserModel.insertMany(user)
    },

    async deleteUser(id: string){
        const user = await UserModel.deleteOne({id: id})
        
        return user.deletedCount === 1
    },

    async deleteAllUsers(){
        await UserModel.deleteMany({})
    },

    async updateIsConfirmation(id: string){
        const user = await UserModel.updateOne({id: id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return user.matchedCount === 1
    },

    async updateConfirmationCode(id: string, code: string){
        const isUpdate = await UserModel.updateOne({id}, {$set: {'emailConfirmation.confirmationCode': code}})
        return isUpdate.matchedCount === 1
    },
    
    async updatePassword(id: string, newPassword: string){
        const res = await UserModel.updateOne({id: id}, {$set: {'acountData.passwordHash': newPassword}})
        return res.matchedCount === 1
    }
}