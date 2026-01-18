import {IUser} from "@/user/models/user.model";

declare global {
    namespace Express {
        interface User extends IUser {}   // 👈 This is the key fix
    }
}