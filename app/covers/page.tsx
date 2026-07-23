"use client";

import React from 'react';
import Link from 'next/link';

export default function ComingSoon() {
  return (
    <div 
      className="coming-soon-wrapper"
      style={{
        '--glass-bg': 'rgba(255, 255, 255, 0.55)',
        '--glass-border': 'rgba(255, 255, 255, 0.7)',
        '--text-dark': '#7f1d1d', /* สีแดงเข้ม */
        '--theme-primary': '#ffcdd2', /* แดงพาสเทล */
        '--theme-secondary': '#ffe0b2', /* ส้มพาสเทล */
        '--theme-tertiary': '#fff9c4', /* เหลืองพาสเทล */
        '--radius-lg': '24px',
        '--radius-md': '12px',
      } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;600;700&display=swap');

        .coming-soon-wrapper {
          min-height: 100vh; margin: 0; padding: 4vw;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Google Sans', sans-serif; color: var(--text-dark);
          background: radial-gradient(circle at 15% 20%, var(--theme-primary) 0%, transparent 50%),
                      radial-gradient(circle at 85% 80%, var(--theme-secondary) 0%, transparent 50%),
                      radial-gradient(circle at 50% 50%, var(--theme-tertiary) 0%, transparent 60%),
                      linear-gradient(135deg, #fff5f5 0%, #fffbeb 100%);
          background-attachment: fixed; overflow: hidden; position: relative;
        }
        .coming-soon-wrapper * { box-sizing: border-box; }

        /* 🌟 PNG ลอยๆ */
        .img-float { position: absolute; background-size: contain; background-repeat: no-repeat; background-position: center; pointer-events: none; z-index: 1; }
        .img-1 { width: 70px; height: 70px; top: 15%; left: 15%; background-image: url('https://iili.io/CNQcH1j.md.png'); animation: floatFade 6s ease-in-out infinite; }
        .img-2 { width: 60px; height: 60px; bottom: 20%; left: 25%; background-image: url('https://iili.io/CNQamXe.png'); animation: floatFade 5s ease-in-out infinite 1s; }
        .img-3 { width: 55px; height: 55px; top: 25%; right: 15%; background-image: url('https://iili.io/CNQapLu.md.png'); animation: floatFade 7s ease-in-out infinite 0.5s; }
        .img-4 { width: 50px; height: 50px; bottom: 25%; right: 20%; background-image: url('https://iili.io/CNQc9qb.md.png'); animation: floatFade 6.5s ease-in-out infinite 0.2s; }

        @keyframes floatFade {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0.8; filter: drop-shadow(0 0 0px rgba(255, 205, 210, 0)); }
          50%  { transform: translateY(-15px) rotate(8deg); opacity: 1; filter: drop-shadow(0 10px 15px rgba(255, 138, 101, 0.4)); }
          100% { transform: translateY(0) rotate(0deg); opacity: 0.8; filter: drop-shadow(0 0 0px rgba(255, 205, 210, 0)); }
        }
        
        @media (max-width: 768px) {
          .img-1 { left: 5%; top: 10%; } .img-2 { left: 10%; bottom: 15%; }
          .img-3 { right: 5%; top: 15%; } .img-4 { right: 10%; bottom: 15%; }
        }

        /* Glass Card */
        .glass-card {
          background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); 
          padding: 60px 40px; backdrop-filter: blur(16px); box-shadow: 0 20px 50px rgba(239, 68, 68, 0.08); 
          text-align: center; max-width: 600px; width: 100%; position: relative; z-index: 10;
          animation: fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

        .title { font-size: 3rem; font-weight: 700; margin: 0 0 16px 0; color: var(--text-dark); line-height: 1.1; letter-spacing: -0.02em; }
        .subtitle { font-size: 1.2rem; color: #991b1b; margin-bottom: 32px; font-weight: 600; opacity: 0.9; }
        
        .highlight { 
          background-color: var(--theme-secondary); color: var(--text-dark); padding: 0 8px; 
          display: inline-block; border-radius: 8px; transform: rotate(-2deg); 
        }

        .back-btn {
          display: inline-flex; align-items: center; justify-content: center; text-decoration: none; 
          color: #fff; font-weight: 700; font-size: 1.1rem; font-family: 'Google Sans', sans-serif;
          background: linear-gradient(135deg, #f87171, #fb923c); border: 1px solid rgba(255,255,255,0.5);
          padding: 14px 32px; border-radius: 30px; box-shadow: 0 8px 20px rgba(248, 113, 113, 0.3); 
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .back-btn:hover { transform: translateY(-4px); box-shadow: 0 12px 25px rgba(248, 113, 113, 0.4); filter: brightness(1.05); }

        /* อนิเมชันจุดไข่ปลาโหลด */
        .loading-dots:after {
          content: ' .';
          animation: dots 1.5s steps(5, end) infinite;
        }
        @keyframes dots {
          0%, 20% { color: rgba(0,0,0,0); text-shadow: .25em 0 0 rgba(0,0,0,0), .5em 0 0 rgba(0,0,0,0); }
          40% { color: var(--text-dark); text-shadow: .25em 0 0 rgba(0,0,0,0), .5em 0 0 rgba(0,0,0,0); }
          60% { text-shadow: .25em 0 0 var(--text-dark), .5em 0 0 rgba(0,0,0,0); }
          80%, 100% { text-shadow: .25em 0 0 var(--text-dark), .5em 0 0 var(--text-dark); }
        }
      `}} />

      {/* 🌟 PNG ลอยๆ */}
      <div className="img-float img-1" />
      <div className="img-float img-2" />
      <div className="img-float img-3" />
      <div className="img-float img-4" />

      <div className="glass-card">
        <div style={{ fontSize: '4rem', marginBottom: '16px', animation: 'floatFade 4s infinite' }}>🚧</div>
        <h1 className="title">
          Coming <span className="highlight">Soon</span>
        </h1>
        <p className="subtitle">
          หน้านี้ยังอยู่ระหว่างการสร้าง เตรียมพบกันเร็วๆ นี้<span className="loading-dots"></span>
        </p>
        
        <Link href="/" className="back-btn">
          ← กลับหน้าหลัก
        </Link>
      </div>
    </div>
  );
}