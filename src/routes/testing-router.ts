import { Router } from "express";
import { testingController } from "../composition-root/composition-root";


export const testingRouter = Router({})

testingRouter.delete('/', testingController.deleteAllData.bind(testingController))