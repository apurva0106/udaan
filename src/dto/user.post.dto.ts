import { post } from './post.dto'

export interface userPost {
    activePosts: Array<post>,
    locatedPosts: Array<post>
}