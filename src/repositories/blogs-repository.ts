import { BlogsType } from "../models/BlogsModel";
import { BlogCrateType } from "../models/BlogCreateModel";
import { BlogUpdateType } from "../models/BlogUpdateModel";
import { collectionBlog } from "../db/db";


const optionsCollection = {
    projection: {_id: 0}
} 

export const blogsRepository = {
    async findBlogs(){
        return collectionBlog.find({}, optionsCollection).toArray()
    },

    async findBlogsById(id: string){
        const res = await collectionBlog.findOne({id}, optionsCollection )
        return res
    },

    async createBlog(blog: BlogCrateType){
        const createdBlog: BlogsType = {
            id: String(+(new Date())),
            createdAt: new Date().toISOString(),
            isMembership: false,
            ...blog
        }

        await collectionBlog.insertOne(createdBlog)

        return createdBlog
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