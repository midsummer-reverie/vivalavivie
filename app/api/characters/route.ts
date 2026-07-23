import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const characters = await sql`
      SELECT * FROM "Characters" ORDER BY "createdAt" DESC
    `;
    return NextResponse.json(characters, { status: 200 });
  } catch (error: any) {
    console.error("❌ GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      id, name, verseTag, image, description,
      themeColor, nickname, age, birthday, hometown, currentLocation, faceclaim,
      personality, tmi, iconImage, gallery, youtubeSongId, youtubeSongName
    } = body;

    const newId = id || Math.floor(1000 + Math.random() * 9000).toString();
    
    const tags = Array.isArray(verseTag) ? verseTag : [verseTag];
    const pgVerseTag = `{${tags.map((t: string) => `"${t.replace(/"/g, '\\"')}"`).join(',')}}`;
    
    const pics = Array.isArray(gallery) ? gallery : [];
    const pgGallery = pics.length > 0 ? `{${pics.map((p: string) => `"${p.replace(/"/g, '\\"')}"`).join(',')}}` : "{}";

    const newChar = await sql`
      INSERT INTO "Characters" (
        id, name, "verseTag", image, description, "createdAt", "updatedAt",
        "themeColor", nickname, age, birthday, hometown, "currentLocation", faceclaim,
        personality, tmi, "iconImage", gallery, "youtubeSongId", "youtubeSongName"
      )
      VALUES (
        ${newId}, ${name}, ${pgVerseTag}::text[], ${image}, ${description}, NOW(), NOW(),
        ${themeColor || '#add6ff'}, ${nickname}, ${age}, ${birthday}, ${hometown}, ${currentLocation}, ${faceclaim},
        ${personality}, ${tmi}, ${iconImage}, ${pgGallery}::text[], ${youtubeSongId}, ${youtubeSongName}
      )
      RETURNING *
    `;

    return NextResponse.json(newChar[0], { status: 201 });
  } catch (error: any) {
    console.error("❌ POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      id, name, verseTag, image, description,
      themeColor, nickname, age, birthday, hometown, currentLocation, faceclaim,
      personality, tmi, iconImage, gallery, youtubeSongId, youtubeSongName
    } = body;

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const tags = Array.isArray(verseTag) ? verseTag : [verseTag];
    const pgVerseTag = `{${tags.map((t: string) => `"${t.replace(/"/g, '\\"')}"`).join(',')}}`;

    const pics = Array.isArray(gallery) ? gallery : [];
    const pgGallery = pics.length > 0 ? `{${pics.map((p: string) => `"${p.replace(/"/g, '\\"')}"`).join(',')}}` : "{}";

    const updatedChar = await sql`
      UPDATE "Characters"
      SET 
        name = ${name}, "verseTag" = ${pgVerseTag}::text[], image = ${image}, description = ${description},
        "themeColor" = ${themeColor}, nickname = ${nickname}, age = ${age}, birthday = ${birthday},
        hometown = ${hometown}, "currentLocation" = ${currentLocation}, faceclaim = ${faceclaim}, personality = ${personality},
        tmi = ${tmi}, "iconImage" = ${iconImage}, gallery = ${pgGallery}::text[],
        "youtubeSongId" = ${youtubeSongId}, "youtubeSongName" = ${youtubeSongName},
        "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(updatedChar[0], { status: 200 });
  } catch (error: any) {
    console.error("❌ PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}