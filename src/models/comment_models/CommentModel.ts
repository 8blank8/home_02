export type CommentType = {
    id: string
    postId: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
    likesInfo: LikesInfo
}

type CommentatorInfo = {
    userId: string
    userLogin: string
}

type LikesInfo = {
    likesCount: number
    dislikesCount: number
    myStatus: string
}