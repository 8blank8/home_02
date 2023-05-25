import { collectionPost } from "../db/db"
import { Sort } from "../models/PostAndBlogSortModel"
import { PostFindType } from "../models/PostFindModel"
import { DEFAULT_QUERY } from "../enum/enumDefaultQuery"


const optionsCollection = {
    projection: {_id: 0}
} 

export const postsQueryRepository = {
    async findPosts(option: PostFindType, id?: string){

        const filter: any = {}

        if(id){
            filter.blogId = id
        }

        let pageNumber: number = DEFAULT_QUERY.PAGE_NUMBER
        let pageSize: number = DEFAULT_QUERY.PAGE_SIZE

        
        let sort: Sort = {
            sortBy: DEFAULT_QUERY.SORT_BY.toString(),
            sortDirection: DEFAULT_QUERY.SORT_DIRECTION
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

        const post = await collectionPost.find(filter, optionsCollection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort(sort.sortBy, sort.sortDirection)
            .toArray()

        const postCount = await collectionPost.find(filter, optionsCollection).toArray()

        return {
            pagesCount: Math.ceil(postCount.length / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: postCount.length,
            items: post
        }
    },

    async findPostById(id: string){
        return collectionPost.findOne({id}, optionsCollection)
    },
}