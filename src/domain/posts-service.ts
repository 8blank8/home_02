import { PostsType } from "../models/post_models/PostsModel"
import { PostCreate } from "../models/post_models/PostCreateModel"
import { PostUpdateType } from "../models/post_models/PostUpdateModel"

import { PostsRepository } from "../repositories/posts-repository"
import { BlogsRepository } from "../repositories/blogs-repository"

export class PostsService {

    blogsRepository: BlogsRepository
    postsRepository: PostsRepository
    constructor(){
        this.blogsRepository = new BlogsRepository()
        this.postsRepository = new PostsRepository()
    }

    async createPost(post: PostCreate){
        const blog = await this.blogsRepository.findBlogsById(post.blogId)

        const createdPost: PostsType= {
            id: String(+(new Date())),
            blogName: blog!.name,
            createdAt: new Date().toISOString(),
            ...post
        }

        await this.postsRepository.createPost(createdPost)
        
        return createdPost.id
    }

    async updatePost(post: PostUpdateType){
        return await this.postsRepository.updatePost(post)
    }

    async deletePost(id: string){
        return await this.postsRepository.deletePost(id)
    }

    async deleteAllPosts(){
       return await this.postsRepository.deleteAllPosts()
    }
}
