import type { Request, Response, NextFunction } from "express";
import { getBearerToken } from "src/auth";

export async function handlerRevoke(req: Request, res: Response){
    const token = getBearerToken(req)

}
