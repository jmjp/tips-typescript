import { Request, Response } from 'express';
import { AuthenticateUserLocalUseCase } from '../../useCases/auth/login/authenticateUserLocalUseCase';

class AuthenticateUserLocalController {
    async handle(req: Request, res: Response) {
        try{
            const { identifier, password } = req.body;
            if(!identifier || !password){
                return res.status(400).json({status: 'error', message: 'Identifier or password is missing'});
            }
            const auth = new AuthenticateUserLocalUseCase();
            var token = await auth.execute({identifier, password});
            return res.status(200).json({status: 'success', data: token});
        }catch(error: any){
            return res.status(401).json({status: 'error', message: error.message});
        }
    }
}

export { AuthenticateUserLocalController };