import { AuthModel } from "../db/db";
import { AuthTokenType } from "../models/auth_models/AuthModel";
import { injectable } from "inversify";

@injectable()
export class AuthRepository {
    async findRefreshToken(refreshToken: string){
        return await AuthModel.findOne({refreshToken: refreshToken})
    }

    async postRefreshToken(token: AuthTokenType){
        return await AuthModel.insertMany(token)
    }
}
