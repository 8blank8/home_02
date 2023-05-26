export type UserType = {
    id: string
    passwordSalt: string 
    passwordHash: string
    login: string
    email: string
    createdAt: Date
}