import { PostUpdateType } from "../models/post_models/PostUpdateModel"
import { PostModel } from "../db/db"
import { PostCreateForDBType } from "../models/post_models/PostCreateForDBModel"
import { injectable } from "inversify"


@injectable()
export class PostsRepository {

    async createPost(post: PostCreateForDBType){
        return await PostModel.insertMany(post)
    }

    async updatePost(post: PostUpdateType){

        const res = await PostModel.updateOne({id: post.id}, {$set: {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId
        }})

        return res.matchedCount === 1
    }

    async deletePost(id: string){

        const res = await PostModel.deleteOne({id})
        
        return res.deletedCount === 1
    }

    async deleteAllPosts(){
        await PostModel.deleteMany({})
        return true
    }
}
