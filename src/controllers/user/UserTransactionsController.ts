import { Request, Response } from "express";
import { prismaClient } from "../../database/database";

class UserTransactionsController {
    async myTransactions(req: Request, res: Response) {
        try {
            const user = req.body.loggedUser;
            if (!user) {
                return res.status(400).json({ status: "error", message: "Please, login first" });
            }
            const page = Number(req.query.page || 1);
            const perPage = Number(req.query.perPage || 10);
            const transactions = await prismaClient.transaction.findMany({
                where: {
                    wallet: {
                        userId: user.id
                    }
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: perPage,
                skip: perPage * (page - 1),
            })
            return res.json({ status: "success", data: transactions });
        } catch (error: any) {
            return res.status(400).json({ status: "error", message: error.message });
        }
    }
}

export { UserTransactionsController }