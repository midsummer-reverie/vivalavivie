import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id) {
      return NextResponse.json({ error: "ต้องระบุ ID ของโค้ด" }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined");
    }

    const sql = neon(process.env.DATABASE_URL);
    let result;

    if (action === 'unlike') {
      // 📉 ถอนไลก์: ลบ 1 โดยใช้ GREATEST เพื่อป้องกันไม่ให้ค่าน้อยกว่า 0 (ติดลบ)
      result = await sql`
        UPDATE "Codes" 
        SET likes = GREATEST(COALESCE(likes, 0) - 1, 0) 
        WHERE id = ${id} 
        RETURNING likes;
      `;
    } else {
      // 📈 กดไลก์: บวก 1
      result = await sql`
        UPDATE "Codes" 
        SET likes = COALESCE(likes, 0) + 1 
        WHERE id = ${id} 
        RETURNING likes;
      `;
    }

    if (result.length === 0) {
      return NextResponse.json({ error: "ไม่พบโค้ดนี้ในฐานข้อมูล" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: action === 'unlike' ? "ยกเลิกไลก์สำเร็จ" : "อัปเดตยอดไลก์สำเร็จ",
      likes: result[0].likes 
    }, { status: 200 });

  } catch (error) {
    console.error("Like API Error:", error);
    return NextResponse.json({ error: "ไม่สามารถอัปเดตยอดไลก์ได้" }, { status: 500 });
  }
}