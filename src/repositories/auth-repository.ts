import { AuthModel } from "../db/db";
import { AuthTokenType } from "../models/auth_models/AuthModel";


class AuthRepository {
    async findRefreshToken(refreshToken: string){
        return await AuthModel.findOne({refreshToken: refreshToken})
    }

    async postRefreshToken(token: AuthTokenType){
        return await AuthModel.insertMany(token)
    }
}

export const authRepository = new AuthRepository()