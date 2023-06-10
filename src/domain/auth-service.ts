import { UserCreateType } from "../models/user_models/UserCreateModel"
import { UserLoginType } from "../models/user_models/UserLogin"
import { UserType } from "../models/user_models/UserModel"
import { usersRepository } from "../repositories/users-repository"
import bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'
import add from "date-fns/add"
import { emailService } from "./email-service"
import { usersQueryRepository } from "../repositories/users-query-repository"

export const authService = {

    async createUser(user: UserCreateType, isSuperAdmin: boolean){

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(user.password, passwordSalt)
        
        const confirmCode = uuidv4()

        const createUser: UserType = {
            id: (+(new Date())).toString(),
            acountData: {
                passwordHash,
                login: user.login,
                email: user.email,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: confirmCode,
                expirationDate: add(new Date(), {
                    minutes: 3
                }),
                isConfirmed: isSuperAdmin ? true : false
            }
        }
        await usersRepository.createUser(createUser)

        if(!isSuperAdmin) {
            await emailService.sendEmailConfirmationMessage(createUser.acountData.email, confirmCode)
        }

        return createUser.id
    },

    async checkCredentials(data: UserLoginType){
        const user = await usersRepository.findUserByLoginOrEmail(data.loginOrEmail)
        if(!user) return false

        if(!user.emailConfirmation.isConfirmed) return false
        
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(data.password, passwordSalt)
        
        if(passwordHash !== user.acountData.passwordHash) return false

        return user
    },

    async _generateHash(password: string, salt: string){
        const hash = await bcrypt.hash(password, salt)
        return hash
    },

    async confirmationEmail(code: string){
        const user = await usersQueryRepository.findUserByConfirmationCode(code)

        if(!user) return false
        if(user.emailConfirmation.isConfirmed) return false
        if(user.emailConfirmation.confirmationCode !== code) return false
        if(user.emailConfirmation.expirationDate < new Date()) return false
        return await usersRepository.updateIsConfirmation(user.id)
    },

    async resendConfirmationCode(email: string){

        const user = await usersQueryRepository.findFullUserByEmail(email)
        if(!user) return false

        const code = uuidv4()
        console.log(code)
        const isUpdateCode = await usersRepository.updateConfirmationCode(user.id, code)
        if(!isUpdateCode) return false

        await emailService.sendEmailConfirmationMessage(user.acountData.email, code)
        console.log(code)
        return true
    }   
}