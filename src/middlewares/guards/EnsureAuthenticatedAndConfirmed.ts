import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { prismaClient } from "../../database/database";

async function ensureAuthenticatedAndConfirmed(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return response.status(401).json({ error: 'No token provided' });
    }
    const [prefix,token] =  authHeader.split(' ');
    try{
        var decoded = verify(token, process.env.JWT_SECRET!);
        var user = await prismaClient.user.findFirst({
            where:{
                id: decoded["sub"] as string
            }
        });
        if(!user || user.confirmed == false || user.blocked == true){
            return response.status(401).json({ error: 'User not confirmed or blocked' });
        }
        request.body.loggedUser = user;
        return next();
    }catch(error){
        return response.status(401).json({ error: 'Invalid token or already expired' });
    }
}

export { ensureAuthenticatedAndConfirmed };