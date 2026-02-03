import type { Request, Response } from "express";
import { respondWithJSON } from "../json.js";
import { getUserById, upgradeUserToRed } from "../../db/queries/users.js";
import { NotFoundError } from "../errors/notFound.js";


export async function handlerUpgradeUserRed(req: Request, res: Response){
    type parameters = {
        event: string;
        data: {
            userId: string;
        };
    };

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