import { PostsType } from "../models/PostsModel"
import { PostCreate } from "../models/PostCreateModel"
import { PostUpdateType } from "../models/PostUpdateModel"
import { postsRepository } from "../repositories/posts-repository"
import { blogsRepository } from "../repositories/blogs-repository"

export const postsService = {

    async createPost(post: PostCreate){
        const blog = await blogsRepository.findBlogsById(post.blogId)

        const createdPost: PostsType= {
            id: String(+(new Date())),
            blogName: blog!.name,
            createdAt: new Date().toISOString(),
            ...post
        }

        await postsRepository.createPost(createdPost)
        
        return createdPost.id
    },

    async updatePost(post: PostUpdateType){
        return await postsRepository.updatePost(post)
    },

    async deletePost(id: string){
        return await postsRepository.deletePost(id)
    },

    async deleteAllPosts(){
       return await postsRepository.deleteAllPosts()
    }
}