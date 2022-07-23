import { prismaClient } from "../../../database/database";
import argon2 from 'argon2';
import { GenerateAccessTokenProvider } from "../../../providers/auth/generateAccessTokenProvider";

interface UserRequest {
    identifier: string;
    password: string;   
}

class AuthenticateUserLocalUseCase {
    async execute(user: UserRequest): Promise<{token: string; refresh: string}> {
        const existsUser = await prismaClient.user.findFirst({
            where: {
                OR: [
                    { email: user.identifier },
                    { username: user.identifier }
                ],
                AND: {
                    provider: "LOCAL"
                }
            }
        });
        if (!existsUser) {
            throw new Error("Identifier or passowrd is incorrect");
        }
        if(!existsUser.confirmed){
            throw new Error("User is not confirmed, please check your email");
        }
        const isValidPassword = await argon2.verify(existsUser.password!, user.password);
        if (!isValidPassword) {
            throw new Error("Identifier or passowrd is incorrect");
        }
        const accessToken = await new GenerateAccessTokenProvider().execute(existsUser);
        const refreshToken = await new GenerateAccessTokenProvider().execute(existsUser);
        return {token: accessToken, refresh: refreshToken};
    }
}

export { AuthenticateUserLocalUseCase };