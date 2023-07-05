// import { collectionComment } from "../db/db";
import { CommentModel } from "../db/db";
import { CommentType } from "../models/comment_models/CommentModel";


export const commentsRepository = {
    async createComment(comment: CommentType){
        await CommentModel.insertMany(comment)
    },

    async updateComment(id: string, content: string){

        const res = await CommentModel.updateOne({id}, {$set: {content}})
        return res.matchedCount === 1
    },

    async deleteComment(id: string){
        const res = await CommentModel.deleteOne({id})
        return res.deletedCount === 1
    },

    async deleteAllComments(){
        await CommentModel.deleteMany({})
    }
}