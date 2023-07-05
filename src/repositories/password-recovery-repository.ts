import { PasswordRecoveryModel } from "../db/db";
import { AuthPasswordRecoveryType } from "../models/auth_models/AuthPasswordRecovery";


export const passwordRecoveryRepository = {
    async createPasswordRecoveryCode(data: AuthPasswordRecoveryType){
        return await PasswordRecoveryModel.insertMany(data)
    },

    async checkRecoveryCode(code: string){
        return await PasswordRecoveryModel.findOne({confirmationCode: code})
    }
}