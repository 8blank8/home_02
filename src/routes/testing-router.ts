import { Router, Request, Response } from "express";
import { postsRepository } from "../repositories/posts-repository";
import { blogsRepository } from "../repositories/blogs-repository";

export const testingRouter = Router({})

testingRouter.delete('/', (req: Request, res: Response) => {
    postsRepository.deleteAllPosts()
    blogsRepository.deleteAllBlogs()
     
    res.sendStatus(204)
     
 })