import { Router, Request, Response } from "express";
import { postsRepository } from "../repositories/posts-repository";
import { blogsRepository } from "../repositories/blogs-repository";
import { usersRepository } from "../repositories/users-repository";
import { commentsRepository } from "../repositories/commets-repository";
import { securityRepository } from "../repositories/security-respository";
import { rateLimitRepository } from "../repositories/rate-limit-repository";

export const testingRouter = Router({})

testingRouter.delete('/', async (req: Request, res: Response) => {
    await postsRepository.deleteAllPosts()
    await blogsRepository.deleteAllBlogs()
    await usersRepository.deleteAllUsers()
    await commentsRepository.deleteAllComments()
    await securityRepository.deleteAllDevice()
    await rateLimitRepository.deleteAll()
        
    return res.sendStatus(204)
 })