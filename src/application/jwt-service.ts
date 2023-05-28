import jwt from 'jsonwebtoken'
import { UserType } from '../models/UserModel'
import { settingEnv } from '../setting-env'

// export type TJwtPayload = {
//     userId: string
//     iat: number
//     exp: number
// }

export const jwtService = {
    async createJWT(user: UserType) {
        const token = jwt.sign({userId: user.id}, settingEnv.JWT_SECRET, {expiresIn: '20h'})
        return token
    },
// : Promise<TJwtPayload | null>
    async getUserIdByToken(token: string){
        try {
            const result: any = jwt.verify(token, settingEnv.JWT_SECRET)
            return result.userId
            // return {
            //     userId: result.userId,
            //     iat: result.iat * 1000,
            //     exp: result.exp * 1000
            // }
        } catch{
            return null
        }
    }
}