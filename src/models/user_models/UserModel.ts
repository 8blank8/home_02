export type UserType = {
    id: string
    acountData: AcountDataType
    emailConfirmation: EmailConfirmationType
}

type AcountDataType = {
    passwordHash: string
    login: string
    email: string
    createdAt: Date
}

type EmailConfirmationType = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}
// acountData: {
//     passwordHash,
//     login: user.login,
//     email: user.email,
//     createdAt: new Date()
// },
// emailConfirmation: {
//     confirmationCode: uuidv4(),
//     expirationDate: add(new Date(), {
//         minutes: 3
//     }),
//     isConfirmed: false
// }