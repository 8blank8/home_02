import { LIKE_STATUS } from "../enum/enumLikeStatus"
import { CommentLikesDBType } from "../models/comment_likes/CommentLikesDBModel"
import { CommentCreateType } from "../models/comment_models/CommentCreateModel"
import { CommentType } from "../models/comment_models/CommentModel"
import { CommentLikesRepository } from "../repositories/comment-likes-repository"

import { CommentsRepository } from "../repositories/commets-repository"

export class CommentsService {
    
    constructor(
        protected commentsRepository: CommentsRepository,
        protected commentLikesRepository: CommentLikesRepository
        ){}

    async createComment(comment: CommentCreateType){
        const createComment: CommentType = {
            id: (+(new Date())).toString(),
            postId: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.user.id,
                userLogin: comment.user.login
            },
            createdAt: new Date().toISOString(),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LIKE_STATUS.NONE
            }
        }

        await this.commentsRepository.createComment(createComment)

        return createComment.id
    }

    async updateComment(id: string, content: string){
        return await this.commentsRepository.updateComment(id, content)
    }

    async deleteComment(id: string){
        return await this.commentsRepository.deleteComment(id)
    }

    async updateLikeStatus(commentId: string, likeStatus: string, userId: string){
        const commentLike = await this.commentLikesRepository.getMyStatusLike(userId, commentId)
        console.log(commentLike)
        if(!commentLike){
            const newCommentLike: CommentLikesDBType = {
                commentId: commentId,
                userId: userId,
                status: likeStatus
            }

            await this.commentLikesRepository.createLikes(newCommentLike)
            return true
        }
        
        let newLikeStatus: string = LIKE_STATUS.NONE

        switch(likeStatus){
            case LIKE_STATUS.LIKE: {
                newLikeStatus = LIKE_STATUS.LIKE
                break
            }
            case LIKE_STATUS.DISLIKE: {
                newLikeStatus = LIKE_STATUS.DISLIKE
                break
            }
            case LIKE_STATUS.NONE: {
                newLikeStatus = LIKE_STATUS.NONE
                break
            }
        }

        return await this.commentLikesRepository.updateMyStatus({
            commentId: commentId,
            userId: userId,
            status: newLikeStatus
        })
    }
}
