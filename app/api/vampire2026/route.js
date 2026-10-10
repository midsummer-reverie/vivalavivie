import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

// สร้าง Pool ไว้ด้านนอกเพื่อ reuse connection ได้
const pool = new Pool({
  // เปลี่ยนเป็น VAMPIRE_URL หากคุณแยกตัวแปรใน .env
  connectionString: process.env.VAM_URL 
});

export async function GET() {
  try {
    const [
      ranksResult,
      bloodlinesResult,
      amuletsResult,
      vampiresResult
    ] = await Promise.all([
      pool.query('SELECT * FROM ranks ORDER BY rank_level ASC;'),
      pool.query('SELECT * FROM bloodlines;'),
      pool.query('SELECT * FROM amulets;'),
      pool.query('SELECT * FROM vampires ORDER BY id ASC;')
    ]);

    // จัดฟอร์แมตข้อมูลจาก .rows ให้ตรงกับที่ Frontend ของคุณคาดหวัง
    const data = {
      levels: ranksResult.rows.map(r => ({
        rank_level: String(r.rank_level),
        rank_name: r.rank_name,
        combat_abilities: r.combat_abilities,
        utility_abilities: r.utility_abilities
      })),
      bloodlines: bloodlinesResult.rows.map(b => ({
        name: b.name,
        th_name: b.th_name || '', 
        atk_bonus: b.atk_bonus,
        desc: b.description 
      })),
      amulets: amuletsResult.rows.map(a => ({
        amulet_name: a.name,
        abilities: a.abilities
      })),
      conditions: [], // ปล่อยว่างไว้ตามเดิม
      vampires: vampiresResult.rows.map(v => ({
        id: v.id,
        name: v.name,
        rank_level: String(v.rank_level),
        amulet_name: v.amulet_name,
        bloodline_name: v.bloodline_name,
        image_url: v.image_url
      }))
    };

    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Database Error:', error);
    
    // ใช้ instanceof Error เพื่อกัน VS Code ฟ้องแดง (Type Strictness)
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}