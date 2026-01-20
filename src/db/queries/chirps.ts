import { asc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { Chirp, chirps } from "../schema.js";


export async function createChirp(chirp: Chirp) {
    const [result] = await db
    .insert(chirps)
    .values(chirp)
    .returning()
    return result
}

export async function getChirps() {
    const orderedChirps: Chirp[] = await db.select().from(chirps).orderBy(asc(chirps.createdAt))
    return orderedChirps
}

export async function getSingleChirp(id: string): Promise<Chirp>{
    const chirp: Chirp[] = await db.select().from(chirps).where(eq(chirps.id, id))
    return chirp[0]
}