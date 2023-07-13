import jwt from 'jsonwebtoken'
import { settingEnv } from '../setting-env'
import { AuthRepository } from '../repositories/auth-repository'
import { UsersQueryRepository } from '../repositories/users-query-repository'
import { AuthTokenType } from '../models/auth_models/AuthModel'
import { inject, injectable } from 'inversify'

@injectable()
export class JwtService {

    constructor(
        @inject(AuthRepository) protected authRepository: AuthRepository, 
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
    ){}

    async createAccessToken(userId: string) {
        const token = jwt.sign({userId: userId}, settingEnv.JWT_SECRET, {expiresIn: '10m'})

        return {accessToken: token}
    }

    async createRefreshToken(deviceId: string, userId: string){
        const refreshToken = jwt.sign({deviceId: deviceId, userId: userId}, settingEnv.JWT_SECRET, {expiresIn: '20m'})

        return refreshToken
    }

    async getUserByToken(token: string){
        try {
            const result: any = jwt.verify(token, settingEnv.JWT_SECRET)
            const user = await this.usersQueryRepository.findUserById(result.userId)
            return user
        } catch{
            return null
        }
    }

    async getFullUserByToken(token: string){
        try {
            const result: any = jwt.verify(token, settingEnv.JWT_SECRET)
            const user = await this.usersQueryRepository.getFullUserById(result.userId)
            return user
        } catch{
            return null
        }
    }

    async checkExperedToken(token: string){
       try {
            jwt.verify(token, settingEnv.JWT_SECRET)
            return true
       } catch {
            return false
       }
    }

    async postRefreshToken(token: string){
        const createdToken: AuthTokenType = {
            refreshToken: token
        }

        return await this.authRepository.postRefreshToken(createdToken)
    }

    async getDeviceIdByToken(token: string){
        try {
            const t: any = jwt.verify(token, settingEnv.JWT_SECRET)
            return t.deviceId
        } catch {
            return null
        }
    }
}