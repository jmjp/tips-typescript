import { prisma, User } from "@prisma/client";
import { prismaClient } from "../../../database/database";
import { Mail } from '../../../services/mail';
import argon2 from 'argon2';

interface UserRequest {
    username: string,
    password: string,
    email: string
    avatar?: string,
    provider: "LOCAL"
}


class CreateUserLocalUseCase {
    async execute(user: UserRequest): Promise<User> {
        const find = await prismaClient.user.findFirst({
            where: {
                OR:[
                    {email: user.email},
                    {username: user.username}
                ]
            }
        });
        if(find){
            throw new Error("Username or email already exists");
        }
        const hashedPassword = await argon2.hash(user.password!);
        user.password = hashedPassword;
        const created = await prismaClient.user.create({
            data: user
        });
        const userCode = await prismaClient.userCode.create({
            data: {
                user: {
                    connect: {
                        id: created.id
                    }
                },
                action: "Activate",
            }
        })
        new Mail(created.email,'account activation',`http://localhost:8080/api/v1/auth/activate?code=${userCode.id}`,'Activate').sendMail();
        return created;
    }
}

export { CreateUserLocalUseCase };