
import { createHash } from "crypto";
import { NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
const COOKIE_NAME = "personal_session";

export async function getPersonalKeySession(
  request: NextRequest
): Promise<{ personalKeyId: string } | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const tokenHash = createHash("sha256")
    .update(token)
    .digest("hex");

  const result = await sql`
    SELECT personal_key_id
    FROM personal_sessions
    WHERE token_hash = ${tokenHash}
      AND expires_at > NOW()
    LIMIT 1
  `;

  if (result.length === 0) return null;

  // ต่ออายุ Session เมื่อมีการใช้งาน
  await sql`
    UPDATE personal_sessions
    SET
      last_used_at = NOW(),
      expires_at = NOW() + INTERVAL '30 days'
    WHERE token_hash = ${tokenHash}
  `;

  return {
    personalKeyId: result[0].personal_key_id,
  };
}
