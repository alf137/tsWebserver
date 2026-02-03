import type { Request, Response } from "express";

import { changePasswordEmail, createUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors/badReq.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { User } from "../db/schema.js";

export async function handlerUsersCreate(req: Request, res: Response) {
  type parameters = {
    password: string;
    email: string;
  };
  const params: parameters = req.body;

  if (!params.email) {
    throw new BadRequestError("Missing required fields");
  }
  if (!params.password) {
    throw new BadRequestError("Missing Password")
  }

  const hash: string =  await hashPassword(params.password)
  const user = await createUser({ email: params.email, hashedPassword: hash });
  
  if (!user) {
    throw new BadRequestError("Could not create user");
  }

  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isChirpyRed: user.isChirpyRed
  });
}

// put method for updating own password and email

export async function handlerUpdateEmailPassword(req: Request, res: Response){
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }
  const token = getBearerToken(req)
  const userId = validateJWT(token, config.jwt.secret)
  const hashed = await hashPassword(password)
  
  const user: User = await changePasswordEmail(userId, email, hashed)
  const {hashedPassword, ...userWithoutPassword} = user
  respondWithJSON(res,200,userWithoutPassword)
}