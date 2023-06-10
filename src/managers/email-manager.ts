import { emailAdapter } from "../adapters/email-adapter"


export const emailManager = {
    async sendPasswordRecovery(email: string){
        await emailAdapter.sendEmail(email, "Password recovery", "<div>Hello, i am <h1>Kakashka</h1> </div>")
    },

    async sendEmailConfirmationMessage(email: string, code: string){
        await emailAdapter.sendEmail(email, "Confirmation code", `<a href='https://some-front.com/confirm-registration?code=${code}'>https://some-front.com/confirm-registration?code=${code}</a>`)
    }
}