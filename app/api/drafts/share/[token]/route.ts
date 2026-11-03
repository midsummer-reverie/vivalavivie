
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

type RouteContext = {
  params: Promise<{ token: string }>;
};

// GET: อ่าน Draft ผ่าน Share Token
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { token } = await params;

    // Token ต้องเป็น hexadecimal 64 ตัวอักษร
    if (!/^[a-f0-9]{64}$/i.test(token)) {
      return NextResponse.json(
        { error: "Share Link ไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const tokenHash = createHash("sha256")
      .update(token)
      .digest("hex");

    const result = await sql`
      SELECT
        id,
        code_id,
        name,
        values_json,
        blocks_json,
        created_at,
        updated_at
      FROM cloud_drafts
      WHERE share_token_hash = ${tokenHash}
      LIMIT 1
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Share Link นี้หมดอายุหรือถูกยกเลิกแล้ว" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        draft: {
          codeId: result[0].code_id,
          name: result[0].name,
          values: result[0].values_json,
          blocks: result[0].blocks_json,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, private",
          "X-Content-Type-Options": "nosniff",
          "Referrer-Policy": "no-referrer",
        },
      }
    );
  } catch (error) {
    console.error("Public share GET error:", error);

    return NextResponse.json(
      { error: "ไม่สามารถเปิด Share Link ได้" },
      { status: 500 }
    );
  }
}
