import { BlogCreateForDBType } from "../models/blog_models/BlogCreateForDBModel";
import { BlogUpdateType } from "../models/blog_models/BlogUpdateModel";
import { collectionBlog } from "../db/db";


const optionsCollection = {
    projection: {_id: 0}
} 

export const blogsRepository = {

    async findBlogsById(id: string){
        return await collectionBlog.findOne({id}, optionsCollection )
    },
  
    async createBlog(blog: BlogCreateForDBType){
        return await collectionBlog.insertOne(blog)
    },

    async updateBlog(blog: BlogUpdateType){
        const res = await collectionBlog.updateOne({id: blog.id}, {$set: {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        }})

        return res.matchedCount === 1
    },

    async deleteBlog(id: string){
        const res = await collectionBlog.deleteOne({id})

        return res.deletedCount === 1
    },

    async deleteAllBlogs(){
        await collectionBlog.deleteMany({})
        return true
    }
}