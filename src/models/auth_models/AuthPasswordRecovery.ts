export type AuthPasswordRecoveryType = {
    userId: string
    confirmationCode: string,
    date: string,
    isExpired: boolean
}