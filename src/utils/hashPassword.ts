const bcrypt = require("bcryptjs");
const saltRounds = 10;

const hashPassword = async (plainPassword: string): Promise<string> => {
    try {
        let salt = await bcrypt.genSalt(saltRounds);
        let hash = await bcrypt.hash(plainPassword, salt);

        return hash;
    } catch (e) {
        console.log("eeeeee", e);
        return "";
    }
};

export default hashPassword;
