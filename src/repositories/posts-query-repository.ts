// import { collectionPost } from "../db/db"
import { PostModel } from "../db/db"
import { PostFindType } from "../models/post_models/PostFindModel"


const optionsCollection = {
    projection: {_id: 0}
} 

export const postsQueryRepository = {
    async findPosts(option: PostFindType, id?: string){

        const {pageNumber, pageSize, sortBy, sortDirection} = option

        const filter: any = {}

        if(id){
            filter.blogId = id
        }

        const post = await PostModel.find(filter, optionsCollection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .lean()

        const postCount = (await PostModel.find(filter, optionsCollection).lean()).length

        return {
            pagesCount: Math.ceil(postCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: postCount,
            items: post
        }
    },

    async findPostById(id: string){
        return PostModel.findOne({id}, optionsCollection)
    },
}