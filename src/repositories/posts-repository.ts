import { PostsType } from "../models/PostsModel"
import { blogsRepository } from "./blogs-repository"
import { PostCreate } from "../models/PostCreateModel"
import { PostUpdateType } from "../models/PostUpdateModel"

const posts: PostsType[] = [{
    id: "string",
    title: "one",
    shortDescription: "fakkajkajsue",
    content: "baskjbfkasbfk",
    blogId: "string",
    blogName: "Vladimir"
}]

export const postsRepository = {
    findPosts(){
        return posts
    },

    findPostById(id: string){
        const post = posts.find(item => item.id == id)
        return post
    },

    createPost(post: PostCreate){
        const createdPost: PostsType= {
            id: String(+(new Date())),
            blogName: blogsRepository.findBlogsById(post.blogId)?.name,
            ...post
        }

        posts.push(createdPost)
        
        return createdPost
    },

    updatePost(post: PostUpdateType){
        const updatePost = posts.find(item => item.id == post.id)

        if(updatePost){
            updatePost.title = post.title
            updatePost.shortDescription = post.shortDescription
            updatePost.content = post.content,
            updatePost.blogId = post.blogId
            return true
        }else{
            return false
        }
    },

    deletePost(id: string){
        const post = posts.find(item => item.id == id)

        if(post){
            posts.splice(posts.indexOf(post), 1)
            return true
        }else{
            return false
        }
    },

    deleteAllPosts(){
        posts.length = 0
        return true
    }
}