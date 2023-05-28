import { CommentCreateType } from "../models/CommentCreateModel"
import { CommentType } from "../models/CommentModel"
import { commentsRepository } from "../repositories/commets-repository"

export const commentsService = {
    async createComment(comment: CommentCreateType){
        const createComment: CommentType = {
            id: (+(new Date())).toString(),
            postId: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.user.id,
                userLogin: comment.user.login
            },
            createdAt: new Date().toISOString()
        }

        await commentsRepository.createComment(createComment)

        return createComment.id
    },

    async updateComment(id: string, content: string){
        return await commentsRepository.updateComment(id, content)
    },

    async deleteComment(id: string){
        return await commentsRepository.deleteComment(id)
    }
}