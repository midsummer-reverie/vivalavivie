//drafts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getPersonalKeySession } from "@/lib/personal-session";

const sql = neon(process.env.DATABASE_URL!);

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isSameOrigin(request: NextRequest) {
  return request.headers.get("origin") === request.nextUrl.origin;
}

// GET: โหลด Draft ของเจ้าของ
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getPersonalKeySession(request);

    if (!session) {
      return NextResponse.json(
        { error: "กรุณาเชื่อมต่อ Personal Key ก่อน" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const result = await sql`
      SELECT id, name, values_json, blocks_json
      FROM cloud_drafts
      WHERE id = ${id}
        AND personal_key_id = ${session.personalKeyId}
      LIMIT 1
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "ไม่พบ Draft หรือคุณไม่มีสิทธิ์เข้าถึง" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        name: result[0].name,
        values: result[0].values_json,
        blocks: result[0].blocks_json,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error loading cloud draft:", error);

    return NextResponse.json(
      { error: "โหลด Draft ไม่สำเร็จ" },
      { status: 500 }
    );
  }
}

// PUT: แก้ไข Draft ของเจ้าของ
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
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

    const { id } = await params;
    const body = await request.json();
    const { values, blocks, name } = body;

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

    if (name !== undefined && typeof name !== "string") {
      return NextResponse.json(
        { error: "Invalid name format" },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE cloud_drafts
      SET
        values_json = ${JSON.stringify(values ?? {})}::jsonb,
        blocks_json = ${JSON.stringify(blocks ?? [])}::jsonb,
        name = ${
          typeof name === "string" && name.trim()
            ? name.trim().slice(0, 120)
            : "ไม่มีชื่อ"
        },
        updated_at = NOW()
      WHERE id = ${id}
        AND personal_key_id = ${session.personalKeyId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "ไม่พบ Draft หรือคุณไม่มีสิทธิ์แก้ไข" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating cloud draft:", error);

    return NextResponse.json(
      { error: "อัปเดต Draft ไม่สำเร็จ" },
      { status: 500 }
    );
  }
}

// DELETE: ลบ Draft ของเจ้าของ
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
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

    const { id } = await params;

    const result = await sql`
      DELETE FROM cloud_drafts
      WHERE id = ${id}
        AND personal_key_id = ${session.personalKeyId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "ไม่พบ Draft หรือคุณไม่มีสิทธิ์ลบ" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting cloud draft:", error);

    return NextResponse.json(
      { error: "ลบ Draft ไม่สำเร็จ" },
      { status: 500 }
    );
  }
}
