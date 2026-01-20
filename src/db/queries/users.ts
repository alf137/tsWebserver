import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, UserResponse, users } from "../schema.js";


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

export async function getUserByEmail(email: string): Promise<NewUser | undefined> {
    const user: NewUser[] = await db.select().from(users).where(eq(users.email, email))
    return user[0]
} 