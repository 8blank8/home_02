import { UserViewType } from "../models/UserViewModel";

declare global {
    namespace Express {
        export interface Request {
            user: UserViewType | null
        }
    }
}