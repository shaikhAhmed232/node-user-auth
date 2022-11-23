import {genSalt, hash} from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export const hashPassword = async (password:string, saltRounds:number=10) => {
    const salt = await genSalt(saltRounds)
    const hashedPassword = await hash(password, salt)
    return hashedPassword;
}

export const createJwt =  (username:string) => {
    return jwt.sign({username}, String(process.env.JWT_SECRET_KEY), {expiresIn: '30d'})
};