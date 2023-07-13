import { Request, Response } from "express";
import { STATUS_CODE } from "../enum/enumStatusCode";
import { DEFAULT_QUERY } from "../enum/enumDefaultQuery";

import { BlogsService } from "../domain/blogs-service";
import { PostsService } from "../domain/posts-service";

import { PostsQueryRepository } from "../repositories/posts-query-repository";
import { BlogsQueryRepository } from "../repositories/blogs-query-repository";
import { inject, injectable } from "inversify";


@injectable()
export class BlogController {

    constructor(
        @inject(BlogsService) protected blogsService: BlogsService,
        @inject(PostsService) protected postsService: PostsService,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository
    ){}

    async getBlogs(req: Request, res: Response) {
        const { 
            searchNameTerm, 
            sortBy = DEFAULT_QUERY.SORT_BY, 
            sortDirection = DEFAULT_QUERY.SORT_DIRECTION, 
            pageNumber = DEFAULT_QUERY.PAGE_NUMBER, 
            pageSize = DEFAULT_QUERY.PAGE_SIZE
        } = req.query
       
    
        const blogs = await this.blogsQueryRepository.findBlogs({
            searchNameTerm: searchNameTerm?.toString(),
            pageNumber: +pageNumber,
            pageSize: +pageSize,
            sortBy: sortBy.toString(),
            sortDirection: sortDirection
        })
        res.status(STATUS_CODE.OK_200).send(blogs)
    }

    async getBlog(req: Request, res: Response) {
        const { id } = req.params
    
        const blog = await this.blogsQueryRepository.findBlogsById(id)
    
        if (blog) {
            res.status(STATUS_CODE.OK_200).send(blog)
        } else {
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        }
    }

    async getPostsByBlogId(req: Request, res: Response) {
        const { id } = req.params
        const { 
            pageSize = DEFAULT_QUERY.PAGE_SIZE, 
            pageNumber = DEFAULT_QUERY.PAGE_NUMBER, 
            sortBy = DEFAULT_QUERY.SORT_BY, 
            sortDirection = DEFAULT_QUERY.SORT_DIRECTION 
        } = req.query

        const isBlog = await this.blogsQueryRepository.findBlogsById(id)

        if (!isBlog) {
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
            return
        }

        const posts = await this.postsQueryRepository.findPosts({
            pageNumber: +pageNumber,
            pageSize: +pageSize,
            sortBy: sortBy.toString(),
            sortDirection
        }, id)

        res.status(STATUS_CODE.OK_200).send(posts)
    }

    async createBlog(req: Request, res: Response) {
        const { name, description, websiteUrl } = req.body

        const cretatedBlogId = await this.blogsService.createBlog({ name, description, websiteUrl })
        const blog = await this.blogsQueryRepository.findBlogsById(cretatedBlogId)

        res.status(STATUS_CODE.CREATED_201).send(blog)
    }

    async createPostByBlogId(req: Request, res: Response) {
        const { id } = req.params
        const { title, shortDescription, content } = req.body

        const createdPostId = await this.postsService.createPost({ title, shortDescription, content, blogId: id })
        const post = await this.postsQueryRepository.findPostById(createdPostId)

        res.status(STATUS_CODE.CREATED_201).send(post)
    }

    async updateBlog(req: Request, res: Response) {
        const { name, description, websiteUrl } = req.body
        const { id } = req.params

        const isUpdate = await this.blogsService.updateBlog({ id, name, description, websiteUrl })

        if (isUpdate) {
            res.sendStatus(STATUS_CODE.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        }
    }

    async deleteBlog(req: Request, res: Response) {
        const { id } = req.params

        const isDelete = await this.blogsService.deleteBlog(id)

        if (isDelete) {
            res.sendStatus(STATUS_CODE.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        }
    }
}