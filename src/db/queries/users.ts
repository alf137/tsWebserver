import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, UserResponse, users } from "../schema.js";
import { hashPassword } from "src/auth.js";


export async function createUser(user: NewUser) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result
}


export async function reset() {
  await db.delete(users);
}

export async function getUserByEmail(email: string) {
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result;
}

export async function changePasswordEmail(userId: string, email: string, newPasswordHashed: string) {
  const [result] = await db.update(users)
  .set({hashedPassword: newPasswordHashed, email: email})
  .where(eq(users.id, userId)).returning()
  return result
}

export async function getUserById(userId: string){
  const [result] = await db.select().from(users).where(eq(users.id,userId));
  return result;
}

export async function upgradeUserToRed(userId: string){
    await db.update(users).set({isChirpyRed: true}).where(eq(users.id, userId))
}