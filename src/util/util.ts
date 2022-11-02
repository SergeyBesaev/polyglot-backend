import crypto from 'crypto'
import jwt from "jsonwebtoken";
import {UserData} from "../entity/users/user.data";
require('dotenv').config()

const accessSecretKey: string = process.env.JWT_ACCESS_TOKEN_KEY as string
const refreshSecretKey: string  = process.env.JWT_REFRESH_TOKEN_KEY as string

export function shuffle<T>(array: T[]): T[] {
    array.sort(() => Math.random() - 0.5)
    return array
}

export function hashSha256(input: string): string {
    const sha = crypto.createHash('sha256')
    sha.update(input)
    return sha.digest('hex')
}

export function validateAccessToken(token: string) {
    return jwt.verify(token, accessSecretKey) as UserData
}

export function validateRefreshToken(token: string) {
    return jwt.verify(token, refreshSecretKey) as UserData
}

