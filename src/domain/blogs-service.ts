import { BlogsType } from "../models/blog_models/BlogsModel";
import { BlogCrateType } from "../models/blog_models/BlogCreateModel";
import { BlogUpdateType } from "../models/blog_models/BlogUpdateModel";

import { BlogsRepository } from "../repositories/blogs-repository";


export class BlogsService {

    blogsRepository: BlogsRepository
    constructor(){
        this.blogsRepository = new BlogsRepository()
    }

    async createBlog(blog: BlogCrateType){
        const createdBlog: BlogsType = {
            id: String(+(new Date())),
            createdAt: new Date().toISOString(),
            isMembership: false,
            ...blog
        }

        await this.blogsRepository.createBlog(createdBlog)

        return createdBlog.id
    }

    async updateBlog(blog: BlogUpdateType){
        return await this.blogsRepository.updateBlog(blog)
    }

    async deleteBlog(id: string){
        return await this.blogsRepository.deleteBlog(id)
    }

    async deleteAllBlogs(){
        return await this.blogsRepository.deleteAllBlogs()
    }
}