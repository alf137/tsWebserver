import * as argon2 from "argon2";

export async function hashPassword(password: string): Promise<string>{
    const hashed: string = await argon2.hash(password)
    return hashed
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    const isValid: boolean = await argon2.verify(hash, password)
    return isValid
}