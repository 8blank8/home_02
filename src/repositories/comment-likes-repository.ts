import { injectable } from "inversify"
import { CommentLikesModel } from "../db/db"
import { CommentLikesDBType } from "../models/comment_likes/CommentLikesDBModel"


@injectable()
export class CommentLikesRepository {

    async getMyStatusLike(userId: string, commentId: string){
        const data = await CommentLikesModel.findOne({userId: userId, commentId: commentId})
        return data
    }

    async createLikes(data: CommentLikesDBType){
        return await CommentLikesModel.insertMany(data)
    }

    async updateMyStatus(data: CommentLikesDBType){
        const res = await CommentLikesModel.updateOne({commentId: data.commentId, userId: data.userId}, {$set:{status: data.status}})
        return res.matchedCount === 1
    }
}