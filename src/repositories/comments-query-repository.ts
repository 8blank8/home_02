import { CommentLikesModel, CommentModel } from "../db/db"
import { DEFAULT_QUERY } from "../enum/enumDefaultQuery"
import { LIKE_STATUS } from "../enum/enumLikeStatus"
import { CommentFindType } from "../models/comment_models/CommentFindModel"
import { CommentType } from "../models/comment_models/CommentModel"
import { CommentViewType } from "../models/comment_models/CommentViewModel"
import { Sort } from "../models/post_models/PostAndBlogSortModel"


export class CommentsQueryRepository {

    async findCommentById(id: string, userId: string | undefined){
        const comment = await CommentModel.findOne({id})
        if(!comment) return null

        return await this._mapComment(comment, userId)
    }

    async findComments(id: string, option: CommentFindType, userId: string | undefined){

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
            items: await Promise.all(comments.map(async item => await this._mapComment(item, userId))) 
        }
    }

    async _mapComment(comment: CommentType, userId: string | undefined){
        let likeStatus: string = LIKE_STATUS.NONE

        if(userId){
            const status = await CommentLikesModel.findOne({userId: userId, commentId: comment.id})
            if(status){
                likeStatus = status.status
            }
        }

        return {
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: await CommentLikesModel.countDocuments({commentId: comment.id, status: LIKE_STATUS.LIKE}),
                dislikesCount: await CommentLikesModel.countDocuments({commentId: comment.id, status: LIKE_STATUS.DISLIKE}),
                myStatus: likeStatus
            }
            
        }
    }
}
