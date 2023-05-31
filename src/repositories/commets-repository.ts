import { collectionComment } from "../db/db";
import { CommentType } from "../models/comment_models/CommentModel";


export const commentsRepository = {
    async createComment(comment: CommentType){
        await collectionComment.insertOne(comment)
    },

    async updateComment(id: string, content: string){

        const res = await collectionComment.updateOne({id}, {$set: {content}})
        return res.matchedCount === 1
    },

    async deleteComment(id: string){
        const res = await collectionComment.deleteOne({id})
        return res.deletedCount === 1
    },

    async deleteAllComments(){
        await collectionComment.deleteMany({})
    }
}