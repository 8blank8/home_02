import { UserCreateType } from "../models/user_models/UserCreateModel"
import { UserLoginType } from "../models/user_models/UserLogin"
import { UserType } from "../models/user_models/UserModel"
import bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'
import add from "date-fns/add"
import { AuthPasswordRecoveryType } from "../models/auth_models/AuthPasswordRecovery"

import { UsersService } from "./users-service"
import { EmailService } from "./email-service"

import { PasswordRecoveryRepository } from "../repositories/password-recovery-repository"
import { UsersRepository } from "../repositories/users-repository"
import { UsersQueryRepository } from "../repositories/users-query-repository"



export class AuthService {
    
    constructor(
        protected passwordRecoveryRepository: PasswordRecoveryRepository,
        protected usersRepository: UsersRepository,
        protected usersQueryRepository: UsersQueryRepository,
        protected usersService: UsersService,
        protected emailService: EmailService
    ){}

    async createUser(user: UserCreateType, isSuperAdmin: boolean){

        const passwordHash = await this._generateHash(user.password)
        
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
        await this.usersRepository.createUser(createUser)

        if(!isSuperAdmin) {
            await this.emailService.sendEmailConfirmationMessage(createUser.acountData.email, confirmCode)
        }

        return createUser.id
    }

    async checkCredentials(data: UserLoginType){
        const user = await this.usersQueryRepository.findUserByLoginOrEmail(data.loginOrEmail)
        if(!user) return false

        if(!user.emailConfirmation.isConfirmed) return false

        if(!await bcrypt.compare(data.password, user.acountData.passwordHash)) return false

        return user
    }

    async _generateHash(password: string){
        const salt = await bcrypt.genSalt(10)

        const hash = await bcrypt.hash(password, salt)
        return hash
    }

    async confirmationCode(code: string){
        const user = await this.usersQueryRepository.findUserByConfirmationCode(code)

        if(!user) return false
        if(user.emailConfirmation.isConfirmed) return false
        if(user.emailConfirmation.confirmationCode !== code) return false
        if(user.emailConfirmation.expirationDate < new Date()) return false
        return await this.usersRepository.updateIsConfirmation(user.id)
    }

    async resendConfirmationCode(email: string){

        const user = await this.usersQueryRepository.findFullUserByEmail(email)
        if(!user) return false

        const code = uuidv4()

        const isUpdateCode = await this.usersRepository.updateConfirmationCode(user.id, code)
        if(!isUpdateCode) return false

        await this.emailService.sendEmailConfirmationMessage(user.acountData.email, code)
        return true
    }

    async sendEmailPasswordRecovery(email: string){
        
        const code: string = uuidv4()

        const user = await this.usersQueryRepository.findFullUserByEmail(email)
        if(!user) return true

        await this.emailService.sendPasswordRecovery(email, code)

        const newPasswordRecoveryData: AuthPasswordRecoveryType = {
            userId: user.id,
            confirmationCode: code,
            date: new Date().toISOString(),
            isExpired: false
        }

        await this.passwordRecoveryRepository.createPasswordRecoveryCode(newPasswordRecoveryData)

        return true
    }

    async updatePassword( recoveryCode: string, newPassword: string){
        const passwordRecoveryData = await this.passwordRecoveryRepository.checkRecoveryCode(recoveryCode)
        if(!passwordRecoveryData) return false

        const passwordHash = await this._generateHash(newPassword)

        const isUpdatePassword = await this.usersService.updatePassword(passwordRecoveryData.userId, passwordHash)
        if(!isUpdatePassword) return false

        const isUpdateRecoveryPasswordData = await this.passwordRecoveryRepository.updatePasswordRecoveryData(passwordRecoveryData.userId ,true)
        if(!isUpdateRecoveryPasswordData) return false

        return true
    }

}

