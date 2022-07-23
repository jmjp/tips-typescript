import { Request, Response } from "express";
import { prismaClient } from "../../database/database";

class TransactionsController {
    async create(req: Request, res: Response) {
        try {
            const { amount, description, user } = req.body;
            if (!amount) {
                return res.status(400).json({ status: "error", message: "Please, provide an amount" });
            }
            if (!user) {
                return res.status(400).json({ status: "error", message: "Please, provide an user" });
            }
            const transaction = await prismaClient.transaction.create({
                data: {
                    description: description ?? "system transaction - no description",
                    amount: amount,
                    wallet: {
                        connect: {
                            userId: user
                        }
                    }
                }
            })
            await prismaClient.wallet.update({
                where: {
                    userId: user
                },
                data: {
                    balance: {
                        increment: amount
                    }
                }
            })
            return res.json({ status: "success", data: transaction });
        } catch (error: any) {
            return res.status(400).json({ status: "error", message: error.message });
        }
    }
    async update(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const { amount } = req.body;
            if (!id) {
                return res.status(400).json({ status: "error", message: "Please, provide an id" });
            }
            if (!amount) {
                return res.status(400).json({ status: "error", message: "Please, provide an amount" });
            }
            const checkExists =  await prismaClient.transaction.findFirst({
                where: {
                    id
                }
            })
            if(!checkExists){
                return res.status(400).json({ status: "error", message: "Transaction not found" });
            }
            var wallet = await prismaClient.wallet.findFirst({
                where:{
                    id: checkExists.walletId
                }
            });
            if(!wallet){
                return res.status(400).json({ status: "error", message: "Wallet not found" });
            }
            const transaction = await prismaClient.transaction.update({
                where: {
                    id
                },
                data: {
                    amount: amount,
                }
            })
            await prismaClient.wallet.update({
                where: {
                    id: checkExists.walletId
                },
                data: {
                    balance: {
                        increment: (amount - checkExists.amount)
                    }
                }
            })
            return res.json({ status: "success", data: transaction });
        } catch (error: any) {
            return res.status(400).json({ status: "error", message: error.message });
        }
    }
    async delete(req: Request, res: Response){
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ status: "error", message: "Please, provide an id" });
            }
            const findExists = await prismaClient.transaction.findFirst({
                where: {
                    id
                }
            })
            if(!findExists){
                return res.status(400).json({ status: "error", message: "Transaction not found" });
            }
            var wallet = await prismaClient.wallet.findFirst({
                where:{
                   id: findExists.walletId
                }
            });
            if(!wallet){
                return res.status(400).json({ status: "error", message: "Wallet not found" });
            }
            const transaction = await prismaClient.transaction.delete({
                where: {
                    id
                }
            })
            await prismaClient.wallet.update({
                where: {
                    id: findExists.walletId
                },
                data: {
                    balance: {
                        increment: (findExists.amount - transaction.amount)
                    }
                }
            })
            return res.json({ status: "success", data: transaction });
        } catch (error: any) {
            return res.status(400).json({ status: "error", message: error.message });
        }
    }
}

export { TransactionsController }