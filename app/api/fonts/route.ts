import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// ดึงรายการฟอนต์ทั้งหมดที่เคยบันทึกไว้
export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const fonts = await sql`SELECT * FROM "Fonts" ORDER BY "id" ASC`;
    return NextResponse.json(fonts);
  } catch (error) {
    console.error("GET Fonts Error:", error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลฟอนต์' }, { status: 500 });
  }
}

// บันทึกฟอนต์ใหม่ลง Database
export async function POST(request: Request) {
  try {
    const { name, url, family } = await request.json();
    const sql = neon(process.env.DATABASE_URL!);
    
    const result = await sql`
      INSERT INTO "Fonts" (name, url, family)
      VALUES (${name}, ${url}, ${family})
      RETURNING *
    `;
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("POST Font Error:", error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการบันทึกฟอนต์' }, { status: 500 });
  }
}