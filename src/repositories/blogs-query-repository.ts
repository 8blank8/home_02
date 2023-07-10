import { BlogModel } from "../db/db"
import { BlogFindType } from "../models/blog_models/BlogFindModel"

const optionsCollection = {
    projection: {_id: 0}
} 

class BlogsQueryRepository {
    async findBlogs(option: BlogFindType){

        const {searchNameTerm, sortBy, sortDirection, pageNumber, pageSize} = option

        const filter: any = {}

        if(searchNameTerm) {
            const filterName = new RegExp(`${searchNameTerm}`, 'i')
            filter.name = {$regex: filterName} 
        }

        const blogs = await BlogModel.find(filter, optionsCollection)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({[sortBy]: sortDirection})
        .lean()

        const blogCount = (await BlogModel.find(filter, optionsCollection).lean()).length

        return {
            pagesCount: Math.ceil(blogCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: blogCount,
            items: blogs
        }
    }

    async findBlogsById(id: string){
        return await BlogModel.findOne({id: id}, optionsCollection)
    }
}

export const blogsQueryRepository = new BlogsQueryRepository()