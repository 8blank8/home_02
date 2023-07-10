import { Router } from "express";
import { autorizationMiddleware } from "../middlewares/authorization-middleware";
import { validationUser } from "../validations/validations-user";
import { userController } from "../composition-root/composition-root";


export const userRouter = Router({})


userRouter.post(
    '/', 
    autorizationMiddleware, 
    validationUser, 
    userController.createUser.bind(userController)
)

userRouter.get(
    '/', 
    autorizationMiddleware, 
    userController.getUsers.bind(userController)
)

userRouter.delete(
    '/:id', 
    autorizationMiddleware, 
    userController.deleteUser.bind(userController)
)