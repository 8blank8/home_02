import { PostsType } from "../models/PostsModel"
import { PostCreate } from "../models/PostCreateModel"
import { PostUpdateType } from "../models/PostUpdateModel"
import { collectionBlog, collectionPost } from "../db/db"


export const postsRepository = {
    async findPosts(){
        return collectionPost.find({}).toArray()
    },

    async findPostById(id: string){
        return collectionPost.findOne({id})
    },

    async createPost(post: PostCreate){
        const blog = await collectionBlog.findOne({id: post.blogId})

        const createdPost: PostsType= {
            id: String(+(new Date())),
            blogName: blog?.name,
            createdAt: new Date().toISOString(),
            ...post
        }

        await collectionPost.insertOne(createdPost)
        
        return createdPost
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