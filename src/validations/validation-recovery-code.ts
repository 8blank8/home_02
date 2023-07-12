import { body } from "express-validator";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { PasswordRecoveryRepository } from "../repositories/password-recovery-repository";

const passwordRecoveryRepository = new PasswordRecoveryRepository()

export const validationRecoveryCode = [
    body('recoveryCode')
        .custom(async (recoveryCode) => {
            const codeData = await passwordRecoveryRepository.checkRecoveryCode(recoveryCode)
            if(!codeData) {
                throw Error('code not found')
            }
            if(codeData.isExpired){
                throw Error('code is expired')
            }
        }),

    inputValidationMiddleware
]