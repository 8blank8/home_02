import { Router} from "express";
import { validationAuth, validationConfirmationCode, validationConfirmationEmail } from "../validations/validations-auth";
import { authMiddleware } from "../middlewares/authMiddlewares";
import { validationUser } from "../validations/validations-user";
import { refreshTokenMiddleware } from "../middlewares/refresh-token-middleware";
import { rateLimitMiddleware } from "../middlewares/rate-limit-middleware";
import { validationEmail, validationPassword } from "../validations/validation-password-recovery";
import { validationRecoveryCode } from "../validations/validation-recovery-code";
import { container } from "../composition-root/composition-root";
import { AuthController } from "../controllers/auth-controller";


const authController = container.resolve(AuthController)

export const authRouter = Router({})

authRouter.post(
    '/login', 
    rateLimitMiddleware, 
    validationAuth, 
    authController.authLogin.bind(authController)
)

authRouter.get(
    '/me', 
    authMiddleware, 
    authController.authGetMe.bind(authController)
)

authRouter.post(
    '/registration', 
    rateLimitMiddleware, 
    validationUser, 
    authController.authRegistration.bind(authController)
)

authRouter.post(
    '/registration-confirmation', 
    rateLimitMiddleware,
    validationConfirmationCode, 
    authController.authRegistrationConfirmation.bind(authController)
)

authRouter.post(
    '/registration-email-resending', 
    rateLimitMiddleware, 
    validationConfirmationEmail, 
    authController.authEmailResending.bind(authController)
)

authRouter.post(
    '/refresh-token', 
    refreshTokenMiddleware, 
    authController.authRefreshToken.bind(authController)
)

authRouter.post(
    '/logout', 
    refreshTokenMiddleware, 
    authController.authLogout.bind(authController)
)

authRouter.post(
    '/password-recovery', 
    validationEmail, 
    rateLimitMiddleware, 
    authController.authPasswordRecovery.bind(authController)
)

authRouter.post(
    '/new-password', 
    rateLimitMiddleware, 
    validationPassword, 
    validationRecoveryCode, 
    authController.authNewPassword.bind(authController)
)