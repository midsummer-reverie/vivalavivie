"use client";

import React from 'react';
import Link from 'next/link';

export default function Els48Home() {
  // 🎨 กำหนดโทนสีพาสเทล ฟ้า-เขียว-Teal สไตล์ทะเลสาบ
  const themeVars = {
    '--color-text-main': '#115e59', // Dark Teal
    '--color-primary': '#0d9488',   // Teal
    '--color-secondary': '#0369a1', // Lake Blue
    '--color-accent': '#10b981',    // Nature Green
    '--bg-grad-1': '#ccfbf1',       // Pastel Teal
    '--bg-grad-2': '#e0f2fe',       // Pastel Blue
    '--bg-grad-3': '#dcfce7',       // Pastel Green
    '--glass-border': 'rgba(255, 255, 255, 0.7)',
    '--glass-bg': 'rgba(255, 255, 255, 0.65)',
  } as React.CSSProperties;

  return (
    <div className="home-wrapper" style={themeVars}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;600;700;800&display=swap');
        
        /* ============================
           ✨ แอนิเมชันตอนโหลดเข้าหน้าเว็บ
           ============================ */
        @keyframes pageFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes containerPopUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes itemFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .home-wrapper { 
          min-height: 100vh; 
          margin: 0; 
          padding: 4vw; 
          font-family: 'Google Sans', sans-serif; 
          color: var(--color-text-main); 
          background: linear-gradient(135deg, var(--bg-grad-1) 0%, var(--bg-grad-2) 50%, var(--bg-grad-3) 100%); 
          background-attachment: fixed;
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          position: relative;
          overflow: hidden;
          
          /* พื้นหลังเฟดเข้า */
          animation: pageFadeIn 0.8s ease-out forwards;
        }
        
        .home-wrapper * { box-sizing: border-box; }

        /* ป้องกันการคลุมดำ (Select) */
        .no-select {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          pointer-events: none;
        }
        
        /* ปุ่มกลับหน้าหลัก */
        .back-btn { 
          position: absolute;
          top: 30px;
          left: 4vw;
          display: inline-flex; 
          align-items: center; 
          text-decoration: none; 
          color: var(--color-primary); 
          font-weight: 700; 
          background: rgba(255,255,255,0.7); 
          border: 2px solid var(--glass-border); 
          padding: 10px 20px; 
          border-radius: 20px; 
          backdrop-filter: blur(8px); 
          box-shadow: 0 4px 10px rgba(13, 148, 136, 0.1); 
          transition: 0.3s; 
          z-index: 50;
        }
        .back-btn:hover { 
          background: #fff; 
          transform: translateX(-5px); 
          border-color: var(--color-accent); 
        }

        /* แอนิเมชันอิโมจิลอยตัว (ทำงานต่อจากเฟดเข้า) */
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        
        .floating-emoji {
          position: absolute;
          opacity: 0.5;
          z-index: 1;
        }
        
        .home-container { 
          max-width: 800px; 
          width: 100%; 
          background: var(--glass-bg); 
          border: 2px solid var(--glass-border); 
          border-radius: 32px; 
          padding: 50px 40px; 
          backdrop-filter: blur(16px); 
          box-shadow: 0 20px 50px rgba(13, 148, 136, 0.1); 
          text-align: center; 
          position: relative;
          z-index: 10;
          
          /* กล่องค่อยๆ ลอยขึ้นมา */
          opacity: 0;
          animation: containerPopUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s forwards;
        }

        .deco-bg {
          position: absolute;
          font-size: 8rem;
          opacity: 0.1;
          z-index: 0;
        }

        .content-z {
          position: relative;
          z-index: 10;
        }
        
        /* คลาสสำหรับหน่วงเวลาแอนิเมชันให้ไล่ลำดับกัน (Staggered) */
        .anim-item-1 { opacity: 0; animation: itemFadeUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s forwards; }
        .anim-item-2 { opacity: 0; animation: itemFadeUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.5s forwards; }
        .anim-item-3 { opacity: 0; animation: itemFadeUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.6s forwards; }
        .anim-item-4 { opacity: 0; animation: itemFadeUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.7s forwards; }
        .anim-item-5 { opacity: 0; animation: itemFadeUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.8s forwards; }
        
        .title { 
          font-size: 2.8rem; 
          font-weight: 800; 
          color: var(--color-primary); 
          margin: 10px 0; 
          line-height: 1.2;
        }
        
        .subtitle { 
          font-size: 1.1rem; 
          color: var(--color-secondary); 
          margin-bottom: 40px; 
          font-weight: 600; 
        }
        
        .btn-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 24px; 
        }
        
        .btn-card { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          padding: 40px 20px; 
          background: rgba(255,255,255,0.7); 
          border: 2px dashed rgba(13, 148, 136, 0.4); 
          border-radius: 24px; 
          text-decoration: none; 
          transition: all 0.3s ease; 
          color: var(--color-primary); 
        }
        
        .btn-card:hover { 
          transform: translateY(-5px); 
          background: #fff; 
          border-style: solid; 
          border-color: var(--color-primary); 
          box-shadow: 0 15px 30px rgba(13, 148, 136, 0.15); 
        }
        
        .btn-icon { 
          font-size: 3.5rem; 
          margin-bottom: 16px; 
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
        }
        
        .btn-label { 
          font-size: 1.5rem; 
          font-weight: 800; 
        }
        
        .btn-desc { 
          font-size: 0.95rem; 
          color: var(--color-text-main); 
          margin-top: 8px; 
          opacity: 0.8; 
          font-weight: 500;
        }

        @media (max-width: 600px) { 
          .btn-grid { grid-template-columns: 1fr; } 
          .title { font-size: 2.2rem; }
          .back-btn { top: 20px; left: 20px; font-size: 0.9rem; padding: 8px 16px; }
        }
      `}} />

      {/* 🔙 ปุ่มกลับหน้าหลัก */}
      <Link href="/" className="back-btn">
        ← กลับหน้าหลัก
      </Link>

      {/* ✨ อิโมจิพื้นหลังลอยตัวรอบๆ */}
      <div className="floating-emoji no-select" style={{ top: '15%', left: '8%', fontSize: '4rem', animation: 'float-slow 6s ease-in-out infinite' }}>🦢</div>
      <div className="floating-emoji no-select" style={{ top: '25%', right: '12%', fontSize: '3rem', animation: 'float-medium 5s ease-in-out infinite' }}>🍃</div>
      <div className="floating-emoji no-select" style={{ bottom: '20%', left: '15%', fontSize: '3.5rem', animation: 'float-medium 7s ease-in-out infinite' }}>🌿</div>
      <div className="floating-emoji no-select" style={{ bottom: '15%', right: '10%', fontSize: '4.5rem', animation: 'float-slow 8s ease-in-out infinite' }}>🌲</div>
      <div className="floating-emoji no-select" style={{ top: '50%', left: '4%', fontSize: '2rem', animation: 'float-medium 6s ease-in-out infinite' }}>✨</div>
      <div className="floating-emoji no-select" style={{ top: '65%', right: '6%', fontSize: '2.5rem', animation: 'float-slow 7s ease-in-out infinite' }}>💧</div>
      <div className="floating-emoji no-select" style={{ top: '5%', right: '30%', fontSize: '2rem', animation: 'float-medium 6.5s ease-in-out infinite' }}>🏞️</div>

      <div className="home-container">
        {/* อิโมจิตกแต่งมุมกล่อง */}
        <div className="deco-bg no-select" style={{ top: '-20px', left: '-20px' }}>🌲</div>
        <div className="deco-bg no-select" style={{ bottom: '-20px', right: '-20px' }}>🍃</div>

        <div className="content-z">
          {/* ไล่ใส่คลาส anim-item-1 ถึง 5 เพื่อให้ข้อความและปุ่มเด้งขึ้นมาทีละอัน */}
          <div className="no-select anim-item-1" style={{ fontSize: '3.5rem', marginBottom: '10px' }}>🏞️</div>
          <h1 className="title anim-item-2">ELS48 General Election</h1>
          <p className="subtitle anim-item-3">✦</p>

          <div className="btn-grid">
            <Link href="/els48-ge/ge-form" className="btn-card anim-item-4">
              <span className="btn-icon no-select">📝</span>
              <span className="btn-label">แบบฟอร์ม</span>
              <span className="btn-desc">แบบฟอร์มลงสมัคร</span>
            </Link>
            
            <Link href="/els48-ge/ge-poster" className="btn-card anim-item-5">
              <span className="btn-icon no-select">🖼️</span>
              <span className="btn-label">โปสเตอร์</span>
              <span className="btn-desc">สร้างโปสเตอร์เลือกตั้ง</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}