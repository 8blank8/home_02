import jwt from 'jsonwebtoken'
import { UserType } from '../models/user_models/UserModel'
import { settingEnv } from '../setting-env'
import { usersQueryRepository } from '../repositories/users-query-repository'
import { authRepository } from '../repositories/auth-repository'

export const jwtService = {
    async createJWT(user: UserType) {
        const token = jwt.sign({userId: user.id}, settingEnv.JWT_SECRET, {expiresIn: '10s'})
        return {accessToken: token}
    },

    async createRefreshToken(user: UserType){
        const token = jwt.sign({userId: user.id}, settingEnv.JWT_SECRET, {expiresIn: '20s'})
        
        await authRepository.postRefreshToken({userId: user.id, refreshToken: token})
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
            
            const refreshToken = await authRepository.findRefreshToken(t.userId)
            if(!refreshToken) return false
            if(token !== refreshToken.refreshToken) return false

            const user = await usersQueryRepository.getFullUserById(t.userId)
            if(!user) return false

            const newToken = await this.createJWT(user)
            const newRefreshToken = await this.createRefreshToken(user)
            
            const isUpdateToken = await authRepository.updateRefreshToken({
                userId: t.userId,
                refreshToken: newRefreshToken
            })

            if(!isUpdateToken) return false

            return {
                token: newToken,
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

            const refreshToken = await authRepository.findRefreshToken(token)
            if(!refreshToken) return false
            if(token !== refreshToken.refreshToken) return false

            return true
       } catch {
            return false
       }
    }
}