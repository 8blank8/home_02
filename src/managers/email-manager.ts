import { emailAdapter } from "../adapters/email-adapter"


export const emailManager = {
    async sendPasswordRecovery(email: string, code: string){
        await emailAdapter.sendEmail(email, "Password recovery", `<h1>Password recovery</h1><p>To finish password recovery please follow the link below: <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a></p>`)
    },

    async sendEmailConfirmationMessage(email: string, code: string){
        await emailAdapter.sendEmail(email, "Confirmation code", `<a href='https://some-front.com/confirm-registration?code=${code}'>https://some-front.com/confirm-registration?code=${code}</a>`)
    }
}