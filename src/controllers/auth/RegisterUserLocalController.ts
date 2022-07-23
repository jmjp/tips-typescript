import { Request, Response } from 'express';
import { CreateUserLocalUseCase } from '../../useCases/auth/register/createUserLocalUseCase';
import { userRegisterLocalValidator } from '../../validators/register/UserRegisterValidator';
class RegisterUserLocalController {
    async handle(req: Request, res: Response) {
        try {
            userRegisterLocalValidator(req);
            const { username, password, email, avatar } = req.body;
            const create = new CreateUserLocalUseCase();
            const user = await create.execute({ username, password, email, avatar, provider: "LOCAL" });
            return res.status(200).json({ status: 'success', data: user });
        } catch (error: any) {
            return res.status(401).json({ status: 'error', message: error.message });
        }
    }
}
export { RegisterUserLocalController };