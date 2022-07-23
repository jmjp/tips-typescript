import { Request, Response } from "express";
import { prismaClient } from "../../database/database";

class UserController {
    async me(req: Request, resp: Response){
        try{
            const currentUser = req.body.loggedUser;
            if(!currentUser){
                return resp.status(400).json({status: "error", message: "Please, login first"});
            }
            const user = await prismaClient.user.findUnique({
                where:{
                    id: currentUser.id
                },
                include: {
                    wallet: true,
                    _count:{
                        select: {
                            follower: true,
                            following: true
                        }
                    }
                }
            })
            return resp.json({status: "success", data: user});
        }catch(error: any){
            return resp.status(400).json({status: "error", message: error.message});
        }
    }
    async followers(req: Request, resp: Response){
        try{
            const user = req.body.loggedUser;
            if(!user){
                return resp.status(400).json({status: "error", message: "Please, login first"});
            }
            const page = Number(req.query.page || 1);
            const perPage = Number(req.query.perPage || 10);
            const followers = await prismaClient.user.findMany({
                where:{
                    follower: {
                        some: {
                            id: user.id
                        }
                    },
                },
                take: perPage,
                skip: perPage * (page - 1),
            })
            return resp.json({status: "success", data: followers});
        }catch(error: any){
            return resp.status(400).json({status: "error", message: error.message});
        }
    }
    async following(req: Request, resp: Response){
        try{
            const user = req.body.loggedUser;
            if(!user){
                return resp.status(400).json({status: "error", message: "Please, login first"});
            }
            const page = Number(req.query.page || 1);
            const perPage = Number(req.query.perPage || 10);
            const following = await prismaClient.user.findMany({
                where:{
                    following: {
                        some: {
                            id: user.id
                        }
                    }
                },
                take: perPage,
                skip: perPage * (page - 1),
            })
            return resp.json({status: "success", data: following});
        }catch(error: any){
            return resp.status(400).json({status: "error", message: error.message});
        }
    }
    async follow(req: Request, resp: Response){
        try{
            const user = req.body.loggedUser;
            if(!user){
                return resp.status(400).json({status: "error", message: "Please, login first"});
            }
            const follow = await prismaClient.user.findUnique({
                where:{
                    id: req.body.follow
                }
            })
            if(!follow || follow.blocked == true){
                return resp.status(400).json({status: "error", message: "User not found or blocked"});
            }
            const followUser = await prismaClient.user.update({
                where:{
                    id: user.id
                },
                data:{
                    following: {
                        connect: {
                            id: req.body.follow
                        }
                    }
                }
            })
            return resp.json({status: "success", data: followUser});
        }catch(error: any){
            return resp.status(400).json({status: "error", message: error.message});
        }
    }
    async unfollow(req: Request, resp: Response){
        try{
            const user = req.body.loggedUser;
            if(!user){
                return resp.status(400).json({status: "error", message: "Please, login first"});
            }
            const follow = await prismaClient.user.findUnique({
                where:{
                    id: req.body.follow
                }
            })
            if(!follow){
                return resp.status(400).json({status: "error", message: "User not found"});
            }
            const followUser = await prismaClient.user.update({
                where:{
                    id: user.id
                },
                data:{
                    following: {
                        disconnect: {
                            id: req.body.follow
                        }
                    }
                }
            })
            return resp.json({status: "success", data: followUser});
        }catch(error: any){
            return resp.status(400).json({status: "error", message: error.message});
        }
    }
}

export { UserController };