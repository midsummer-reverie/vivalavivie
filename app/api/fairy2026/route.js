import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.FAE_URL 
});

export async function GET() {
  try {
    const [
      raritiesResult,
      pactsResult,
      amuletsResult,
      ranksResult,
      conditionsResult,
      fairiesResult
    ] = await Promise.all([
      pool.query('SELECT * FROM fairy_rarities;'),
      pool.query('SELECT * FROM fairy_pacts;'),
      pool.query('SELECT * FROM fairy_amulets;'),
      pool.query('SELECT * FROM fairy_ranks;'),
      pool.query('SELECT * FROM fairy_conditions;'),
      pool.query('SELECT * FROM fairies;')
    ]);

    const data = {
      rarities: raritiesResult.rows,
      pacts: pactsResult.rows,
      amulets: amuletsResult.rows,
      ranks: ranksResult.rows,
      conditions: conditionsResult.rows,
      fairies: fairiesResult.rows 
    };

    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}