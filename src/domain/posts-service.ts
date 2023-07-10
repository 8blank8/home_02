import { PostsType } from "../models/post_models/PostsModel"
import { PostCreate } from "../models/post_models/PostCreateModel"
import { PostUpdateType } from "../models/post_models/PostUpdateModel"
import { postsRepository } from "../repositories/posts-repository"
import { blogsRepository } from "../repositories/blogs-repository"

class PostsService {

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
    }

    async updatePost(post: PostUpdateType){
        return await postsRepository.updatePost(post)
    }

    async deletePost(id: string){
        return await postsRepository.deletePost(id)
    }

    async deleteAllPosts(){
       return await postsRepository.deleteAllPosts()
    }
}

export const postsService = new PostsService()