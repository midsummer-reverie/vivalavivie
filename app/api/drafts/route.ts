//api/drafts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { randomBytes } from "crypto";
import { getPersonalKeySession } from "@/lib/personal-session";

const sql = neon(process.env.DATABASE_URL!);

function isSameOrigin(request: NextRequest) {
  return request.headers.get("origin") === request.nextUrl.origin;
}

// GET: แสดง Cloud Drafts ของเจ้าของเท่านั้น
export async function GET(request: NextRequest) {
  try {
    const session = await getPersonalKeySession(request);

    if (!session) {
      return NextResponse.json(
        { error: "กรุณาเชื่อมต่อ Personal Key ก่อน" },
        { status: 401 }
      );
    }

    const includeContent = request.nextUrl.searchParams.get("includeContent") === "1";
    const drafts = includeContent ? await sql`
      SELECT
        id,
        code_id,
        name,
        values_json,
        blocks_json,
        created_at,
        updated_at
      FROM cloud_drafts
      WHERE personal_key_id = ${session.personalKeyId}
      ORDER BY created_at DESC
    ` : await sql`
      SELECT
        id,
        code_id,
        name,
        created_at,
        updated_at
      FROM cloud_drafts
      WHERE personal_key_id = ${session.personalKeyId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json(
      { drafts },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, private" },
      }
    );
  } catch (error) {
    console.error("Error loading cloud drafts:", error);

    return NextResponse.json(
      { error: "โหลดรายการ Cloud Drafts ไม่สำเร็จ" },
      { status: 500 }
    );
  }
}

// POST: สร้าง Cloud Draft ใหม่
export async function POST(request: NextRequest) {

    if (!isSameOrigin(request)) {
    return NextResponse.json(
        { error: "Invalid request origin" },
        { status: 403 }
      );
    }
  try {
    const session = await getPersonalKeySession(request);

    if (!session) {
      return NextResponse.json(
        { error: "กรุณาเชื่อมต่อ Personal Key ก่อน" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { codeId, values, blocks, name } = body;

    if (typeof codeId !== "string" || !codeId.trim()) {
      return NextResponse.json(
        { error: "Missing codeId" },
        { status: 400 }
      );
    }

    if (
      values !== undefined &&
      (values === null || typeof values !== "object" || Array.isArray(values))
    ) {
      return NextResponse.json(
        { error: "Invalid values format" },
        { status: 400 }
      );
    }

    if (blocks !== undefined && !Array.isArray(blocks)) {
      return NextResponse.json(
        { error: "Invalid blocks format" },
        { status: 400 }
      );
    }

    const draftName =
      typeof name === "string" && name.trim()
        ? name.trim().slice(0, 120)
        : "ไม่มีชื่อ";

    const draftId = randomBytes(10).toString("hex");

    await sql`
      INSERT INTO cloud_drafts (
        id,
        code_id,
        name,
        values_json,
        blocks_json,
        personal_key_id,
        created_at,
        updated_at
      )
      VALUES (
        ${draftId},
        ${codeId.trim()},
        ${draftName},
        ${JSON.stringify(values ?? {})}::jsonb,
        ${JSON.stringify(blocks ?? [])}::jsonb,
        ${session.personalKeyId},
        NOW(),
        NOW()
      )
    `;

    return NextResponse.json(
      { draftId, name: draftName },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving cloud draft:", error);

    return NextResponse.json(
      { error: "บันทึก Cloud Draft ไม่สำเร็จ" },
      { status: 500 }
    );
  }
}
