import {ValidationError} from "../errors"
import {compare} from "bcrypt"
import pool from "../config"
import { hashPassword, createJwt } from "./helpers";

export interface IUserModel {
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    validate: () => any;
}

export type validationErrorType = {
    errors: ValidationError[],
    errorName: string,
    statusCode: number,
}

class User implements IUserModel {
     username: string;
     password: string;
     confPassword: string;
     first_name: string
     last_name: string
    constructor (username: string, password: string, confPassword:string, first_name:string, last_name:string) {
        this.username = username
        this.password = password
        this.confPassword = confPassword
        this.first_name = first_name
        this.last_name = last_name
    }

    validate = async ():Promise<validationErrorType> => {
        const validationError:validationErrorType = {
            errors: [],
            errorName: 'ValidationError',
            statusCode: 400
        };
        if (!this.username) {
            const error = new ValidationError('Username is required', 'username')
            validationError.errors.push(error)
        }
        if (!this.password) {
            const error = new ValidationError('Password is required', 'password')
            validationError.errors.push(error)
        }
        if (!this.confPassword) {
            const error = new ValidationError('Confirm password is required', 'confPassword')
            validationError.errors.push(error)
        }
        const sql = 'SELECT username FROM users WHERE username = $1'
        const user = await pool.query(sql, [this.username])
        if (user.rows.length) {
            const error = new ValidationError('Username already taken try different one', 'username')
            validationError.errors.push(error)
        }
        if (this.confPassword && this.confPassword !== this.password) {
            const error = new ValidationError('Passwords are not matching', 'confPassword')
            validationError.errors.push(error)
        }
        return validationError;
    }

    save = async ():Promise<void> => {
        const sql = 'INSERT INTO users VALUES ($1, $2, $3, $4)'
        this.password = await hashPassword(this.password);
        await pool.query(sql, [this.username, this.password, this.first_name, this.last_name])
    }
}

export const authenticateUser = async (credentials:{username: string, password: string}, userPassword:string) => {
     const isMatch = await compare(credentials.password, userPassword)
     if (!isMatch) {
        return null;
     }
     const jwt = createJwt(credentials.username);
     return jwt;
}

export default User;