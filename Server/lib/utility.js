import bcrypt from 'bcrypt';

async function hashPassword(password) {
 const hash = await bcrypt.hash(password, 10);
 console.log("hashed --> " + hash)
    return hash;
}

async function comparePassword(password, hash){
    const result = await bcrypt.compare(password, hash);
    return result;
}

export {hashPassword, comparePassword};