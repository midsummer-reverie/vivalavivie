"use client";

import React, { useEffect, useState } from "react";

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  // ==========================================
  // ⚙️ ตั้งค่าชื่อแท็บและไอค่อนบนเบราว์เซอร์
  // ==========================================
  const TAB_TITLE = "Elysian Curse 2026 - Ability Data"; 
  const TAB_ICON = "https://iili.io/n1WrkqG.png"; // ใส่ลิงก์รูปไอค่อนที่ต้องการตรงนี้
  // ==========================================

  useEffect(() => {
    // ให้ Effect การโหลดทำงานนิดหน่อยเพื่อให้ดู Smooth
    setIsLoaded(true);
    
    // อัปเดตชื่อแท็บ
    document.title = TAB_TITLE;
  }, []);

  // ข้อมูลเผ่าพันธุ์ทั้ง 6 พร้อมสีที่กำหนดใหม่
  const RACES = [
    { 
      id: 'enchanter', 
      name: 'พ่อมดแม่มด', 
      en: 'Enchanter', 
      path: '/elysian-curse/enchanter', // เปลี่ยนเป็น '/enchanter2026' 
      color: '#8d68b4', // ม่วง
      img: 'https://iili.io/n1XDdVp.png' 
    },
    { 
      id: 'vampire', 
      name: 'แวมไพร์', 
      en: 'Vampire', 
      path: '/elysian-curse/vampire', // เปลี่ยนเป็น '/vampire2026'
      color: '#a31616', // แดง
      img: 'https://iili.io/n1hfecJ.png' 
    },
    { 
      id: 'werewolf', 
      name: 'มนุษย์หมาป่า', 
      en: 'Werewolf', 
      path: '/elysian-curse/werewolf', // เปลี่ยนเป็น '/werewolf2026'
      color: '#7e7e7e', // เทา
      img: 'https://iili.io/n1Xybwu.png' 
    },
    { 
      id: 'merpeople', 
      name: 'ชาวเงือก', 
      en: 'Merpeople', 
      path: '/elysian-curse/merpeople', // เชื่อมไปหน้าชาวเงือกที่มีอยู่แล้ว
      color: '#5f9cd9', // ฟ้า
      img: 'https://iili.io/nc75EYB.png' 
    },
    { 
      id: 'fairy', 
      name: 'แฟรี่', 
      en: 'Fairy', 
      path: '/elysian-curse/fairy', // เชื่อมไปหน้าแฟรี่ที่มีอยู่แล้ว
      color: '#52c17b', // เขียว
      img: 'https://iili.io/nchwsNs.png' 
    },
    { 
      id: 'sapien', 
      name: 'มนุษย์', 
      en: 'Sapien', 
      path: '/elysian-curse/sapien', // เปลี่ยนเป็น '/sapien2026'
      color: '#d4af37', // เหลืองอมน้ำตาลทอง
      img: 'https://iili.io/n1XLNoB.png' 
    }
  ];

  return (
    <>
      {/* ดึงค่า TAB_ICON มาใส่เป็น Favicon อัตโนมัติ */}
      <link rel="icon" type="image/png" href={TAB_ICON} />
      <title>{TAB_TITLE}</title>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300..700&display=swap');
        @import url('https://midsummer-reverie.github.io/font-face/ophelia.css');

        :root {
          /* โทนสีบานเย็น (Fuchsia / Magenta) */
          --bg0: #120309; 
          --bg1: #2a0817;
          --primary: #cc4397;
          --primary-glow: rgba(255, 51, 177, 0.4);
          --text: #fff0f5; 
          --muted: #ffb3d1; 
          --line: rgba(255, 102, 178, 0.25); 
          --line-soft: rgba(255, 102, 178, 0.12);
          
          --card-bg: linear-gradient(165deg, rgba(61, 11, 31, 0.8) 0%, rgba(18, 3, 9, 0.95) 100%);
          --sans: 'Google Sans', 'Noto Sans Thai', system-ui, -apple-system, sans-serif;
          --display: 'ophelia', 'Noto Serif Thai', Georgia, serif;
        }

        html, body {
          background-color: var(--bg0);
          margin: 0;
          color: var(--text);
          font-family: var(--sans);
          -webkit-tap-highlight-color: transparent;
        }

        /* เอฟเฟกต์พื้นหลังบานเย็น */
        .home-wrapper {
          min-height: 100dvh;
          background: 
            radial-gradient(800px 600px at 80% -10%, rgba(255, 20, 147, 0.15), transparent 60%),
            radial-gradient(600px 500px at 10% 40%, rgba(199, 21, 133, 0.12), transparent 60%),
            linear-gradient(180deg, var(--bg1), var(--bg0) 80%);
          background-attachment: fixed;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 20px;
          opacity: 0;
          transition: opacity 1s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .home-wrapper.loaded {
          opacity: 1;
        }

        /* ประกายดาวลอยๆ */
        .home-wrapper::before {
          content: ""; position: fixed; inset: 0; pointer-events: none; opacity: 0.6;
          background-image: 
            radial-gradient(1.5px 1.5px at 15% 20%, #ffb3d1, transparent),
            radial-gradient(1px 1px at 85% 10%, #fff, transparent),
            radial-gradient(1.5px 1.5px at 70% 40%, #ff66b2, transparent),
            radial-gradient(1px 1px at 30% 60%, #fff, transparent),
            radial-gradient(1.5px 1.5px at 90% 70%, #ffb3d1, transparent),
            radial-gradient(1px 1px at 10% 85%, #fff, transparent),
            radial-gradient(1.5px 1.5px at 50% 90%, #ff66b2, transparent);
        }

        .wrap {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .hero-header {
          text-align: center;
          margin-bottom: 50px;
          animation: floatUp 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .main-logo {
          width: clamp(250px, 65vw, 480px);
          height: auto;
          margin: 0 auto 30px;
          display: block;
          filter: drop-shadow(0 0 25px var(--primary-glow));
          pointer-events: none;
        }

        .hero-header h1 {
          font-family: var(--display);
          font-size: clamp(40px, 8vw, 70px);
          font-weight: 400;
          margin: 0;
          color: #fff;
          text-shadow: 0 4px 20px rgba(255, 51, 177, 0.6);
          letter-spacing: 0.02em;
        }

        .hero-header p {
          color: var(--muted);
          font-size: clamp(15px, 3vw, 18px);
          margin: 10px 0 0;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .race-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          animation: floatUp 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @media (min-width: 600px) {
          .race-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 900px) {
          .race-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .race-card {
          text-decoration: none;
          background: var(--card-bg);
          border-width: 1px;
          border-style: solid;
          border-radius: 24px;
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .race-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top, rgba(255, 255, 255, 0.1), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }

        .race-card:hover::after {
          opacity: 1;
        }

        .race-icon-wrap {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          background: rgba(255, 255, 255, 0.03);
          padding: 0.85vw;
          box-sizing: border-box;
          border-width: 1px;
          border-style: solid;
          overflow: hidden;
          transition: all 0.3s;
        }

        .race-icon-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }

        .race-icon-fallback {
          font-size: 32px;
        }

        .race-en {
          font-family: var(--display);
          font-size: 26px;
          color: #fff;
          margin: 0;
          line-height: 1.1;
          font-weight: 500;
          letter-spacing: 0.1vw;
        }

        .race-th {
          font-family: var(--sans);
          font-size: 15px;
          color: var(--muted);
          margin: 6px 0 0;
          font-weight: 500;
        }

        /* กลุ่มปุ่มด้านล่าง (2 ปุ่ม) */
        .back-home-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 40px;
          animation: floatUp 1.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .back-home-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: rgba(42, 8, 23, 0.6); 
          color: var(--text);
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s;
        }

        .back-home-btn:hover {
          background: rgba(204, 67, 151, 0.2);
          border-color: var(--primary);
          box-shadow: 0 0 15px var(--primary-glow);
          transform: translateY(-2px);
        }

        .back-home-btn svg {
          width: 18px;
          height: 18px;
          stroke: currentColor;
          stroke-width: 2;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        
        .back-home-btn .custom-icon {
          width: 18px;
          height: 18px;
          object-fit: contain;
        }

        .footer {
          margin-top: 60px;
          text-align: center;
          font-family: var(--sans);
          color: var(--muted);
          font-size: 14px;
          letter-spacing: 0.1em;
          opacity: 0.6;
        }

        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}} />

      <div className={`home-wrapper ${isLoaded ? 'loaded' : ''}`}>
        <div className="wrap">
          
          <div className="hero-header">
            <img 
                src="https://iili.io/n1WrkqG.png" 
                alt="Elysian Curse Logo" 
                className="main-logo"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                }}
            />
            <h1>Ability Data & Calculator</h1>
            <p>ระบบข้อมูลความสามารถและเครื่องมือคำนวณพลัง</p>
          </div>

          <div className="race-grid">
            {RACES.map((r, i) => (
              <a 
                href={r.path} 
                key={r.id} 
                className="race-card" 
                style={{ 
                    animationDelay: `${0.1 * i}s`,
                    borderColor: `${r.color}40`
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = r.color;
                    e.currentTarget.style.boxShadow = `0 10px 30px ${r.color}40`;
                    e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${r.color}40`;
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div 
                    className="race-icon-wrap" 
                    style={{ 
                        boxShadow: `0 0 15px ${r.color}30, inset 0 0 20px rgba(0,0,0,0.5)`,
                        borderColor: `${r.color}60`
                    }}
                >
                  <img 
                    src={r.img} 
                    alt={r.en} 
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `<span class="race-icon-fallback" style="color:${r.color}">${r.en.charAt(0)}</span>`;
                    }}
                  />
                </div>
                <h2 className="race-en">{r.en}</h2>
                <div className="race-th">{r.name}</div>
              </a>
            ))}
          </div>

          {/* กลุ่ม 2 ปุ่มใหม่ ด้านล่างการ์ดเผ่า */}
          <div className="back-home-wrap">
            {/* ปุ่ม 1: กลับหน้าหลัก (ไอค่อนรูปบ้านเหมือนเดิม) */}
            <a href="/" className="back-home-btn">
              <svg viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              กลับหน้าหลักของ The Dreamscape Archive
            </a>

            {/* ปุ่ม 2: กลับเว็บไซต์ (ใช้รูปไอค่อนใหม่) */}
            <a href="https://roleplayth.com/index.php" className="back-home-btn">
              <img src="https://i.imgur.com/8HSy5Et.png" alt="Website Icon" className="custom-icon" />
              กลับเว็บไซต์ RoleplayTH
            </a>
          </div>

          <div className="footer">
            © 2026 vivalavivie, RoleplayTH. All rights reserved.
          </div>

        </div>
      </div>
    </>
  );
}