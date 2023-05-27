import { collectionBlog } from "../db/db"
import { BlogFindType } from "../models/BlogFindModel"
import { Sort } from "../models/PostAndBlogSortModel"
import { DEFAULT_QUERY } from "../enum/enumDefaultQuery"

const optionsCollection = {
    projection: {_id: 0}
} 

export const blogsQueryRepository = {
    async findBlogs(option: BlogFindType){

        const filter: any = {}
        const pageNumber: number = typeof option.pageNumber == 'undefined' ? DEFAULT_QUERY.PAGE_NUMBER : Number(option.pageNumber)
        const pageSize: number = typeof option.pageSize == 'undefined' ? DEFAULT_QUERY.PAGE_SIZE : Number(option.pageSize)
        
        const sort: Sort = {
            sortBy: option.sortBy ?? DEFAULT_QUERY.SORT_BY,
            sortDirection: option.sortDirection ?? DEFAULT_QUERY.SORT_DIRECTION
        }

        if(option.searchNameTerm) {
            const filterName = new RegExp(`${option.searchNameTerm}`, 'i')
            filter.name = {$regex: filterName} 
        }

        const blogs = await collectionBlog.find(filter, optionsCollection)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort(sort.sortBy, sort.sortDirection)
        .toArray()

        const blogCount = await collectionBlog.find(filter, optionsCollection).toArray()

        return {
            pagesCount: Math.ceil(blogCount.length / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: blogCount.length,
            items: blogs
        }
    },

    async findBlogsById(id: string){
        return await collectionBlog.findOne({id: id}, optionsCollection)
    },
}