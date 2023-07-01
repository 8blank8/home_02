import jwt from 'jsonwebtoken'
import { UserType } from '../models/user_models/UserModel'
import { settingEnv } from '../setting-env'
import { authRepository } from '../repositories/auth-repository'
import { usersQueryRepository } from '../repositories/users-query-repository'
import { AuthTokenType } from '../models/auth_models/AuthModel'
import { DeviceDateType } from '../models/security/deviceDateModel'

export const jwtService = {
    async createAccessToken(userId: string) {
        const token = jwt.sign({userId: userId}, settingEnv.JWT_SECRET, {expiresIn: '10s'})

        return {accessToken: token}
    },

    async createRefreshToken(deviceId: string){
        const refreshToken = jwt.sign({deviceId: deviceId}, settingEnv.JWT_SECRET, {expiresIn: '20s'})

        return refreshToken
    },

    async getUserByToken(token: string){
        try {
            const result: any = jwt.verify(token, settingEnv.JWT_SECRET)
            const user = await usersQueryRepository.findUserById(result.userId)
            return user
        } catch{
            return null
        }
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

    async checkExperedToken(token: string){
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
    },

    async getDatesToken(token: string){
        try {

            const t: any = jwt.verify(token, settingEnv.JWT_SECRET)
            const date: DeviceDateType = {
                iat: t.iat,
                exp: t.exp
            }

            return date
            
        } catch {
            return false
        }
    },

    async getDeviceIdByToken(token: string){
        try {
            const t: any = jwt.verify(token, settingEnv.JWT_SECRET)
            return t.deviceId
        } catch {
            return null
        }
    }
}