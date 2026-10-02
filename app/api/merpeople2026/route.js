import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.MER_URL
});

// ใน App Router ต้องตั้งชื่อฟังก์ชันเป็น GET ตัวใหญ่
export async function GET() {
  try {
    const [
      raritiesResult,
      pactsResult,
      amuletsResult,
      ranksResult,
      conditionsResult,
      merfolkResult
    ] = await Promise.all([
      pool.query('SELECT * FROM spirit_animal_rarities;'),
      pool.query('SELECT * FROM pact_powers;'),
      pool.query('SELECT * FROM amulets;'),
      pool.query('SELECT * FROM rank_abilities;'),
      pool.query('SELECT * FROM ability_conditions;'),
      pool.query('SELECT * FROM merpeople;')
    ]);

    const data = {
      rarities: raritiesResult.rows,
      pacts: pactsResult.rows,
      amulets: amuletsResult.rows,
      ranks: ranksResult.rows,
      conditions: conditionsResult.rows,
      merfolk: merfolkResult.rows
    };

    // ส่งข้อมูลกลับด้วย NextResponse
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}