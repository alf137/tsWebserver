import { createChirp, deleteChirpById, getChirps, getSingleChirp } from "../db/queries/chirps.js";
import { BadRequestError } from "./errors/badReq.js";
import type { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { NotFoundError } from "./errors/notFound.js";
import { ForbiddenError } from "./errors/forbidden.js";



export async function handlerChirpsCreate(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  const token = getBearerToken(req);
  const userId = validateJWT(token, config.jwt.secret);

  const cleaned = validateChirp(params.body);
  const chirp = await createChirp({ body: cleaned, userId: userId });

  respondWithJSON(res, 201, chirp);
}

function validateChirp(body: string) {
  const maxChirpLength = 140;
  if (body.length > maxChirpLength) {
    throw new BadRequestError(
      `Chirp is too long. Max length is ${maxChirpLength}`,
    );
  }

  const badWords = ["kerfuffle", "sharbert", "fornax"];
  return getCleanedBody(body, badWords);
}

function getCleanedBody(body: string, badWords: string[]) {
  const words = body.split(" ");

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const loweredWord = word.toLowerCase();
    if (badWords.includes(loweredWord)) {
      words[i] = "****";
    }
  }

  const cleaned = words.join(" ");
  return cleaned;
}

export async function handlerChirpsRetrieve(_: Request, res: Response) {
  const chirps = await getChirps();
  respondWithJSON(res, 200, chirps);
}

export async function handlerChirpsGet(req: Request, res: Response) {
  let { chirpId } = req.params;

  if (Array.isArray(chirpId)) {
    chirpId = chirpId[0]
  }
  const chirp = await getSingleChirp(chirpId);
  console.log(chirp)

  if (!chirp) {
    throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`);
  }

  respondWithJSON(res, 200, chirp);
}

export async function handlerDeleteChirp(req: Request, res: Response) {

  let { chirpId } = req.params;

  if (Array.isArray(chirpId)) {
    chirpId = chirpId[0]
  }
  const token = getBearerToken(req)
  const userId = validateJWT(token, config.jwt.secret)
  const chirp = await getSingleChirp(chirpId)
  console.log(chirp)
  if (!chirp) {
    throw new NotFoundError("chirp was not found")
  }
  if (userId !== chirp.userId){
    throw new ForbiddenError("user is not allowed to delete foreign chirp")
  }
  
  await deleteChirpById(chirpId)
  respondWithJSON(res,204, `Deletion of chirp successful`)
}