import { emailManager } from "../managers/email-manager"
import { UserType } from "../models/user_models/UserModel"


export const emailService = {
    async sendPasswordRecovery(user: any){
        await emailManager.sendPasswordRecovery(user.email)
    },

    async sendEmailConfirmationMessage(email: string, code: string){
        await emailManager.sendEmailConfirmationMessage(email, code)
    }
}