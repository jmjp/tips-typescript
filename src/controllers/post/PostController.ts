import { Request, Response } from "express";
import { prismaClient } from "../../database/database";
import { postCreateValidator } from "../../validators/post/postCreateValidator";

class PostController {
    async create(req: Request, res: Response) {
        try {
            postCreateValidator(req);
            const { title, free, price } = req.body;
            if(free == true && price > 0){
                return res.status(400).json({ status: "error", message: "Free post not allowed price greater than zero." });
            }else if(free == false && price <= 0){
                return res.status(400).json({ status: "error", message: "Please, provide a price" });
            }
            const post = await prismaClient.post.create({
                data: {
                    title,
                    free,
                    price,
                    author: {
                        connect: {
                            id: req.body.loggedUser.id
                        }
                    }
                }
            })
            return res.json({ status: "success", data: post });
        }catch(error: any){
            return res.status(400).json({ status: "error", message: error.message });
        }
    }
    async findOne(req: Request, res: Response){
        try{
            const id = req.params.id;
            if(!id){
                return res.status(400).json({ status: "error", message: "Please, provide an id" });
            }
            const post = await prismaClient.post.findFirst({
                where: {
                    id
                },
                include: {
                    medias: true,
                    comments: {
                        take: 10,
                        orderBy: {
                            createdAt: "desc"
                        },
                    },
                    author: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true
                        }
                    },
                    _count: {
                        select: {
                            likes: true,
                            comments: true,
                        }
                    }
                }
            })
            if(!post){
                return res.status(400).json({ status: "error", message: "Post not found" });
            }
            return res.json({ status: "success", data: post });
        }catch(error: any){
            return res.status(400).json({ status: "error", message: error.message });
        }
    }
    async findAll(req: Request, res: Response){
        try{
            const page = Number(req.query.page || 1);
            const perPage = Number(req.query.perPage || 10);
            const posts = await prismaClient.post.findMany({
                include: {
                    medias: true,
                    author: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true
                        }
                    }
                },
                take: perPage,
                skip: perPage * (page - 1),
            });
            return res.json({ status: "success", data: posts });
        }catch(error: any){
            return res.status(400).json({ status: "error", message: error.message });
        }
    }
}
export { PostController }