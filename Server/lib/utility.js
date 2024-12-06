import bcrypt from 'bcrypt';
import passwordValidator from 'password-validator';

async function hashPassword(password) {
 const hash = await bcrypt.hash(password, 10);
 console.log("hashed --> " + hash)
    return hash;
}

async function comparePassword(password, hash){
    const result = await bcrypt.compare(password, hash);
    return result;
}

async function adheresToPasswordPolicy(password, options) {
    const schema = new passwordValidator();

    // Add properties to it
    schema
    .is().min(8)
    .has().uppercase(1)
    .has().lowercase(1)
    .has().digits(1)
    .has().not().spaces(0)
return schema.validate(password, {details: true});   
}

export {hashPassword, comparePassword, adheresToPasswordPolicy};