import { createChirp, getChirps, getSingleChirp } from "../db/queries/chirps.js";
import { BadRequestError } from "./errors/badReq.js";
import type { NextFunction, Request, Response } from "express";
import { Chirp } from "../db/schema";
import { respondWithError, respondWithJSON } from "./json.js";

type Parameters = {
    body: string;
    userId: string;
    chirpID: string;  };

export async function handlerChirp(req: Request, res: Response, next: NextFunction){
    const params: Parameters = req.body;

    const validChirp: string = chirpValidate(params.body);
    const chirp: Chirp = await createChirp({
        body: validChirp,
        userId: params.userId
    });
    respondWithJSON(res,201,chirp)
}

export async function handlerChirpsRetrieve(_: Request, res: Response) {
    const chirps = await getChirps();
    respondWithJSON(res, 200, chirps);
}
function chirpValidate(chirp: string): string {
  const maxChirpLength = 140;
  if (chirp.length > maxChirpLength) {
    throw new BadRequestError("Chirp is too long. Max length is 140")
  }

  const words = chirp.split(" ");

  const badWords = ["kerfuffle", "sharbert", "fornax"];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const loweredWord = word.toLowerCase();
    if (badWords.includes(loweredWord)) {
      words[i] = "****";
    }
  }

  const cleaned: string = words.join(" ");

  return cleaned
}

export async function handlerSingleChirp(req: Request, res: Response, next: NextFunction){
  const chirpId: string = req.params.chirpID
  const chirp = await getSingleChirp(chirpId)
  if (!chirp) {
    respondWithError(res, 404, "id not found")
    return
  }
  respondWithJSON(res, 200, chirp)
}