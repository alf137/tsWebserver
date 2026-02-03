import type { Request, Response } from "express";
import { respondWithJSON } from "../json.js";
import { getUserById, upgradeUserToRed } from "../../db/queries/users.js";
import { NotFoundError } from "../errors/notFound.js";
import { getAPIKey } from "../../auth.js";
import { config } from "../../config.js";
import { UnauthorizedError } from "../errors/unauthorized.js";


export async function handlerUpgradeUserRed(req: Request, res: Response){
    type parameters = {
        event: string;
        data: {
            userId: string;
        };
    };
    const apiKey = getAPIKey(req)
    if (apiKey !== config.api.polkaKey){
        throw new UnauthorizedError("Key does not fit")
    } 
    const params: parameters = req.body
    const userId = params.data.userId
    if (params.event !== "user.upgraded"){
        respondWithJSON(res, 204, "event we do not care about")
        return
    }
    const user = getUserById(userId)
    if (!user){
        throw new NotFoundError("user can not be found")
    }
    await upgradeUserToRed(userId)
    respondWithJSON(res, 204, "")
}