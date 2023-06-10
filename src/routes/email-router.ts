import { Router, Request, Response } from "express";
import { emailService } from "../domain/email-service";

export const emailRouter = Router({})

emailRouter.post('/send', async (req: Request, res: Response) => {

    await emailService.sendPasswordRecovery({email: req.body.email})

    res.send('ok')

})