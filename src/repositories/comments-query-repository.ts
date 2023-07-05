// import { collectionComment } from "../db/db"
import { CommentModel } from "../db/db"
import { DEFAULT_QUERY } from "../enum/enumDefaultQuery"
import { CommentFindType } from "../models/comment_models/CommentFindModel"
import { CommentType } from "../models/comment_models/CommentModel"
import { CommentViewType } from "../models/comment_models/CommentViewModel"
import { Sort } from "../models/post_models/PostAndBlogSortModel"


export const commentsQueryRepository = {
    async findCommentById(id: string){
        const comment = await CommentModel.findOne({id})
        
        if(!comment) return null

        return this._mapComment(comment)
    },

    async findComments(id: string, option: CommentFindType){

        const filter: any = {}

        const pageNumber: number = typeof option.pageNumber === 'undefined' ? DEFAULT_QUERY.PAGE_NUMBER : Number(option.pageNumber)
        const pageSize: number = typeof option.pageSize == 'undefined' ? DEFAULT_QUERY.PAGE_SIZE : Number(option.pageSize)
        
        const sort: Sort = {
            sortBy: option.sortBy ?? DEFAULT_QUERY.SORT_BY.toString(),
            sortDirection: option.sortDirection ?? DEFAULT_QUERY.SORT_DIRECTION
        }

        if(id){
            filter.postId = id
        }

        const comments = await CommentModel.find(filter)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sort.sortBy]: sort.sortDirection})
            .lean()

        const postCount = (await CommentModel.find(filter).lean()).length

        return {
            pagesCount: Math.ceil(postCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: postCount,
            items: comments.map(this._mapComment)
        }
    },

    _mapComment(comment: CommentType): CommentViewType{
        return {
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt
        }
    }
}