import { emailManager } from "../managers/email-manager"


export class EmailService {
    async sendPasswordRecovery(email: string, code: string){
        await emailManager.sendPasswordRecovery(email, code)
    }

    async sendEmailConfirmationMessage(email: string, code: string){
        await emailManager.sendEmailConfirmationMessage(email, code)
    }
}
