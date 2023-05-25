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
        let pageNumber: number = DEFAULT_QUERY.PAGE_NUMBER
        let pageSize: number = DEFAULT_QUERY.PAGE_SIZE

        let sort: Sort = {
            sortBy: DEFAULT_QUERY.SORT_BY.toString(),
            sortDirection: DEFAULT_QUERY.SORT_DIRECTION
        }

        if(option.searchNameTerm) {
            filter.name = {$regex: option.searchNameTerm}
        }

        if(option.pageNumber){
            pageNumber = option.pageNumber
        } 

        if(option.pageSize){
            pageSize = option.pageSize
        }

        if(option.sortBy){
            sort.sortBy = option.sortBy
        }

        if(option.sortDirection){
            sort.sortDirection = option.sortDirection
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
        return await collectionBlog.findOne({id}, optionsCollection )
    },
}