import { randomBytes } from "crypto";
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { getPersonalKeySession } from "@/lib/personal-session";

const sql = neon(process.env.DATABASE_URL!);
const MAX_TEMPLATES_PER_FIELD = 100;
const MAX_TEMPLATE_CONTENT_LENGTH = 50_000;

function isSameOrigin(request: NextRequest) {
  return request.headers.get("origin") === request.nextUrl.origin;
}

async function ownsDraft(personalKeyId: string, draftId: string, codeId: string) {
  const drafts = await sql`
    SELECT id
    FROM cloud_drafts
    WHERE id = ${draftId}
      AND personal_key_id = ${personalKeyId}
      AND code_id = ${codeId}
    LIMIT 1
  `;
  return drafts.length > 0;
}

export async function GET(request: NextRequest) {
  try {
    const codeId = request.nextUrl.searchParams.get("codeId")?.trim() ?? "";
    const fieldKey = request.nextUrl.searchParams.get("fieldKey")?.trim() ?? "";
    const draftId = request.nextUrl.searchParams.get("draftId")?.trim() ?? "";
    if (!codeId || codeId.length > 200 || !fieldKey || fieldKey.length > 500 || !draftId || draftId.length > 200) {
      return NextResponse.json({ error: "ต้องเลือก Cloud Draft และระบุช่องข้อความ" }, { status: 400 });
    }

    const session = await getPersonalKeySession(request);
    if (!session) {
      return NextResponse.json({ error: "กรุณาเชื่อมต่อ Personal Key ก่อน" }, { status: 401 });
    }
    if (!await ownsDraft(session.personalKeyId, draftId, codeId)) {
      return NextResponse.json({ error: "ไม่พบ Cloud Draft หรือคุณไม่มีสิทธิ์เข้าถึง" }, { status: 404 });
    }

    const templates = await sql`
      SELECT id, name, content, created_at, updated_at
      FROM personal_text_templates
      WHERE personal_key_id = ${session.personalKeyId}
        AND code_id = ${codeId}
        AND draft_id = ${draftId}
        AND field_key = ${fieldKey}
      ORDER BY updated_at DESC
    `;

    return NextResponse.json(
      { templates },
      { headers: { "Cache-Control": "no-store, private" } }
    );
  } catch (error) {
    console.error("Error loading Personal Key text templates:", error);
    return NextResponse.json({ error: "โหลดเทมเพลตข้อความไม่สำเร็จ" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  try {
    const session = await getPersonalKeySession(request);
    if (!session) {
      return NextResponse.json({ error: "กรุณาเชื่อมต่อ Personal Key ก่อน" }, { status: 401 });
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const content = typeof body.content === "string" ? body.content : null;
    const codeId = typeof body.codeId === "string" ? body.codeId.trim() : "";
    const fieldKey = typeof body.fieldKey === "string" ? body.fieldKey.trim() : "";
    const draftId = typeof body.draftId === "string" ? body.draftId.trim() : "";

    if (!name || name.length > 100) {
      return NextResponse.json({ error: "ชื่อเทมเพลตต้องมี 1–100 ตัวอักษร" }, { status: 400 });
    }
    if (!codeId || codeId.length > 200 || !fieldKey || fieldKey.length > 500 || !draftId || draftId.length > 200) {
      return NextResponse.json({ error: "ต้องเลือก Cloud Draft และระบุช่องข้อความ" }, { status: 400 });
    }
    if (content === null || !content.trim() || content.length > MAX_TEMPLATE_CONTENT_LENGTH) {
      return NextResponse.json({ error: "เนื้อหาเทมเพลตต้องมีข้อความ และไม่เกิน 50,000 ตัวอักษร" }, { status: 400 });
    }

    if (!await ownsDraft(session.personalKeyId, draftId, codeId)) {
      return NextResponse.json({ error: "ไม่พบ Cloud Draft หรือคุณไม่มีสิทธิ์เข้าถึง" }, { status: 404 });
    }

    const countResult = await sql`
      SELECT COUNT(*) AS total
      FROM personal_text_templates
      WHERE personal_key_id = ${session.personalKeyId}
        AND code_id = ${codeId}
        AND draft_id = ${draftId}
        AND field_key = ${fieldKey}
    `;
    if (Number(countResult[0]?.total ?? 0) >= MAX_TEMPLATES_PER_FIELD) {
      return NextResponse.json({ error: "บันทึกเทมเพลตได้สูงสุด 100 รายการต่อช่อง" }, { status: 409 });
    }

    const id = randomBytes(12).toString("hex");
    await sql`
      INSERT INTO personal_text_templates (id, personal_key_id, draft_id, code_id, field_key, name, content)
      VALUES (${id}, ${session.personalKeyId}, ${draftId}, ${codeId}, ${fieldKey}, ${name}, ${content})
    `;

    return NextResponse.json({ id, name, content, draftId, codeId, fieldKey }, { status: 201 });
  } catch (error) {
    console.error("Error saving Personal Key text template:", error);
    return NextResponse.json({ error: "บันทึกเทมเพลตข้อความไม่สำเร็จ" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  try {
    const session = await getPersonalKeySession(request);
    if (!session) {
      return NextResponse.json({ error: "กรุณาเชื่อมต่อ Personal Key ก่อน" }, { status: 401 });
    }

    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";
    const codeId = typeof body.codeId === "string" ? body.codeId.trim() : "";
    const fieldKey = typeof body.fieldKey === "string" ? body.fieldKey.trim() : "";
    const draftId = typeof body.draftId === "string" ? body.draftId.trim() : "";
    if (!id) return NextResponse.json({ error: "Missing template id" }, { status: 400 });
    if (!codeId || !fieldKey || !draftId) return NextResponse.json({ error: "ต้องเลือก Cloud Draft และระบุช่องข้อความ" }, { status: 400 });

    const deleted = await sql`
      DELETE FROM personal_text_templates
      WHERE id = ${id}
        AND personal_key_id = ${session.personalKeyId}
        AND code_id = ${codeId}
        AND draft_id = ${draftId}
        AND field_key = ${fieldKey}
      RETURNING id
    `;

    if (deleted.length === 0) {
      return NextResponse.json({ error: "ไม่พบเทมเพลตนี้" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting Personal Key text template:", error);
    return NextResponse.json({ error: "ลบเทมเพลตข้อความไม่สำเร็จ" }, { status: 500 });
  }
}
