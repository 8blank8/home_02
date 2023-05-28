import { Router, Request, Response } from "express";
import { postsRepository } from "../repositories/posts-repository";
import { blogsRepository } from "../repositories/blogs-repository";
import { usersRepository } from "../repositories/users-repository";
import { commentsRepository } from "../repositories/commets-repository";

export const testingRouter = Router({})

testingRouter.delete('/', (req: Request, res: Response) => {
    postsRepository.deleteAllPosts()
    blogsRepository.deleteAllBlogs()
    usersRepository.deleteAllUsers()
    commentsRepository.deleteAllComments()

    res.sendStatus(204)
 })