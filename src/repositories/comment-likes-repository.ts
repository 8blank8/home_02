import { CommentLikesModel } from "../db/db"
import { LIKE_STATUS } from "../enum/enumLikeStatus"
import { CommentLikesDBType } from "../models/comment_likes/CommentLikesDBModel"

export class CommentLikesRepository {

    async getMyStatusLike(userId: string, commentId: string){
        const data = await CommentLikesModel.findOne({userId: userId, commentId: commentId})
        return data
    }

    async createLikes(data: CommentLikesDBType){
        return await CommentLikesModel.insertMany(data)
    }

    async updateMyStatus(data: CommentLikesDBType){
        const res = await CommentLikesModel.updateOne({})
    }
}