import { Router } from "express";
import { refreshTokenMiddleware } from "../middlewares/refresh-token-middleware";
import { checkUserDeviceMiddleware } from "../middlewares/check-user-device-middleware";
import { container } from "../composition-root/composition-root";
import { SecurityController } from "../controllers/security-controller";

const securityController = container.resolve(SecurityController)

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