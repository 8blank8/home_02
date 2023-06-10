import nodemailer from 'nodemailer'
import { settingEnv } from '../setting-env'

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string){
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: settingEnv.EMAIL,
              pass: settingEnv.EMAIL_PASSWORD,
        },
        })
    
        const info = await transport.sendMail({
            from: 'Vladimir <masvladimir38@gmail.com>',
            to: email,
            subject: subject,
            html: message
        })

        return info
    }
}


// grisha171231@gmail.com