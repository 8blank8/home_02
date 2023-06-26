import jwt from 'jsonwebtoken'
import { UserType } from '../models/user_models/UserModel'
import { settingEnv } from '../setting-env'
import { authRepository } from '../repositories/auth-repository'
import { usersQueryRepository } from '../repositories/users-query-repository'
import { AuthTokenType } from '../models/auth_models/AuthModel'

export const jwtService = {
    async createJWT(user: UserType) {
        const token = jwt.sign({userId: user.id}, settingEnv.JWT_SECRET, {expiresIn: '10s'})
        const refreshToken = jwt.sign({userId: user.id}, settingEnv.JWT_SECRET, {expiresIn: '20s'})

        return {accessToken: token, refreshToken: refreshToken}
    },

    async getFullUserByToken(token: string){
        try {
            const result: any = jwt.verify(token, settingEnv.JWT_SECRET)
            const user = await usersQueryRepository.getFullUserById(result.userId)
            return user
        } catch{
            return null
        }
    },

    async checkExperedRefreshToken(token: string){
       try {
            jwt.verify(token, settingEnv.JWT_SECRET)
            return true
       } catch {
            return false
       }
    },

    async postRefreshToken(token: string){
        const createdToken: AuthTokenType = {
            refreshToken: token
        }

        return await authRepository.postRefreshToken(createdToken)
    }
}