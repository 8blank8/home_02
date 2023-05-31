import { collectionPost } from "../db/db"
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

        const post = await collectionPost.find(filter, optionsCollection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort(sortBy, sortDirection)
            .toArray()

        const postCount = (await collectionPost.find(filter, optionsCollection).toArray()).length

        return {
            pagesCount: Math.ceil(postCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: postCount,
            items: post
        }
    },

    async findPostById(id: string){
        return collectionPost.findOne({id}, optionsCollection)
    },
}