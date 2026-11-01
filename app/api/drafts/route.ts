import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { codeId, values, blocks, name } = body; // 🔧 เพิ่ม name

    if (!codeId) {
      return NextResponse.json({ error: "Missing codeId" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL!);
    const draftId = crypto.randomUUID().replace(/-/g, '').substring(0, 16); 
    const draftName = name || 'ไม่มีชื่อ';

    await sql`
      INSERT INTO cloud_drafts (id, code_id, name, values_json, blocks_json, created_at)
      VALUES (${draftId}, ${codeId}, ${draftName}, ${JSON.stringify(values || {})}, ${JSON.stringify(blocks || [])}, NOW())
    `;

    return NextResponse.json({ draftId, name: draftName }, { status: 200 });

  } catch (error) {
    console.error("Error saving cloud draft:", error);
    return NextResponse.json({ error: "บันทึกดราฟต์ไม่สำเร็จ" }, { status: 500 });
  }
}