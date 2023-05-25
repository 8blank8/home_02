import { BlogsType } from "../models/BlogsModel";
import { BlogCrateType } from "../models/BlogCreateModel";
import { BlogUpdateType } from "../models/BlogUpdateModel";
import { blogsRepository } from "../repositories/blogs-repository";
import { postsRepository } from "../repositories/posts-repository";


export const blogsService = {

    async createBlog(blog: BlogCrateType){
        const createdBlog: BlogsType = {
            id: String(+(new Date())),
            createdAt: new Date().toISOString(),
            isMembership: false,
            ...blog
        }

        await blogsRepository.createBlog(createdBlog)

        return createdBlog
    },

    

    async updateBlog(blog: BlogUpdateType){
        return await blogsRepository.updateBlog(blog)
    },

    async deleteBlog(id: string){
        return await blogsRepository.deleteBlog(id)
    },

    async deleteAllBlogs(){
        return await blogsRepository.deleteAllBlogs()
    }
}