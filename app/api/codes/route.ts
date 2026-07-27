import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    // 🌟 แก้ชื่อตารางเป็น "Code" (มีฟันหนูครอบ)
    const codes = await sql`SELECT * FROM "Codes" ORDER BY "createdAt" DESC`;
    return NextResponse.json(codes);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const sql = neon(process.env.DATABASE_URL!);
    
    // 🌟 แก้ชื่อตารางเป็น "Code"
    const result = await sql`
      INSERT INTO "Codes" (
        id, name, "codeType", "activityTags", "eventTags", "previewUrl", "htmlCode", 
        description, "isLocked", "lockPassword", "isCommission", 
        variations, "customFields", blocks
      ) VALUES (
        ${data.id}, ${data.name}, ${data.codeType}, ${data.activityTags}, ${data.eventTags || []}, 
        ${data.previewUrl}, ${data.htmlCode}, ${data.description}, ${data.isLocked}, 
        ${data.lockPassword}, ${data.isCommission}, ${data.variations}, 
        ${data.customFields}, ${data.blocks}
      ) RETURNING *
    `;
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const sql = neon(process.env.DATABASE_URL!);
    
    // 🌟 แก้ชื่อตารางเป็น "Code"
    const result = await sql`
      UPDATE "Codes" SET
        name = ${data.name},
        "codeType" = ${data.codeType},
        "activityTags" = ${data.activityTags},
        "eventTags" = ${data.eventTags || []},
        "previewUrl" = ${data.previewUrl},
        "htmlCode" = ${data.htmlCode},
        description = ${data.description},
        "isLocked" = ${data.isLocked},
        "lockPassword" = ${data.lockPassword},
        "isCommission" = ${data.isCommission},
        variations = ${data.variations},
        "customFields" = ${data.customFields},
        blocks = ${data.blocks}
      WHERE id = ${data.id}
      RETURNING *
    `;

    if (result.length === 0) return NextResponse.json({ error: 'ไม่พบโค้ดที่ต้องการอัปเดต' }, { status: 404 });
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' }, { status: 500 });
  }
}