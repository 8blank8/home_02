import { CommentModel } from "../db/db";
import { CommentType } from "../models/comment_models/CommentModel";


class CommentsRepository {
    async createComment(comment: CommentType){
        await CommentModel.insertMany(comment)
    }

    async updateComment(id: string, content: string){

        const res = await CommentModel.updateOne({id}, {$set: {content}})
        return res.matchedCount === 1
    }

    async deleteComment(id: string){
        const res = await CommentModel.deleteOne({id})
        return res.deletedCount === 1
    }

    async deleteAllComments(){
        await CommentModel.deleteMany({})
    }
}

export const commentsRepository = new CommentsRepository()