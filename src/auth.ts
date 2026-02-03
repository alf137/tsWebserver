import * as argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "express"
import { UnauthorizedError } from "./api/errors/unauthorized.js";
import { randomBytes } from "node:crypto";
import { BadRequestError } from "./api/errors/badReq.js";

const TOKEN_ISSUER = "chirpy";

export async function hashPassword(password: string) {
  return argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string) {
  if (!password) return false;
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + expiresIn;
  const token = jwt.sign(
    {
      iss: TOKEN_ISSUER,
      sub: userID,
      iat: issuedAt,
      exp: expiresAt,
    } satisfies payload,
    secret,
    { algorithm: "HS256" },
  );

  return token;
}

export function validateJWT(tokenString: string, secret: string) {
  let decoded: payload;
  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (e) {
    throw new UnauthorizedError("Invalid token");
  }

  if (decoded.iss !== TOKEN_ISSUER) {
    throw new UnauthorizedError("Invalid issuer");
  }

  if (!decoded.sub) {
    throw new UnauthorizedError("No user ID in token");
  }

  return decoded.sub;
}

export function getBearerToken(req: Request) {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    throw new UnauthorizedError("Malformed authorization header");
  }

  return extractBearerToken(authHeader);
}

export function extractBearerToken(header: string) {
  const splitAuth = header.split(" ");
  if (splitAuth.length < 2 || splitAuth[0] !== "Bearer") {
    throw new BadRequestError("Malformed authorization header");
  }
  return splitAuth[1];
}

export function makeRefreshToken() {
  return randomBytes(32).toString("hex");
}

export function getAPIKey(req: Request){
  
  const header = req.get("Authorization")
  console.log(`HEAD of Auth ${header}`)
  if (!header){
    throw new UnauthorizedError("Missing Auth Header")
  }
  const apiKey = extractAPIKey(header)
  return apiKey
}

function extractAPIKey(header: string) {
  const splitHead: string[] = header.split(" ")
  if (splitHead[0] !== "ApiKey"){
    throw new BadRequestError("wrong format --> Authorization: ApiKey THE_KEY_HERE")
  }
  return splitHead[1]
}