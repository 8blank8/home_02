export type UserType = {
    id: string
    passwordSalt: string 
    passwordHash: string
    userName: string
    email: string
    createdAt: Date
}