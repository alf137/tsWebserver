import { Request, Response, NextFunction} from "express";
import { config } from '../config.js';
import { NotFoundError } from "./errors/notFound.js";
import { ForbiddenError } from "./errors/forbidden.js";
import { UnauthorizedError } from "./errors/unautherized.js";
import { BadRequestError } from "./errors/badReq.js";
import { respondWithError } from "./json.js";

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    config.fileServerHits += 1
    next()
}

type Handler = (req: Request, res: Response) => void;

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof NotFoundError) {
    respondWithError(res, 404, err.message)
  } else if (err instanceof ForbiddenError) {
    respondWithError(res, 403, err.message)
  } else if (err instanceof UnauthorizedError) {
    respondWithError(res, 401, err.message)
  } else if (err instanceof BadRequestError) {
    respondWithError(res, 400, err.message)
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  };
}

export function asyncError(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
    return function (req: Request, res: Response, next: NextFunction) {
        return Promise.resolve(fn(req, res, next)).catch(next);
    }
}
