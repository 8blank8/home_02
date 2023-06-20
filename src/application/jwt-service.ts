import jwt from 'jsonwebtoken'
import { UserType } from '../models/user_models/UserModel'
import { settingEnv } from '../setting-env'
import { authRepository } from '../repositories/auth-repository'

export const jwtService = {
    async createJWT(user: UserType) {
        const token = jwt.sign({userId: user.id}, settingEnv.JWT_SECRET, {expiresIn: '10s'})
        await authRepository.postToken({userId: user.id, accessToken: token})
        return {accessToken: token}
    },

    async createRefreshToken(user: UserType){
        const token = jwt.sign({userId: user.id}, settingEnv.JWT_SECRET, {expiresIn: '20s'})
        return token
    },

    async deleteToken(userId: string){
        return await authRepository.deleteToken(userId)
    },

    async getUserIdByToken(token: string){
        try {
            const result: any = jwt.verify(token, settingEnv.JWT_SECRET)
            return result.userId
        } catch{
            return null
        }
    },

    async checkExperedRefreshToken(token: string){
       try {
            const t: any = jwt.verify(token, settingEnv.JWT_SECRET)
            if(t.exp < Math.ceil(new Date().getTime() / 1000)) return false

            return true
       } catch {
            return false
       }
    }
}