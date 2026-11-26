import { sql } from "@/lib/meetings-db";

export interface DbUser {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
}

export async function getUserByEmail(email: string): Promise<DbUser | null> {
    const rows = await sql`
    SELECT id, name, email, password_hash AS "passwordHash"
    FROM users WHERE email = ${email}
    `;
    return (rows[0] as DbUser | undefined) ?? null;
}