import { BlogCreateForDBType } from "../models/blog_models/BlogCreateForDBModel";
import { BlogUpdateType } from "../models/blog_models/BlogUpdateModel";
import { BlogModel } from "../db/db";


const optionsCollection = {
    projection: {_id: 0}
} 

class BlogsRepository {

    async findBlogsById(id: string){
        return await BlogModel.findOne({id}, optionsCollection )
    }
  
    async createBlog(blog: BlogCreateForDBType){
        return await BlogModel.insertMany(blog)
    }

    async updateBlog(blog: BlogUpdateType){
        const res = await BlogModel.updateOne({id: blog.id}, {$set: {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        }})

        return res.matchedCount === 1
    }

    async deleteBlog(id: string){
        const res = await BlogModel.deleteOne({id})

        return res.deletedCount === 1
    }
 
    async deleteAllBlogs(){
        await BlogModel.deleteMany({})
        return true
    }
}

export const blogsRepository = new BlogsRepository()