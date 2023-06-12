import { collectionAuth } from "../db/db";
import { AuthTokenType } from "../models/auth_models/AuthModel";


export const authRepository = {
    async postRefreshToken(token: AuthTokenType){
        return await collectionAuth.insertOne(token)
    },

    async updateRefreshToken(token: AuthTokenType){
        const isUpdate = await collectionAuth.updateOne({userId: token.userId}, {$set: {refreshToken: token.refreshToken}})
        return isUpdate.modifiedCount === 1
    },

    async findRefreshToken(id: string){
        return await collectionAuth.findOne({userId: id})
    }
}