import { Router } from "express";
import { container } from "../composition-root/composition-root";
import { TestingController } from "../controllers/testing-controller";


const testingController = container.resolve(TestingController)

export const testingRouter = Router({})

testingRouter.delete('/', testingController.deleteAllData.bind(testingController))