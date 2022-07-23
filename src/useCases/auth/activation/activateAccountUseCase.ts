import { prismaClient } from "../../../database/database";

class ActivateAccountUseCase {
    async handle(code: string){
        const userCode = await prismaClient.userCode.findFirst({
            where: {
                id: code
            }
        });
        if(!userCode){
            throw new Error("Code not found");
        }
        if(userCode.action !== "Activate"){
            throw new Error("Invalid action");
        }
        const user = await prismaClient.user.findFirst({
            where: {
                id: userCode.userId
            }
        });
        if(!user){
            throw new Error("User not found");
        }
        if(user.confirmed){
            throw new Error("User already active");
        }
        user.confirmed = true;
        await prismaClient.user.update({
            where: {
                id: user.id
            },
            data: {
                confirmed: true
            }
        });
        await prismaClient.userCode.delete({
            where: {
                id: code
            }
        });
        await prismaClient.wallet.create({
            data: {
                user: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })
        return user;

    }
}

export { ActivateAccountUseCase };