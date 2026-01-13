import type { Request, Response } from "express";
import { config } from "../config.js";

export function handlerReset(req: Request, res: Response) {
  config.fileServerHits = 0;
  res.send("OK");
}