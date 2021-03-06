export interface post {
    name: string,
    fatherName: string,
    age: number,
    city: string,
    state: string,
    locationOfMissing: string,
    dateOfMissing: string,
    isActive: boolean,
    isFound?: false,
    responses?: Array<Object>,
    responsesCount?: number,
    dateAdded: string,
    postId: string,
    imageLink?: string,
    closeDate?: string,
}