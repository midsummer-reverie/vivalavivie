import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

// สร้าง Pool ไว้ด้านนอกเพื่อ reuse connection ได้
const pool = new Pool({
  // ใช้ VAM_URL ตามตัวแปรใน .env หรือเปลี่ยนเป็นชื่ออื่นตามตั้งค่าของคุณ
  connectionString: process.env.ENC_URL 
});

export async function GET() {
  try {
    const [
      ranksResult,
      familiarsResult,
      amuletsResult,
      wizardsResult
    ] = await Promise.all([
      pool.query('SELECT * FROM ranks ORDER BY rank_level ASC;'),
      pool.query('SELECT * FROM familiars;'),
      pool.query('SELECT * FROM amulets;'),
      pool.query('SELECT * FROM wizards ORDER BY id ASC;')
    ]);

    // จัดฟอร์แมตข้อมูลจาก .rows ให้ตรงกับที่โครงสร้าง Frontend คาดหวัง
    const data = {
      levels: ranksResult.rows.map(r => ({
        rank_level: String(r.rank_level),
        rank_name: r.rank_name,
        combat_abilities: r.combat_abilities,
        utility_abilities: r.utility_abilities
      })),
      familiars: familiarsResult.rows.map(f => ({
        name: f.name,
        bonus: f.bonus
      })),
      amulets: amuletsResult.rows.map(a => ({
        amulet_name: a.amulet_name,
        abilities: a.abilities
      })),
      conditions: [], // ปล่อยว่างไว้ตามโครงสร้างเดิม
      wizards: wizardsResult.rows.map(w => ({
        id: w.id,
        name: w.name,
        rank_level: String(w.rank_level),
        familiar: w.familiar || 'ไม่มี',
        amulet_name: w.amulet_name || null,
        unique_skill: w.unique_skill || null,
        image_url: w.image_url || null
      }))
    };

    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Database Error:', error);
    
    // ใช้ instanceof Error เพื่อกัน Type Strictness ฟ้องใน TypeScript
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}