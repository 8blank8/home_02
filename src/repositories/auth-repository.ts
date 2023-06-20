import { collectionAuth } from "../db/db";
import { AuthTokenType } from "../models/auth_models/AuthModel";


export const authRepository = {
    async postToken(token: AuthTokenType){
        return await collectionAuth.insertOne(token)
    },

    async deleteToken(userId: string){
        const res = await collectionAuth.deleteOne({userId: userId})
        return res.deletedCount === 1
    }

    // async updateToken(token: AuthTokenType){
    //     const isUpdate = await collectionAuth.updateOne({accessToken: token.accessToken}, {$set: {accessToken: token.accessToken}})
    //     return isUpdate.modifiedCount === 1
    // },

    // async findToken(id: string){
    //     return await collectionAuth.findOne({userId: id})
    // }
}