import jwt from 'jsonwebtoken'
import { UserType } from '../models/user_models/UserModel'
import { settingEnv } from '../setting-env'

export const jwtService = {
    async createJWT(user: UserType) {
        const token = jwt.sign({userId: user.id}, settingEnv.JWT_SECRET, {expiresIn: '20h'})
        return {accessToken: token}
    },
    async getUserIdByToken(token: string){
        try {
            const result: any = jwt.verify(token, settingEnv.JWT_SECRET)
            return result.userId
        } catch{
            return null
        }
    }
}