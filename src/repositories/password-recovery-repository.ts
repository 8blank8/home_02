import { PasswordRecoveryModel } from "../db/db";
import { AuthPasswordRecoveryType } from "../models/auth_models/AuthPasswordRecovery";


class PasswordRecoveryRepository {
    async createPasswordRecoveryCode(data: AuthPasswordRecoveryType){
        return await PasswordRecoveryModel.insertMany(data)
    }

    async checkRecoveryCode(code: string){
        return await PasswordRecoveryModel.findOne({confirmationCode: code})
    }

    async updatePasswordRecoveryData(userId: string ,isExpired: boolean){
        const res = await PasswordRecoveryModel.updateOne({userId: userId}, {$set: {isExpired: isExpired}})
        return res.matchedCount === 1
    }
}

export const passwordRecoveryRepository = new PasswordRecoveryRepository()