import { CommentCreateType } from "../models/comment_models/CommentCreateModel"
import { CommentType } from "../models/comment_models/CommentModel"

import { CommentsRepository } from "../repositories/commets-repository"

export class CommentsService {
    
    constructor(protected commentsRepository: CommentsRepository){}

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

        await this.commentsRepository.createComment(createComment)

        return createComment.id
    }

    async updateComment(id: string, content: string){
        return await this.commentsRepository.updateComment(id, content)
    }

    async deleteComment(id: string){
        return await this.commentsRepository.deleteComment(id)
    }
}
