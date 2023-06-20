import jwt from 'jsonwebtoken'
import { UserType } from '../models/user_models/UserModel'
import { settingEnv } from '../setting-env'
import { authRepository } from '../repositories/auth-repository'
import { usersQueryRepository } from '../repositories/users-query-repository'

export const jwtService = {
    async createJWT(user: UserType) {
        const token = jwt.sign({userId: user.id}, settingEnv.JWT_SECRET, {expiresIn: '10s'})
        const refreshToken = jwt.sign({userId: user.id}, settingEnv.JWT_SECRET, {expiresIn: '20s'})

        const isToken = await authRepository.findTokenByUserId(user.id)
        if(!isToken) {
            await authRepository.postToken({userId: user.id, accessToken: token, refreshToken: refreshToken})
        }

        return {accessToken: token, refreshToken: refreshToken}
    },

    // async createRefreshToken(user: UserType){
    //     const token = jwt.sign({userId: user.id}, settingEnv.JWT_SECRET, {expiresIn: '20s'})
    //     return token
    // },

    async deleteToken(token: string){
        const userId = await jwtService.getUserIdByToken(token)
        if(!userId) return false

        return await authRepository.deleteToken(userId)
    },

    async updateTokens(refreshToken: string){

        const userId = await jwtService.getUserIdByToken(refreshToken)
        if(!userId) return false

        const isToken = await authRepository.findTokenByUserId(userId)
        if(!isToken) return false

        const user = await usersQueryRepository.getFullUserById(userId)
        if(!user) return false

        const newToken = await jwtService.createJWT(user)

        const isUpdate = await authRepository.updateToken({
            userId: userId,
            accessToken: newToken.accessToken,
            refreshToken: newToken.refreshToken
        })

        if(!isUpdate) return false

        return newToken
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