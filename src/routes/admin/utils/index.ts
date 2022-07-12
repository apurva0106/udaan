import { user } from "../../../dto/user.dto";
import dateParser from "../../../utils/dateParse";
import { postDataFetcher } from "../../user/utils";


const userDataFetcher = async (usersData: any): Promise<Array<user>> => {
    try {
        let finalData: Array<user> = [];
        usersData.map(async (userData: any) => {
            let tempObj: user = {
                userId: userData._id,
                name: userData.name,
                contact: userData.contact,
                email: userData.email,
                posts: await postDataFetcher(userData.posts),
                postsCount: userData.posts.length || 0,
                isActive: userData.isActive,
                isVerified: userData.isVerified,
                dateAdded: dateParser(userData.createdAt)
            };
            finalData.push(tempObj);
        });

        return finalData;
    } catch (e) {
        console.log('error in getting admin users data ', e);
        return [];
    }
}



export { userDataFetcher }