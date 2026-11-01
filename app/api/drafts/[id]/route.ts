import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// 🔍 ฟังก์ชันดึงข้อมูล (Load)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const result = await sql`SELECT * FROM cloud_drafts WHERE id = ${params.id}`;
    
    if (result.length === 0) return NextResponse.json({ error: "ไม่พบดราฟต์นี้" }, { status: 404 });
    
    return NextResponse.json({ 
      name: result[0].name, 
      values: result[0].values_json, 
      blocks: result[0].blocks_json 
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ error: "โหลดดราฟต์ไม่สำเร็จ" }, { status: 500 });
  }
}

// 🔄 ฟังก์ชันอัปเดตข้อมูล (Update ทับลิงก์เดิม)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { values, blocks, name } = body;

    const sql = neon(process.env.DATABASE_URL!);
    await sql`
      UPDATE cloud_drafts 
      SET values_json = ${JSON.stringify(values || {})}, 
          blocks_json = ${JSON.stringify(blocks || [])},
          name = ${name || 'ไม่มีชื่อ'}
      WHERE id = ${params.id}
    `;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "อัปเดตดราฟต์ไม่สำเร็จ" }, { status: 500 });
  }
}