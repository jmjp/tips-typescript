import { User } from "@prisma/client";
import { prismaClient } from "../../../database/database";

class CreateUserGoogleUseCase {
  async execute(user: User): Promise<User> {
    const existsUser = await prismaClient.user.findFirst({
        where: {
            OR:[
                {email: user.email},
                {username: user.username}
            ]
        }
    });
    if(existsUser){
        throw new Error("Username or email already exists");
    }
    return prismaClient.user.create({
        data: user
    });
  }
}

export { CreateUserGoogleUseCase };