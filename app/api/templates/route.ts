import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

// เชื่อมต่อ Database ผ่าน Connection String ในไฟล์ .env
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 🟢 GET: ดึงข้อมูลเทมเพลตทั้งหมดไปโชว์หน้า Gallery
export async function GET() {
  try {
    // ใช้ AS เปลี่ยนชื่อคอลัมน์แบบงู (snake_case) ให้กลายเป็นอูฐ (camelCase) เพื่อให้ตรงกับ State หน้าบ้าน
    const result = await pool.query(`
      SELECT 
        id, name, category, tags, event_tags AS "eventTags", 
        preview_url AS "previewUrl", html_code AS "htmlCode", 
        css_code AS "cssCode", description, is_locked AS "isLocked", 
        lock_password AS "lockPassword", variations, 
        custom_fields AS "customFields", blocks 
      FROM templates 
      ORDER BY created_at DESC
    `);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET Templates Error:", error);
    return NextResponse.json({ error: 'ดึงข้อมูลไม่สำเร็จ' }, { status: 500 });
  }
}

// 🟡 POST: สร้างเทมเพลตใหม่
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const query = `
      INSERT INTO templates (
        id, name, category, tags, event_tags, preview_url, 
        html_code, css_code, description, is_locked, lock_password, 
        variations, custom_fields, blocks
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      body.id, 
      body.name, 
      body.category, 
      body.tags || [], 
      body.eventTags || [], 
      body.previewUrl || "", 
      body.htmlCode || "", 
      body.cssCode || "", 
      body.description || "", 
      body.isLocked || false, 
      body.lockPassword || "", 
      body.variations || "[]", 
      body.customFields || "[]", 
      body.blocks || "[]"
    ];

    const result = await pool.query(query, values);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("POST Template Error:", error);
    return NextResponse.json({ error: 'บันทึกข้อมูลไม่สำเร็จ' }, { status: 500 });
  }
}

// 🟠 PUT: อัปเดตข้อมูลเทมเพลตเดิม
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.id) {
      return NextResponse.json({ error: 'ไม่พบ ID ของเทมเพลต' }, { status: 400 });
    }

    const query = `
      UPDATE templates SET 
        name = $1, category = $2, tags = $3, event_tags = $4, 
        preview_url = $5, html_code = $6, css_code = $7, 
        description = $8, is_locked = $9, lock_password = $10, 
        variations = $11, custom_fields = $12, blocks = $13
      WHERE id = $14
      RETURNING *
    `;

    const values = [
      body.name, 
      body.category, 
      body.tags || [], 
      body.eventTags || [], 
      body.previewUrl || "", 
      body.htmlCode || "", 
      body.cssCode || "", 
      body.description || "", 
      body.isLocked || false, 
      body.lockPassword || "", 
      body.variations || "[]", 
      body.customFields || "[]", 
      body.blocks || "[]",
      body.id // ตัวแปรที่ 14 คือ ID สำหรับเช็ก WHERE
    ];

    const result = await pool.query(query, values);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("PUT Template Error:", error);
    return NextResponse.json({ error: 'อัปเดตข้อมูลไม่สำเร็จ' }, { status: 500 });
  }
}