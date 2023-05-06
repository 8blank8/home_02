import { BlogsType } from "../models/BlogsModel";
import { BlogCrateType } from "../models/BlogCreateModel";
import { BlogUpdateType } from "../models/BlogUpdateModel";

const blogs: BlogsType[] = [{
    id: 'string',
    name: 'Vladimir',
    description: 'asdmklasmlg alsfalfgnsla asklmfalskm',
    websiteUrl: 'http://site.com'
}]

export const blogsRepository = {
    findBlogs(){
        return blogs
    },

    findBlogsById(id: string){
        const blog = blogs.find(item => item.id === id)
        return blog
    },

    createBlog(blog: BlogCrateType){
        const createdBlog: BlogsType = {
            id: String(+(new Date())),
            ...blog
        }

        blogs.push(createdBlog)

        return createdBlog
    },

    updateBlog(blog: BlogUpdateType){
        const updateBlog = blogs.find(item => item.id === blog.id)

        if(updateBlog){
            updateBlog.name = blog.name
            updateBlog.description = blog.description
            updateBlog.websiteUrl = blog.websiteUrl
            return true
        }else{
            return false
        }
    },

    deleteBlog(id: string){
        const blog = blogs.find(item => item.id === id)

        if(blog){
            blogs.splice(blogs.indexOf(blog), 1)
            return true
        }else{
            return false
        }
    },

    deleteAllBlogs(){
        blogs.length = 0
        return true
    }
}