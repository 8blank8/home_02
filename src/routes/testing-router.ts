import { Router, Request, Response } from "express";
import { postsRepository } from "../repositories/posts-repository";
import { blogsRepository } from "../repositories/blogs-repository";
import { usersRepository } from "../repositories/users-repository";

export const testingRouter = Router({})

testingRouter.delete('/', (req: Request, res: Response) => {
    postsRepository.deleteAllPosts()
    blogsRepository.deleteAllBlogs()
    usersRepository.deleteAllUsers()
     
    res.sendStatus(204)
     
 })