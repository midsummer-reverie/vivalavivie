import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const codes = await sql`SELECT * FROM "Codes" ORDER BY "createdAt" DESC`;
    return NextResponse.json(codes, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      id, name, codeType, activityTags, previewUrl, htmlCode, 
      isLocked, lockPassword, isCommission, variations, customFields, blocks,
      description // 🌟 รับค่า description
    } = body;

    const newId = id || Math.floor(10000 + Math.random() * 90000).toString();
    const tags = Array.isArray(activityTags) ? activityTags : [];
    const pgTags = tags.length > 0 ? `{${tags.map((t: string) => `"${t.replace(/"/g, '\\"')}"`).join(',')}}` : "{}";

    const newCode = await sql`
      INSERT INTO "Codes" (
        id, name, "codeType", "activityTags", "previewUrl", "htmlCode", 
        "isLocked", "lockPassword", "isCommission", variations, "customFields", blocks, description, "createdAt", "updatedAt"
      )
      VALUES (
        ${newId}, ${name}, ${codeType}, ${pgTags}::text[], ${previewUrl}, ${htmlCode},
        ${isLocked || false}, ${lockPassword || ''}, ${isCommission || false}, ${variations || '[]'}, ${customFields || '[]'}, ${blocks || '[]'}, ${description || ''}, NOW(), NOW()
      )
      RETURNING *
    `;
    return NextResponse.json(newCode[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      id, name, codeType, activityTags, previewUrl, htmlCode, 
      isLocked, lockPassword, isCommission, variations, customFields, blocks,
      description // 🌟 รับค่า description
    } = body;

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const tags = Array.isArray(activityTags) ? activityTags : [];
    const pgTags = tags.length > 0 ? `{${tags.map((t: string) => `"${t.replace(/"/g, '\\"')}"`).join(',')}}` : "{}";

    const updatedCode = await sql`
      UPDATE "Codes"
      SET 
        name = ${name}, "codeType" = ${codeType}, "activityTags" = ${pgTags}::text[], 
        "previewUrl" = ${previewUrl}, "htmlCode" = ${htmlCode}, 
        "isLocked" = ${isLocked || false}, "lockPassword" = ${lockPassword || ''}, "isCommission" = ${isCommission || false},
        variations = ${variations}, "customFields" = ${customFields || '[]'}, blocks = ${blocks || '[]'}, 
        description = ${description || ''}, "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json(updatedCode[0], { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}