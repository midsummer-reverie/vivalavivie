
import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { createHash, randomBytes } from "crypto";
import { getPersonalKeySession } from "@/lib/personal-session";

const sql = neon(process.env.DATABASE_URL!);

type RouteContext = {
  params: Promise<{ id: string }>;
};

function hashToken(token: string) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

function isSameOrigin(request: NextRequest) {
  return request.headers.get("origin") === request.nextUrl.origin;
}

// POST: สร้างหรือเปลี่ยน Share Link
export async function POST(
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

    const draft = await sql`
      SELECT id, code_id
      FROM cloud_drafts
      WHERE id = ${id}
        AND personal_key_id = ${session.personalKeyId}
      LIMIT 1
    `;

    if (draft.length === 0) {
      return NextResponse.json(
        { error: "ไม่พบ Draft หรือคุณไม่มีสิทธิ์" },
        { status: 404 }
      );
    }

    // สุ่ม Token ใหม่ทุกครั้งที่สร้างหรือ Regenerate
    const shareToken = randomBytes(32).toString("hex");
    const tokenHash = hashToken(shareToken);

    await sql`
      UPDATE cloud_drafts
      SET
        share_token_hash = ${tokenHash},
        updated_at = NOW()
      WHERE id = ${id}
        AND personal_key_id = ${session.personalKeyId}
    `;

    const shareUrl =
      `${request.nextUrl.origin}/codes/` +
      `${encodeURIComponent(draft[0].code_id)}` +
      `?share=${shareToken}`;

    return NextResponse.json({
      success: true,
      shareUrl,
      message: "Share Link created successfully.",
    });
  } catch (error) {
    console.error("Create share link error:", error);

    return NextResponse.json(
      { error: "สร้าง Share Link ไม่สำเร็จ" },
      { status: 500 }
    );
  }
}

// DELETE: ยกเลิก Share Link
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
      UPDATE cloud_drafts
      SET
        share_token_hash = NULL,
        updated_at = NOW()
      WHERE id = ${id}
        AND personal_key_id = ${session.personalKeyId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "ไม่พบ Draft หรือคุณไม่มีสิทธิ์" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Share Link revoked successfully.",
    });
  } catch (error) {
    console.error("Revoke share link error:", error);

    return NextResponse.json(
      { error: "ยกเลิก Share Link ไม่สำเร็จ" },
      { status: 500 }
    );
  }
}
