import Link from 'next/link';

export default function Home() {
  return (
    <div 
      className="my-y2k-wrapper"
      style={{
        // จัดการ Theme ผ่าน Inline CSS Variables 
        '--glass-bg': 'rgba(255,255,255,0.35)',
        '--glass-border': 'rgba(255,255,255,0.55)',
        '--glass-blur': '14px',
        '--text-dark': '#2c2c34',
        '--radius-lg': '20px',
        '--radius-md': '14px',
      } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap');

        .my-y2k-wrapper {
          min-height: 100vh;
          margin: 0;
          padding: 3vw;
          font-family: 'Google Sans', "Helvetica Neue", Arial, sans-serif;
          color: var(--text-dark);
          background:
            radial-gradient(circle at 15% 20%, #f6d9e6 0%, transparent 45%),
            radial-gradient(circle at 85% 10%, #cfe0f7 0%, transparent 50%),
            radial-gradient(circle at 75% 80%, #e7d6f5 0%, transparent 55%),
            linear-gradient(135deg, #f3e7f0 0%, #e8ecf8 50%, #f1e9f6 100%);
          background-attachment: fixed;
          overflow-x: hidden;
        }

        .my-y2k-wrapper * {
          box-sizing: border-box;
        }

        /* 🌟 เพิ่มแอนิเมชันตอนเข้าหน้าเว็บ (Transition) */
        .page-transition {
          animation: pageFadeIn 0.8s ease-out forwards; 
          opacity: 0;
          transform: translateY(20px);
        }
        @keyframes pageFadeIn { 
          to { opacity: 1; transform: translateY(0); } 
        }

        .my-page {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 40px 64px;
        }

        /* ของตกแต่งและแอนิเมชันลอย */
        .my-decor-layer { position: absolute; inset: 0; pointer-events: none; z-index: 5; }
        .my-decor { position: absolute; background-size: contain; background-repeat: no-repeat; background-position: center; }
        
        .my-decor-folder { width: 8.5%; aspect-ratio: 1/1; left: 56%; top: 0%; background-image: url('https://iili.io/CN8tNTu.md.png'); rotate: 2deg; }
        .my-decor-lollipop { width: 53%; aspect-ratio: 1/1.414; left: 52%; top: 6%; background-image: url('https://iili.io/CNSK2tV.png'); }
        .my-decor-heart { width: 7.5%; aspect-ratio: 1/1; left: 1%; bottom: 40%; background-image: url('https://iili.io/CN8teQj.md.png'); rotate: -3deg; }
        .my-decor-star-swirl { width: 9%; aspect-ratio: 1/1; left: 42%; bottom: 27%; background-image: url('https://iili.io/CN8t6yF.md.png'); }
        .my-decor-sparkles { width: 6%; aspect-ratio: 1/1; right: 0%; top: 10%; background-image: url('https://iili.io/CN8trYP.md.png'); }

        .my-float { animation: floatFade 6s ease-in-out infinite; }
        .my-float-slow { animation: floatFade 8s ease-in-out infinite; }
        .my-float-fast { animation: floatFade 4.5s ease-in-out infinite; }

        @keyframes floatFade {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          50%  { transform: translateY(-14px) rotate(3deg); opacity: 0.55; }
          100% { transform: translateY(0) rotate(0deg); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .my-float, .my-float-slow, .my-float-fast { animation: none !important; }
        }

        /* เลย์เอาต์หลัก ซ้าย-ขวา */
        .my-content {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 32px;
          align-items: start;
        }
        /* แก้ไขหน้าจอมือถือ: บังคับให้เป็น 2 คอลัมน์ตลอดเวลา เพื่อไม่ให้ตัวละครตกลงไปข้างล่าง */
        @media (max-width: 860px) {
          .my-page { padding: 24px 16px 32px; } /* ลดขอบซ้ายขวาในมือถือให้มีพื้นที่มากขึ้น */
          .my-content { 
            grid-template-columns: 1.2fr 0.8fr; /* ให้ฝั่งซ้ายกว้างกว่านิดหน่อย */
            gap: 16px; 
          }
        }

        .my-left-col { display: flex; flex-direction: column; gap: 28px; }
        @media (max-width: 860px) {
          .my-left-col { gap: 16px; }
        }

        .my-logo {
          width: 150%; max-width: 80vw; aspect-ratio: 560/90;
          background-image: url('https://iili.io/CNS31gs.png');
          background-size: contain; background-repeat: no-repeat; background-position: left center;
        }

        /* เมนู Grid สไตล์ Glassmorphism */
        .my-menu-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr); /* บังคับ 2 คอลัมน์เสมอ */
          gap: 12px; /* ลดช่องว่างระหว่างปุ่มให้เล็กลง */
          max-width: 280px; /* จำกัดความกว้างรวม เพื่อให้ปุ่มเล็กลง */
          font-family: 'Google Sans';
          margin-left: 8vw;
        }
        @media (max-width: 860px) {
          .my-menu-grid { max-width: 100%; gap: 8px; }
        }

        .my-menu-item {
          aspect-ratio: 1/1;
          border-radius: var(--radius-lg);
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(var(--glass-blur)) saturate(140%);
          -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(140%);
          box-shadow: 0 4px 18px rgba(80, 60, 110, 0.10), inset 0 1px 0 rgba(255,255,255,0.6);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 6px; /* ลดช่องว่างระหว่างไอคอนกับตัวหนังสือ */
          padding: 10px; /* ลด padding เพื่อให้ปุ่มดูขนาดกำลังดี */
          text-decoration: none; color: var(--text-dark);
          transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
        }
        .my-menu-item:hover, .my-menu-item:focus-visible {
          transform: translateY(-4px);
          background: rgba(255,255,255,0.5);
          box-shadow: 0 10px 26px rgba(80, 60, 110, 0.16), inset 0 1px 0 rgba(255,255,255,0.7);
          outline: none;
        }
        .my-menu-item:focus-visible { outline: 2px solid #8fb4e3; outline-offset: 3px; }
        
        .my-menu-icon { width: 35%; aspect-ratio: 1/1; object-fit: contain; }
        .my-menu-label { font-size: 0.85rem; font-weight: 600; letter-spacing: 0.02em; text-align: center; }

        .my-chat-bubble {
          width: 70%; max-width: 50vw; aspect-ratio: 1/1;
          background-image: url('https://iili.io/CN8tsja.md.png');
          background-size: contain; background-repeat: no-repeat; background-position: left center;
          margin-top: 10vw; margin-left: 3vw;
        }

        .my-context-menu {
          width: 100%; max-width: 300px; aspect-ratio: 171/191;
          background-image: url('https://iili.io/CN8tsja.md.png');
          background-size: contain; background-repeat: no-repeat; background-position: left top;
          margin-top: -20px;
        }

        .my-right-col { position: relative; z-index: 2; }
        .my-hero-photo {
          width: 120%; aspect-ratio: 385/625;
          background-image: url('https://iili.io/CNSK2tV.md.png');
          background-size: cover; background-position: center top;
          border-radius: var(--radius-md);
          margin-top: 5vw;
        }
        @media (max-width: 860px) {
          .my-hero-photo { width: 100%; } /* ปรับขนาดตัวละครในมือถือให้พอดีกับพื้นที่ไม่ล้นจอ */
        }
      `}} />

      {/* 🌟 เพิ่มคลาส page-transition ตรงนี้ */}
      <div className="my-page page-transition">
        <div className="my-decor-layer">
          <div className="my-decor my-decor-folder my-float-slow"></div>
          <div className="my-decor my-decor-heart my-float"></div>
          <div className="my-decor my-decor-star-swirl my-float-fast"></div>
          <div className="my-decor my-decor-sparkles my-float"></div>
        </div>

        <div className="my-content">
          <div className="my-left-col">
            <div className="my-logo"></div>

            <nav className="my-menu-grid">
              <Link href="/characters" className="my-menu-item">
                <img className="my-menu-icon" src="https://iili.io/CNU5kQ9.png" alt="Characters" />
                <span className="my-menu-label">Characters</span>
              </Link>
              <Link href="/covers" className="my-menu-item">
                <img className="my-menu-icon" src="https://iili.io/CNUARCg.md.png" alt="Song Cover" />
                <span className="my-menu-label">Song Cover</span>
              </Link>
              <Link href="/codes" className="my-menu-item">
                <img className="my-menu-icon" src="https://iili.io/CNUAuZF.md.png" alt="Code Showcase" />
                <span className="my-menu-label">Code Showcase</span>
              </Link>
              <Link href="/tutorials" className="my-menu-item">
                <img className="my-menu-icon" src="https://iili.io/CNUAITP.md.png" alt="Tutorials" />
                <span className="my-menu-label">Tutorials</span>
              </Link>
            </nav>

            <div className="my-chat-bubble"></div>
          </div>

          <div className="my-right-col">
            <div className="my-hero-photo"></div>
          </div>
        </div>
      </div>
    </div>
  );
}