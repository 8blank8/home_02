import { emailManager } from "../managers/email-manager"
import { UserType } from "../models/user_models/UserModel"


export const emailService = {
    async sendPasswordRecovery(email: string, code: string){
        await emailManager.sendPasswordRecovery(email, code)
    },

    async sendEmailConfirmationMessage(email: string, code: string){
        await emailManager.sendEmailConfirmationMessage(email, code)
    }
}