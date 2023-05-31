import { UserViewType } from "../models/user_models/UserViewModel";

declare global {
    namespace Express {
        export interface Request {
            user: UserViewType | null
        }
    }
}