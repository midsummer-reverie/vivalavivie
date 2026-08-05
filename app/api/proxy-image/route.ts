import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    // ให้ Server ของเราไปดึงรูปมา (หมดปัญหา CORS เพราะ Server-to-Server ไม่ติด CORS)
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // แปลงข้อมูลที่ได้เป็น Buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // หาชนิดของรูปภาพ เช่น image/png, image/jpeg
    const contentType = response.headers.get('content-type') || 'image/png';

    // ประกอบร่างเป็น Base64 String แบบสมบูรณ์
    const base64 = `data:${contentType};base64,${buffer.toString('base64')}`;

    // ส่งกลับไปให้หน้าเว็บ
    return NextResponse.json({ base64 });
    
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Failed to process image', { status: 500 });
  }
}