import { UserCreateType } from "../models/UserCreateModel"
import bcrypt from 'bcrypt'
import { usersRepository } from "../repositories/users-repository"
import { UserLoginType } from "../models/UserLogin"

export const usersService = {
    async createUser(user: UserCreateType){

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(user.password, passwordSalt)

        const createUser = {
            id: (+(new Date())).toString(),
            passwordSalt, 
            passwordHash,
            userName: user.login,
            email: user.email,
            createdAt: new Date()
        }

        return await usersRepository.createUser(createUser)

    },

    async deleteUser(id: string){
        return await usersRepository.deleteUser(id)
    },

    async checkCredentials(data: UserLoginType){
        const user = await usersRepository.findUserByLoginOrEmail(data.loginOrEmail)

        if(!user) return false
        
        const passwordHash = await this._generateHash(data.password, user.passwordSalt)

        if(passwordHash !== user.passwordHash){
            return false
        }

        return true
    },

    async _generateHash(password: string, salt: string){
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
}