import type { NextFunction, Request, Response } from "express";

import { respondWithJSON, respondWithError } from "./json.js";
import { BadRequestError } from "./errors/badReq.js";

export async function handlerChirpsValidate(req: Request, res: Response, next: NextFunction): Promise<void> {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    throw new BadRequestError("Chirp is too long. Max length is 140")
  }

  const words = params.body.split(" ");

  const badWords = ["kerfuffle", "sharbert", "fornax"];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const loweredWord = word.toLowerCase();
    if (badWords.includes(loweredWord)) {
      words[i] = "****";
    }
  }

  const cleaned = words.join(" ");

  respondWithJSON(res, 200, {
    cleanedBody: cleaned,
  });
}
