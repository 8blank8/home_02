
export type CommentCreateType = {
    id: string
    content: string,
    user: User
}

type User = {
    id: string,
    login: string
}