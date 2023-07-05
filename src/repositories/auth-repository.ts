// import { collectionAuth } from "../db/db";
import { AuthModel } from "../db/db";
import { AuthTokenType } from "../models/auth_models/AuthModel";


export const authRepository = {
    async findRefreshToken(refreshToken: string){
        return await AuthModel.findOne({refreshToken: refreshToken})
    },

    async postRefreshToken(token: AuthTokenType){
        return await AuthModel.insertMany(token)
    }
}