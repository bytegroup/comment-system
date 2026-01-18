import {IUser} from "@/user/models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}