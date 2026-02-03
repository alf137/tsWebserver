import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "./auth";
import { UnauthorizedError } from "./api/errors/unauthorized";


describe("Password Hashing", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword456!";
    let hash1: string;
    let hash2: string;

    beforeAll(async () => {
        hash1 = await hashPassword(password1);
        hash2 = await hashPassword(password2);
    })

    it("should return true for the correct password", async () => {
        const result = await checkPasswordHash(password1, hash1);
        expect(result).toBe(true)
    })

    it("should return return not valid for wrong password", async () => {
        const result = await checkPasswordHash(password1, hash2);
        expect(result).toBe(false)
    })

    it("should return false for empty pw", async () => {
        const result = await checkPasswordHash("", hash2);
        expect(result).toBe(false)
    })
})

describe("Creating JWTs", () => {

    const secret = "secret";
    const wrongSecret = "wrong_secret";
    const userID = "some-unique-user-id";
    let validToken: string;

    beforeAll(() => {
        validToken = makeJWT(userID,3600,secret)
    })
    it("should return the userID", () =>{
        const result = validateJWT(validToken,secret)
        expect(result).toBe(userID)
    })
    it("should throw an UnautherizedError", () =>{
        expect(() => validateJWT("invalid.token.string", secret)).toThrow(
      UnauthorizedError,
    )
    })

    it("should throw an UnautherizedError for wrong Secret", () =>{
        expect(() => validateJWT(validToken, wrongSecret)).toThrow(
      UnauthorizedError,
    )
    })
    
})