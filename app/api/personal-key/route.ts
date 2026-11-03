
import { neon } from "@neondatabase/serverless";
import {
  createHash,
  createHmac,
  randomBytes,
  randomUUID,
} from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getPersonalKeySession } from "@/lib/personal-session";

const sql = neon(process.env.DATABASE_URL!);

const COOKIE_NAME = "personal_session";
const SESSION_DAYS = 30;
const RATE_LIMIT = 5;
const RATE_WINDOW_MINUTES = 15;

function getPepper() {
  const pepper = process.env.PERSONAL_KEY_PEPPER;

  if (!pepper || Buffer.byteLength(pepper, "utf8") < 32) {
    throw new Error("PERSONAL_KEY_PEPPER is missing or too short");
  }

  return pepper;
}

function hashPersonalKey(key: string) {
  return createHmac("sha256", getPepper())
    .update(key, "utf8")
    .digest("hex");
}

function isValidNewPersonalKey(key: string) {
  return key.length >= 8 && key.length <= 128 && /^[\x21-\x7E]+$/.test(key) && key === key.toLowerCase();
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function hashIp(ip: string) {
  return createHmac("sha256", getPepper())
    .update(`ip:${ip}`, "utf8")
    .digest("hex");
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim();

  return ip || request.headers.get("x-real-ip") || "unknown";
}

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");

  return origin === request.nextUrl.origin;
}

function createSessionToken() {
  return randomBytes(32).toString("hex");
}

function setSessionCookie(
  response: NextResponse,
  token: string
) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

function getHashedClientIp(request: NextRequest) {
  const ip = getClientIp(request);
  return hashIp(ip);
}

async function checkRateLimit(request: NextRequest) {
  // Keep local development usable; production still enforces the IP limit.
  if (process.env.NODE_ENV !== "production") {
    return { allowed: true, retryAfter: 0 };
  }

  const ipHash = getHashedClientIp(request);

  const result = await sql`
    SELECT COUNT(*) AS attempts, MIN(attempted_at) AS oldest_attempt
    FROM personal_key_attempts
    WHERE ip_hash = ${ipHash}
      AND attempted_at > NOW() - INTERVAL '15 minutes'
  `;

  const attempts = Number(result[0].attempts);
  const oldestAttempt = result[0].oldest_attempt
    ? new Date(result[0].oldest_attempt).getTime()
    : Date.now();
  const retryAfter = Math.max(1, Math.ceil((oldestAttempt + RATE_WINDOW_MINUTES * 60 * 1000 - Date.now()) / 1000));

  return { allowed: attempts < RATE_LIMIT, retryAfter };
}

async function recordRateLimitAttempt(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") return;

  const ipHash = getHashedClientIp(request);
  await sql`
    DELETE FROM personal_key_attempts
    WHERE ip_hash = ${ipHash}
      AND attempted_at < NOW() - INTERVAL '1 day'
  `;
  await sql`
    INSERT INTO personal_key_attempts (ip_hash)
    VALUES (${ipHash})
  `;
}

async function createSession(personalKeyId: string) {
  const token = createSessionToken();
  const tokenHash = hashToken(token);

  await sql`
    INSERT INTO personal_sessions (
      id,
      personal_key_id,
      token_hash,
      expires_at
    )
    VALUES (
      ${randomUUID().replace(/-/g, "")},
      ${personalKeyId},
      ${tokenHash},
      NOW() + INTERVAL '30 days'
    )
  `;

  return token;
}

// POST: Register or Connect
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { error: "Invalid request origin" },
      { status: 403 }
    );
  }

  try {
    const rateLimit = await checkRateLimit(request);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many attempts. Please try again later.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfter) },
        }
      );
    }

    const body = await request.json();
    const action = body.action;

    if (action === "change") {
      const newKey = typeof body.newKey === "string" ? body.newKey.trim() : "";

      if (newKey.length < 8 || newKey.length > 128) {
        await recordRateLimitAttempt(request);
        return NextResponse.json(
          { error: "New Personal Key must be between 8 and 128 characters." },
          { status: 400 }
        );
      }

      if (!isValidNewPersonalKey(newKey)) {
        return NextResponse.json(
          { error: "New Personal Key must use lowercase English letters, numbers, or symbols only." },
          { status: 400 }
        );
      }

      const session = await getPersonalKeySession(request);
      if (!session) {
        return NextResponse.json(
          { error: "Please reconnect your Personal Key before changing it." },
          { status: 401 }
        );
      }

      const newKeyHash = hashPersonalKey(newKey);
      const personalKeyId = session.personalKeyId;
      const duplicate = await sql`
        SELECT id
        FROM personal_keys
        WHERE key_hash = ${newKeyHash}
          AND id <> ${personalKeyId}
        LIMIT 1
      `;

      if (duplicate.length > 0) {
        return NextResponse.json(
          { error: "This new Personal Key is already registered." },
          { status: 409 }
        );
      }

      await recordRateLimitAttempt(request);

      const updated = await sql`
        WITH updated_key AS (
          UPDATE personal_keys
          SET key_hash = ${newKeyHash}, name = ${newKey}
          WHERE id = ${personalKeyId}
            AND key_hash <> ${newKeyHash}
          RETURNING id
        ), revoked_sessions AS (
          DELETE FROM personal_sessions
          WHERE personal_key_id IN (SELECT id FROM updated_key)
          RETURNING id
        )
        SELECT id FROM updated_key
      `;

      if (updated.length === 0) {
        return NextResponse.json(
          { error: "Personal Key changed before this request completed. Please reconnect and try again." },
          { status: 409 }
        );
      }

      const token = await createSession(personalKeyId);
      const response = NextResponse.json({
        success: true,
        connected: true,
        message: "Personal Key changed. Other devices must reconnect with the new key.",
      });
      setSessionCookie(response, token);
      return response;
    }

    const key =
      typeof body.key === "string" ? body.key.trim() : "";

    if (action !== "register" && action !== "connect") {
      await recordRateLimitAttempt(request);
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    if (key.length < 8 || key.length > 128 || (action === "register" && !isValidNewPersonalKey(key))) {
      await recordRateLimitAttempt(request);
      return NextResponse.json(
        {
          error: action === "register"
            ? "Personal Key must be 8 to 128 characters and use lowercase English letters, numbers, or symbols only."
            : "Personal Key must be between 8 and 128 characters.",
        },
        { status: 400 }
      );
    }

    const keyHash = hashPersonalKey(key);

    let personalKeyId: string;

    if (action === "register") {
      await recordRateLimitAttempt(request);
      personalKeyId = randomUUID().replace(/-/g, "");

      const inserted = await sql`
        INSERT INTO personal_keys (id, key_hash, name)
        VALUES (${personalKeyId}, ${keyHash}, ${key})
        ON CONFLICT (key_hash) DO NOTHING
        RETURNING id
      `;

      if (inserted.length === 0) {
        return NextResponse.json(
          {
            error: "This Personal Key is already registered.",
          },
          { status: 409 }
        );
      }
    } else {
      const existing = await sql`
        SELECT id
        FROM personal_keys
        WHERE key_hash = ${keyHash}
        LIMIT 1
      `;

      if (existing.length === 0) {
        await recordRateLimitAttempt(request);
        return NextResponse.json(
          { error: "Personal Key not found." },
          { status: 404 }
        );
      }

      personalKeyId = existing[0].id;
    }

    let token: string;

    try {
      token = await createSession(personalKeyId);
    } catch (error) {
      if (action === "register") {
        await sql`
          DELETE FROM personal_keys
          WHERE id = ${personalKeyId}
        `.catch(() => []);
      }

      throw error;
    }

    const response = NextResponse.json({
      success: true,
      connected: true,
      message:
        action === "register"
          ? "Personal Key created successfully."
          : "Connected successfully.",
    });

    setSessionCookie(response, token);

    return response;
  } catch (error) {
    console.error("Personal Key POST error:", error);

    return NextResponse.json(
      { error: "Unable to process Personal Key request." },
      { status: 500 }
    );
  }
}

// GET: Check current session
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({
        connected: false,
      });
    }

    const tokenHash = hashToken(token);

    const sessions = await sql`
      SELECT
        personal_sessions.id,
        personal_sessions.personal_key_id
      FROM personal_sessions
      INNER JOIN personal_keys
        ON personal_keys.id = personal_sessions.personal_key_id
      WHERE personal_sessions.token_hash = ${tokenHash}
        AND personal_sessions.expires_at > NOW()
      LIMIT 1
    `;

    if (sessions.length === 0) {
      const response = NextResponse.json({
        connected: false,
      });

      clearSessionCookie(response);

      return response;
    }

    await sql`
      UPDATE personal_sessions
      SET
        last_used_at = NOW(),
        expires_at = NOW() + INTERVAL '30 days'
      WHERE id = ${sessions[0].id}
    `;

    return NextResponse.json({
      connected: true,
    });
  } catch (error) {
    console.error("Personal Key GET error:", error);

    return NextResponse.json(
      { error: "Unable to check session." },
      { status: 500 }
    );
  }
}

// DELETE: Disconnect current device
export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { error: "Invalid request origin" },
      { status: 403 }
    );
  }

  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (token) {
      const tokenHash = hashToken(token);

      await sql`
        DELETE FROM personal_sessions
        WHERE token_hash = ${tokenHash}
      `;
    }

    const response = NextResponse.json({
      success: true,
      connected: false,
      message: "Disconnected successfully.",
    });

    clearSessionCookie(response);

    return response;
  } catch (error) {
    console.error("Personal Key DELETE error:", error);

    return NextResponse.json(
      { error: "Unable to disconnect." },
      { status: 500 }
    );
  }
}
