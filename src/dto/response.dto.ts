import { user } from './user.dto'

export interface response {
    responseId: string,
    details: string,
    address: string,
    postId: string,
    dateAdded: string,
    userId: user,
    isValid: boolean,
    imageLink: string
}