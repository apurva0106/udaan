import { post } from "./post.dto";
import { userPost } from "./user.post.dto";

export interface user {
    userId?: string,
    name: string,
    email: string,
    contact: string,
    isActive?: boolean,
    isVerified?: boolean,
    posts?: userPost,
    postsCount?: number,
    dateAdded?: string
}