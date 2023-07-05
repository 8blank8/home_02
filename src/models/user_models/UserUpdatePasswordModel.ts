export type UserUpdatePasswordType = {
    userId: string
    passwordHash: string
    isExpired: boolean
}