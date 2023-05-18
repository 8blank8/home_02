import { PostUpdateType } from "../models/PostUpdateModel"
import { collectionPost } from "../db/db"
import { PostCreateForDBType } from "../models/PostCreateForDBModel"


export const postsRepository = {

    async createPost(post: PostCreateForDBType){
        return await collectionPost.insertOne(post)
    },

    async updatePost(post: PostUpdateType){

        const res = await collectionPost.updateOne({id: post.id}, {$set: {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId
        }})

        return res.matchedCount === 1
    },

    async deletePost(id: string){

        const res = await collectionPost.deleteOne({id})
        
        return res.deletedCount === 1
    },

    async deleteAllPosts(){
        await collectionPost.deleteMany({})
        return true
    }
}