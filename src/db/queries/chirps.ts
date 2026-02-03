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

export async function getSingleChirp(id: string) {
  const rows = await db.select().from(chirps).where(eq(chirps.id, id));
  if (rows.length === 0) {
    return;
  }
  return rows[0];
}

export async function deleteChirpById(chirpId: string){
    await db.delete(chirps).where(eq(chirps.id ,chirpId))
}

