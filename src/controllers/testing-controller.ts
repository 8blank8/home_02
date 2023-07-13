import { Request, Response } from "express";
import { PostsRepository } from "../repositories/posts-repository";
import { BlogsRepository } from "../repositories/blogs-repository";
import { UsersRepository } from "../repositories/users-repository";
import { CommentsRepository } from "../repositories/commets-repository";
import { SecurityRepository } from "../repositories/security-respository";
import { inject, injectable } from "inversify";


@injectable()
export class TestingController {

    constructor(
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
        @inject(SecurityRepository) protected securityRepository: SecurityRepository
    ){}

    async deleteAllData(req: Request, res: Response) {
        await this.postsRepository.deleteAllPosts()
        await this.blogsRepository.deleteAllBlogs()
        await this.usersRepository.deleteAllUsers()
        await this.commentsRepository.deleteAllComments()
        await this.securityRepository.deleteAllDevice()
            
        return res.sendStatus(204)
     }
}