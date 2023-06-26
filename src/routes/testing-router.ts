import { Router, Request, Response } from "express";
import { postsRepository } from "../repositories/posts-repository";
import { blogsRepository } from "../repositories/blogs-repository";
import { usersRepository } from "../repositories/users-repository";
import { commentsRepository } from "../repositories/commets-repository";

export const testingRouter = Router({})

testingRouter.delete('/', async (req: Request, res: Response) => {
    await postsRepository.deleteAllPosts(),
    await blogsRepository.deleteAllBlogs(),
    await usersRepository.deleteAllUsers(),
    await commentsRepository.deleteAllComments()
        
    return res.sendStatus(204)
 })