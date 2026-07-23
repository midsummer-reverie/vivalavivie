"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function CharacterDetail() {
  const params = useParams();
  const charId = params.id as string;

  const [char, setChar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [popupImage, setPopupImage] = useState<{url: string, credit: string} | null>(null);
  const playerRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const res = await fetch('/api/characters');
        if (res.ok) {
          const data = await res.json();
          const foundChar = data.find((c: any) => c.id === charId);
          if (foundChar) setChar(foundChar);
        }
      } catch (error) { console.error("Error fetching character:", error); } 
      finally { setLoading(false); }
    };
    fetchCharacter();
  }, [charId]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (!isPlaying) {
      playerRef.current.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
      setTimeout(() => { playerRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [75] }), '*'); }, 500);
    } else {
      playerRef.current.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo' }), '*');
    }
    setIsPlaying(!isPlaying);
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  if (!char) return <div style={{ textAlign: 'center', padding: '50px' }}><h2>ไม่พบข้อมูลตัวละครนี้ 😥</h2><Link href="/characters" style={{ color: '#4ea8de' }}>กลับไปหน้าหลัก</Link></div>;

  const themeColor = char.themeColor || '#add6ff';
  const verseName = char.verseTag && char.verseTag.length > 0 ? char.verseTag[0] : "";
  
  const galleryPhotos = char.gallery && char.gallery.length > 0 ? char.gallery.map((g: string) => {
    try { const obj = JSON.parse(g); return obj.url !== undefined ? obj : { url: g, credit: "" }; } 
    catch { return { url: g, credit: "" }; }
  }) : [];

  return (
    <div className="char-detail-wrapper" style={{ '--theme-color': themeColor, '--glass-bg': 'rgba(255, 255, 255, 0.55)', '--glass-border': 'rgba(255, 255, 255, 0.7)', '--text-dark': '#1d1d1f', '--text-gray': '#6b6b70', '--radius-lg': '24px', '--radius-md': '16px' } as React.CSSProperties}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        .char-detail-wrapper { min-height: 100vh; margin: 0; padding: 4vw; font-family: 'Google Sans', sans-serif; color: var(--text-dark); background: radial-gradient(circle at 80% 0%, var(--theme-color) 0%, transparent 60%), radial-gradient(circle at 20% 100%, #f0f9ff 0%, #fffbeb 100%); background-attachment: fixed; }
        .char-detail-wrapper * { box-sizing: border-box; }
        .max-w { max-width: 860px; margin: 0 auto; animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .top-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .back-btn { display: inline-flex; align-items: center; justify-content: center; text-decoration: none; color: var(--text-dark); font-weight: 600; font-size: 0.95rem; background: var(--glass-bg); border: 1px solid var(--glass-border); padding: 10px 20px; border-radius: 20px; backdrop-filter: blur(12px); transition: all 0.2s; }
        .back-btn:hover { background: rgba(255,255,255,0.8); transform: translateX(-4px); }
        .header-section { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; border-bottom: 2px solid rgba(0,0,0,0.05); padding-bottom: 20px; }
        @media (max-width: 600px) { .header-section { flex-direction: column; align-items: center; text-align: center; } }
        .char-title h1 { font-size: 2.8rem; max-width: 600px; margin: 0 0 6px 0; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; }
        .verse-badge { display: inline-block; background: var(--theme-color); color: #000; padding: 6px 14px; border-radius: 12px; font-size: 0.9rem; font-weight: 700; }
        .music-player { display: flex; align-items: center; gap: 12px; background: var(--glass-bg); border: 1px solid var(--glass-border); padding: 8px 16px 8px 8px; border-radius: 30px; backdrop-filter: blur(12px); box-shadow: 0 4px 16px rgba(0,0,0,0.05); width: 220px; margin-bottom: 6px; }
        .play-btn { width: 38px; height: 38px; border-radius: 50%; background: var(--text-dark); color: #fff; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.1rem; transition: transform 0.2s; line-height: 0; flex-shrink: 0; }
        .play-btn:hover { transform: scale(1.05); }
        .song-name-container { overflow: hidden; white-space: nowrap; flex: 1; position: relative; mask-image: linear-gradient(to right, black 85%, transparent 100%); -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%); }
        .song-marquee { display: inline-block; font-size: 0.9rem; font-weight: 600; color: var(--text-dark); padding-left: 100%; animation: marqueeScroll 10s linear infinite; }
        @keyframes marqueeScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        .middle-grid { display: grid; grid-template-columns: minmax(280px, 3.5fr) 4.5fr; gap: 24px; margin-bottom: 32px; align-items: stretch; }
        @media (max-width: 768px) { .middle-grid { grid-template-columns: 1fr; } }
        .cover-image-container { width: 100%; height: 100%; }
        .cover-image { width: 100%; height: 100%; aspect-ratio: 3 / 4; border-radius: var(--radius-lg); object-fit: cover; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border: 2px solid var(--glass-border); }
        .info-right-stack { display: flex; flex-direction: column; gap: 16px; justify-content: center; }
        .info-row { display: flex; gap: 16px; width: 100%; }
        .info-row > * { flex: 1; }
        .glass-card { background: var(--glass-bg); border: 1px solid var(--glass-border); padding: 24px; border-radius: var(--radius-lg); backdrop-filter: blur(16px); box-shadow: 0 8px 32px rgba(0,0,0,0.04); margin-bottom: 24px; }
        .info-box { padding: 16px 20px; text-align: left; margin-bottom: 0; }
        .card-label { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-gray); font-weight: 700; margin-bottom: 6px; }
        .card-value { font-size: 1.15rem; font-weight: 600; margin: 0; }
        .section-title { font-size: 1.4rem; font-weight: 700; margin: 0 0 16px 0; border-bottom: 2px solid rgba(0,0,0,0.05); padding-bottom: 12px; }
        .rich-text { font-size: 1.05rem; line-height: 1.7; color: #333; white-space: pre-wrap; word-break: break-word; }
        .rich-text a { color: var(--theme-color); text-decoration: underline; font-weight: 600; filter: brightness(0.8); }
        .rich-text ul { margin: 8px 0; padding-left: 20px; }
        .rich-text details { background: rgba(255,255,255,0.4); padding: 12px; border-radius: var(--radius-md); margin: 10px 0; }
        .rich-text summary { font-weight: 600; cursor: pointer; outline: none; }
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
        .gallery-item { width: 100%; aspect-ratio: 1; border-radius: var(--radius-md); overflow: hidden; background: rgba(255,255,255,0.3); border: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .gallery-item:hover img { transform: scale(1.05); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 1000; padding: 20px; opacity: 0; animation: fadeIn 0.3s forwards; }
        .modal-img-container { position: relative; max-width: 90vw; max-height: 80vh; }
        .modal-img-container img { max-width: 100%; max-height: 80vh; object-fit: contain; border-radius: var(--radius-md); box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
        .modal-credit { margin-top: 16px; color: #fff; font-size: 1.1rem; font-weight: 600; background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 30px; backdrop-filter: blur(4px); }
        .close-btn { position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 1.5rem; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .close-btn:hover { background: rgba(255,255,255,0.4); transform: scale(1.1); }
        @keyframes fadeIn { to { opacity: 1; } }
      `}} />

      {char.youtubeSongId && (
        <iframe ref={playerRef} src={`https://www.youtube.com/embed/${char.youtubeSongId}?enablejsapi=1&controls=0&showinfo=0&autohide=1&playsinline=1`} style={{ position: 'absolute', width: 0, height: 0, border: 0 }} allow="autoplay" />
      )}

      {popupImage && (
        <div className="modal-overlay" onClick={() => setPopupImage(null)}>
          <button className="close-btn" onClick={() => setPopupImage(null)}>✕</button>
          <div className="modal-img-container" onClick={e => e.stopPropagation()}><img src={popupImage.url} alt="Gallery Fullsize" /></div>
          {popupImage.credit && <div className="modal-credit">🎨 {popupImage.credit}</div>}
        </div>
      )}

      <div className="max-w">
        <div className="top-nav"><Link href="/characters" className="back-btn">← Back</Link></div>

        <div className="header-section">
          <div className="char-title"><h1>{char.name}</h1>{verseName && <span className="verse-badge">{verseName}</span>}</div>
          {char.youtubeSongId && (
            <div className="music-player">
              <button className="play-btn" onClick={togglePlay}>{isPlaying ? '⏸' : '▶'}</button>
              <div className="song-name-container"><div className="song-marquee">🎵 {char.youtubeSongName || "Theme Song"}</div></div>
            </div>
          )}
        </div>

        <div className="middle-grid">
          <div className="cover-image-container">
            {char.image || char.imageUrl ? <img src={char.image || char.imageUrl} alt={char.name} className="cover-image" /> : <div className="cover-image" style={{ background: 'rgba(0,0,0,0.1)' }} />}
          </div>

          <div className="info-right-stack">
            {char.nickname && <div className="glass-card info-box"><div className="card-label">Nickname</div><p className="card-value">{char.nickname}</p></div>}
            
            {(char.birthday || char.age) && (
              <div className="info-row">
                {char.birthday && <div className="glass-card info-box"><div className="card-label">Birthday</div><p className="card-value">{char.birthday}</p></div>}
                {char.age && <div className="glass-card info-box"><div className="card-label">Age</div><p className="card-value">{char.age}</p></div>}
              </div>
            )}

            {char.hometown && <div className="glass-card info-box"><div className="card-label">Hometown</div><p className="card-value">{char.hometown}</p></div>}
            
            {char.currentLocation && <div className="glass-card info-box"><div className="card-label">Current Location</div><p className="card-value">{char.currentLocation}</p></div>}
            
            {/* 🌟 แสดง Face Claim ต่อจาก Current Location ตรงนี้ */}
            {char.faceclaim && <div className="glass-card info-box"><div className="card-label">Face Claim</div><p className="card-value">{char.faceclaim}</p></div>}
          </div>
        </div>

        {char.personality && <div className="glass-card"><h3 className="section-title">✨ Personality</h3><div className="rich-text" dangerouslySetInnerHTML={{ __html: char.personality }} /></div>}
        {char.description && <div className="glass-card"><h3 className="section-title">📖 Background Story</h3><div className="rich-text" dangerouslySetInnerHTML={{ __html: char.description }} /></div>}
        {char.tmi && <div className="glass-card"><h3 className="section-title">💭 TMI (Too Much Info)</h3><div className="rich-text" dangerouslySetInnerHTML={{ __html: char.tmi }} /></div>}

        {galleryPhotos.length > 0 && (
          <div className="glass-card">
            <h3 className="section-title">📸 Gallery</h3>
            <div className="gallery-grid">
              {galleryPhotos.map((img: any, idx: number) => (
                <div key={idx} className="gallery-item" onClick={() => setPopupImage(img)}><img src={img.url} alt={`${char.name} gallery ${idx + 1}`} loading="lazy" /></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}