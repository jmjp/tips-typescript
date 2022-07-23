import { Request, Response } from "express";
import { ActivateAccountUseCase } from "../../useCases/auth/activation/activateAccountUseCase";

class ActivateAccountController {
    async handle(req: Request, res: Response) {
        try {
            const { code } = req.query;
            const activate = new ActivateAccountUseCase();
            const user = await activate.handle(code as string);
            return res.status(200).json({ status: 'success', data: user });
        } catch (error: any) {
            return res.status(400).json({ status: 'error', message: error.message });
        }
    }
}
export { ActivateAccountController };