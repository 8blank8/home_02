import { Router } from "express";
import { refreshTokenMiddleware } from "../middlewares/refresh-token-middleware";
import { checkUserDeviceMiddleware } from "../middlewares/check-user-device-middleware";
import { securityController } from "../composition-root/composition-root";


export const securityRouter = Router({})

securityRouter.get(
    '/devices', 
    refreshTokenMiddleware, 
    securityController.getDevices.bind(securityController)
)

securityRouter.delete(
    '/devices', 
    refreshTokenMiddleware, 
    securityController.deleteDevices.bind(securityController)
)

securityRouter.delete(
    '/devices/:id', 
    refreshTokenMiddleware, 
    checkUserDeviceMiddleware, 
    securityController.deleteDevice.bind(securityController)
)