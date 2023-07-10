import { Router, Request, Response } from "express";
import { PostsRepository } from "../repositories/posts-repository";
import { BlogsRepository } from "../repositories/blogs-repository";
import { UsersRepository } from "../repositories/users-repository";
import { CommentsRepository } from "../repositories/commets-repository";
import { SecurityRepository } from "../repositories/security-respository";

export const testingRouter = Router({})

class TestingController {

    postsRepository: PostsRepository
    blogsRepository: BlogsRepository
    usersRepository: UsersRepository
    commentsRepository: CommentsRepository
    securityRepository: SecurityRepository
    constructor(){
        this.postsRepository = new PostsRepository()
        this.blogsRepository = new BlogsRepository()
        this.usersRepository = new UsersRepository()
        this.commentsRepository = new CommentsRepository()
        this.securityRepository = new SecurityRepository()
    }

    async deleteAllData(req: Request, res: Response) {
        await this.postsRepository.deleteAllPosts()
        await this.blogsRepository.deleteAllBlogs()
        await this.usersRepository.deleteAllUsers()
        await this.commentsRepository.deleteAllComments()
        await this.securityRepository.deleteAllDevice()
            
        return res.sendStatus(204)
     }
}

const testingController = new TestingController()

testingRouter.delete('/', testingController.deleteAllData.bind(testingController))