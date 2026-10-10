import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.SAP_URL // เปลี่ยนเป็น VAM_URL ได้ถ้าตั้งชื่อไว้แบบนั้น
});

export async function GET() {
  try {
    const [ranksResult, weaponsResult, amuletsResult, humansResult] = await Promise.all([
      pool.query('SELECT * FROM hm_ranks ORDER BY rank_level ASC;'),
      pool.query('SELECT * FROM hm_weapon_tiers;'),
      pool.query('SELECT * FROM hm_amulets;'),
      pool.query('SELECT * FROM humans ORDER BY id ASC;')
    ]);

    const data = {
      levels: ranksResult.rows.map(r => ({
        rank_level: String(r.rank_level),
        rank_name: r.rank_name,
        combat_abilities: r.combat_abilities,
        utility_abilities: r.utility_abilities
      })),
      weapon_tiers: weaponsResult.rows.map(w => ({
        name: w.name,
        bonus_rank3: w.bonus_rank3,
        bonus_rank4: w.bonus_rank4
      })),
      amulets: amuletsResult.rows.map(a => ({
        amulet_name: a.name,
        abilities: a.abilities
      })),
      conditions: [], 
      humans: humansResult.rows.map(h => ({
        id: h.id,
        name: h.name,
        rank_level: String(h.rank_level),
        amulet_name: h.amulet_name,
        weapon_tier: h.weapon_tier,
        profession: h.profession || 'ทั่วไป',
        image_url: h.image_url
      }))
    };

    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}