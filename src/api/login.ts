import { checkPasswordHash } from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { respondWithError, respondWithJSON } from "./json.js";
import type { Request, Response, NextFunction } from "express";

export async function handlerLogin(req: Request, res: Response, next: NextFunction){
    type Parameters = {
        password: string;
        email: string;
    };
    const body: Parameters = req.body
    const user: NewUser | undefined = await getUserByEmail(body.email)
    if (user === undefined || user.hashedPassword === undefined) {
        respondWithError(res, 401, "Incorrect email or password")
        return
    }
    const isValid = await checkPasswordHash(body.password, user.hashedPassword ) 
    if (isValid){
        respondWithJSON(res, 200, {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        })
        return
    }
    respondWithError(res, 401, "Incorrect email or password")
}
