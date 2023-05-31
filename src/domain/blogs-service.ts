import { BlogsType } from "../models/blog_models/BlogsModel";
import { BlogCrateType } from "../models/blog_models/BlogCreateModel";
import { BlogUpdateType } from "../models/blog_models/BlogUpdateModel";
import { blogsRepository } from "../repositories/blogs-repository";


export const blogsService = {

    async createBlog(blog: BlogCrateType){
        const createdBlog: BlogsType = {
            id: String(+(new Date())),
            createdAt: new Date().toISOString(),
            isMembership: false,
            ...blog
        }

        await blogsRepository.createBlog(createdBlog)

        return createdBlog.id
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