import { UserType } from "../models/user_models/UserModel";
import { UserModel } from "../db/db";


export class UsersRepository {
    async createUser(user: UserType){
       return await UserModel.insertMany(user)
    }

    async deleteUser(id: string){
        const user = await UserModel.deleteOne({id: id})
        
        return user.deletedCount === 1
    }

    async deleteAllUsers(){
        await UserModel.deleteMany({})
    }

    async updateIsConfirmation(id: string){
        const user = await UserModel.updateOne({id: id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return user.matchedCount === 1
    }

    async updateConfirmationCode(id: string, code: string){
        const isUpdate = await UserModel.updateOne({id}, {$set: {'emailConfirmation.confirmationCode': code}})
        return isUpdate.matchedCount === 1
    }
    
    async updatePassword(id: string, passwordHash: string){
        const res = await UserModel.updateOne({id: id}, {$set: {'acountData.passwordHash': passwordHash}})
        return res.matchedCount === 1
    }
}
