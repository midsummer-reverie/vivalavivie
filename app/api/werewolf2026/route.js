import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.WW_URL 
});

export async function GET() {
  try {
    const [ranksResult, spiritPowersResult, amuletsResult, werewolvesResult] = await Promise.all([
      pool.query('SELECT * FROM ww_ranks ORDER BY rank_level ASC;'),
      pool.query('SELECT * FROM ww_spirit_powers;'),
      pool.query('SELECT * FROM ww_amulets;'),
      pool.query('SELECT * FROM werewolves ORDER BY id ASC;')
    ]);

    const data = {
      levels: ranksResult.rows.map(r => ({
        rank_level: String(r.rank_level),
        rank_name: r.rank_name,
        combat_abilities: r.combat_abilities,
        utility_abilities: r.utility_abilities
      })),
      spirit_powers: spiritPowersResult.rows.map(s => ({
        name: s.name,
        th_name: s.th_name || '', 
        atk_bonus: s.atk_bonus,
        desc: s.description 
      })),
      amulets: amuletsResult.rows.map(a => ({
        amulet_name: a.name,
        abilities: a.abilities
      })),
      conditions: [], 
      werewolves: werewolvesResult.rows.map(w => ({
        id: w.id,
        name: w.name,
        rank_level: String(w.rank_level),
        amulet_name: w.amulet_name,
        spirit_power: w.spirit_power,
        ww_class: w.ww_class || 'Omega', // เพิ่มตรงนี้
        pack_name: w.pack_name || '',    // เพิ่มตรงนี้
        image_url: w.image_url
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