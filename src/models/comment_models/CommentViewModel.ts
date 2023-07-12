export type CommentViewType = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string
    likesInfo: LikesInfo
}

type LikesInfo = {
    likesCount: number
    dislikesCount: number
    myStatus: string
}