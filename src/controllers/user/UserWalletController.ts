import { Request, Response } from "express";
import { prismaClient } from "../../database/database";

class UserWalletController {
    async myWallet(req: Request, resp: Response) {
        try{
            const user = req.body.loggedUser;
            if(!user){
                return resp.status(400).json({status: "error", message: "Please, login first"});
            }
            const wallet = await prismaClient.wallet.findUnique({
                where:{
                    userId: user.id
                },
                include: {
                    transactions: {
                        take: 10,
                        orderBy: {
                            createdAt: "desc"
                        }
                    }
                }
            })
            return resp.json({status: "success", data: wallet});
        }catch(error: any){
            return resp.status(400).json({status: "error", message: error.message});
        }
    }
    
}

export { UserWalletController }