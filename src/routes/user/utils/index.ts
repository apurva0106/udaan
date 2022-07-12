import { post } from '../../../dto/post.dto'
import dateParser from '../../../utils/dateParse';
import { response } from '../../../dto/response.dto'
import { user } from '../../../dto/user.dto';
import { userPost } from '../../../dto/user.post.dto'

const userDataFetcher = (userData: any): any => {
    try {
        let finalUserData: user = {
            name: userData.name,
            email: userData.email,
            contact: userData.contact || 'N/A'
        };

        return finalUserData;
    } catch (e) {
        console.log('error in fetching user data ', e);
        return {};
    }
}

const responseDataFetcher = async (responsesData: Array<Object>): Promise<Array<response>> => {
    try {

        let finalData: response[] = [];
        responsesData.map((responseData: any) => {
            let tempObj: response = {
                responseId: responseData._id,
                postId: responseData.postId,
                details: responseData.details,
                address: responseData.address,
                dateAdded: dateParser(responseData.createdAt),
                userId: userDataFetcher(responseData.userId),
                isValid: responseData.isValid,
                imageLink: responseData.imageLink || ''
            };
            finalData.push(tempObj);
        });

        return finalData;
    } catch (e) {
        console.log('error in manipulating resposne Data', e);
        return [];
    }
}



const postDataFetcher = async (postsData: any): Promise<userPost> => {
    try {
        let finalData: userPost = { activePosts: [], locatedPosts: [] };
        postsData.map((postData: any) => {
            let { name, fatherName, age, imageLink, closeDate, city, state, locationOfMissing, dateOfMissing, isActive, isFound, responses, _id, createdAt } = postData;
            let tempObj: post = {
                name,
                fatherName,
                age,
                city,
                state,
                locationOfMissing,
                dateOfMissing,
                isActive,
                isFound,
                responsesCount: responses.length || 0,
                postId: _id,
                dateAdded: dateParser(createdAt),
                imageLink: imageLink || '',
                closeDate: closeDate || ''

            };
            tempObj.isFound ? finalData.locatedPosts.push(tempObj) : finalData.activePosts.push(tempObj);
        })
        return finalData;
    } catch (e) {
        console.log('error in fetching posts data', e);
        return { activePosts: [], locatedPosts: [] };
    }
}


export { postDataFetcher, responseDataFetcher }