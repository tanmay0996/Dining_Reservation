const bcrypt = require("bcrypt");

async function generatePassword(pwd){
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(pwd, salt); // Hash the password

    return hash;
}

module.exports = generatePassword;