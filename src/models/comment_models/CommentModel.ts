export type CommentType = {
    id: string
    postId: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}

type CommentatorInfo = {
    userId: string
    userLogin: string
}
