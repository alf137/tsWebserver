import type { Request, Response } from "express";

import { createUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors/badReq.js";
import { hashPassword } from "../auth.js";

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
    throw new Error("Could not create user");
  }

  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}