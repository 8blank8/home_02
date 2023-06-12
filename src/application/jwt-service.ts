import jwt from 'jsonwebtoken'
import { UserType } from '../models/user_models/UserModel'
import { settingEnv } from '../setting-env'
import { usersQueryRepository } from '../repositories/users-query-repository'

export const jwtService = {
    async createJWT(user: UserType) {
        const token = jwt.sign({userId: user.id}, settingEnv.JWT_SECRET, {expiresIn: '10s'})
        return {accessToken: token}
    },

    async createRefreshToken(user: UserType){
        const token = jwt.sign({userId: user.id}, settingEnv.JWT_SECRET, {expiresIn: '20s'})
        return token
    },

    async getUserIdByToken(token: string){
        try {
            const result: any = jwt.verify(token, settingEnv.JWT_SECRET)
            return result.userId
        } catch{
            return null
        }
    },

    async checkRefreshToken(token: string){
        try {
            const t: any = jwt.verify(token, settingEnv.JWT_SECRET)
            if(t.exp < Math.ceil(new Date().getTime() / 1000)) return false
            
            const user = await usersQueryRepository.getFullUserById(t.userId)
            if(!user) return false

            const newToken = await this.createJWT(user)
            const newRefreshToken = await this.createRefreshToken(user)

            return {
                token: newToken.accessToken,
                refreshToken: newRefreshToken
            }
       } catch {
            return false
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