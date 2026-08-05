"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 🌟 เปลี่ยน Type ให้เข้ากับระบบเทมเพลตรูปภาพ
type TemplateType = {
  id: string;
  name: string;
  category: string;
  tags?: string[];
  previewUrl?: string;
  isLocked: boolean;
};

export default function ImgEditorHome() {
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterTag, setFilterTag] = useState("All");
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/templates'); // 🔗 รอเชื่อม Neon DB
        if (res.ok) {
          const data = await res.json();
          setTemplates(data);
        } else {
          // Fallback Mockup Data (ไว้โชว์ UI ระหว่างรอทำ DB)
          setTemplates([
            { id: '1', name: 'Profile Card', category: 'Profile', tags: ['Cute', 'ID'], previewUrl: 'https://iili.io/CNQcH1j.md.png', isLocked: false },
            { id: '2', name: 'Event Banner', category: 'Banner', tags: ['Event'], isLocked: false },
            { id: '3', name: 'Secret Frame', category: 'Frame', tags: ['Premium'], isLocked: true }
          ]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchTemplates();
  }, []);

  const nonPrivateTemplates = templates.filter(t => !t.isLocked);
  
  const uniqueCategories = Array.from(new Set(nonPrivateTemplates.map(t => t.category))).sort();
  const uniqueTags = Array.from(new Set(nonPrivateTemplates.flatMap(t => t.tags || []))).sort();

  const filteredTemplates = templates.filter((tpl) => {
    if (tpl.isLocked) {
      if (searchTerm !== "" || filterCategory !== "All" || filterTag !== "All") return false;
      return true; 
    }

    const matchName = tpl.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === "All" || tpl.category === filterCategory;
    const matchTag = filterTag === "All" || (tpl.tags && tpl.tags.includes(filterTag));
                          
    return matchName && matchCategory && matchTag;
  });

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "712069") {
      setShowAuthModal(false);
      setPassword("");
      setAuthError(false);
      router.push('/imgeditor/manage'); // 🔗 เปลี่ยน path ไปหน้าเพิ่มเทมเพลต
    } else {
      setAuthError(true);
    }
  };

  return (
    <div 
      className="imgeditor-page-wrapper"
      style={{
        '--glass-bg': 'rgba(255, 255, 255, 0.45)',
        '--glass-border': 'rgba(255, 255, 255, 0.6)',
        '--text-dark': '#831843', /* สีแดงอมชมพูเข้ม */
        '--theme-primary': '#fbcfe8', /* สีชมพูพาสเทล */
        '--theme-secondary': '#fef08a', /* สีเหลืองพาสเทล */
        '--radius-lg': '24px',
        '--radius-md': '14px',
      } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;600;700&display=swap');

        .imgeditor-page-wrapper {
          min-height: 100vh; margin: 0; padding: 4vw;
          font-family: 'Google Sans', sans-serif; color: var(--text-dark);
          /* 🎀 พื้นหลัง Gradient ชมพู-เหลืองพีช */
          background: radial-gradient(circle at 15% 20%, #fce7f3 0%, transparent 50%),
                      radial-gradient(circle at 85% 80%, #fef08a 0%, transparent 50%),
                      linear-gradient(135deg, #fff1f2 0%, #ffedd5 100%);
          background-attachment: fixed; overflow-x: hidden;
        }
        .imgeditor-page-wrapper * { box-sizing: border-box; }

        .page-transition { animation: pageFadeIn 0.8s ease-out forwards; opacity: 0; max-width: 1100px; margin: 0 auto; }
        @keyframes pageFadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

        .header-section { position: relative; text-align: center; margin-bottom: 40px; padding-top: 20px; }
        .main-title { font-size: 3rem; font-weight: 700; margin: 0; letter-spacing: -0.02em; position: relative; z-index: 10; color: #be123c; }
        .ios-highlight { background-color: var(--theme-secondary); color: #9a3412; padding: 0 10px; display: inline-block; line-height: 1.1; border-radius: 8px; box-shadow: 0 4px 10px rgba(254, 240, 138, 0.5); }

        .img-float { position: absolute; background-size: contain; background-repeat: no-repeat; background-position: center; pointer-events: none; z-index: 1; }
        .img-1 { width: 50px; height: 50px; top: -20px; left: 22%; background-image: url('https://iili.io/COFNW1p.md.png'); animation: floatFade 5s ease-in-out infinite; }
        .img-2 { width: 60px; height: 60px; bottom: -30px; left: 28%; background-image: url('https://iili.io/COFNj2I.md.png'); animation: floatFade 6s ease-in-out infinite 1s; }
        .img-3 { width: 45px; height: 45px; top: -10px; right: 22%; background-image: url('https://iili.io/COFNw7t.md.png'); animation: floatFade 4.5s ease-in-out infinite 0.5s; }
        .img-4 { width: 40px; height: 40px; bottom: -15px; right: 26%; background-image: url('https://iili.io/COFNXrN.md.png'); animation: floatFade 7s ease-in-out infinite; }

        @keyframes floatFade {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0.85; filter: drop-shadow(0 0 0px rgba(244, 114, 182, 0)); }
          50%  { transform: translateY(-12px) rotate(6deg); opacity: 1; filter: drop-shadow(0 0 12px rgba(244, 114, 182, 0.4)); }
          100% { transform: translateY(0) rotate(0deg); opacity: 0.85; filter: drop-shadow(0 0 0px rgba(244, 114, 182, 0)); }
        }
        
        @media (max-width: 768px) {
          .main-title { font-size: 2.2rem; }
          .img-1 { left: 5%; } .img-2 { left: 15%; }
          .img-3 { right: 5%; } .img-4 { right: 12%; }
        }

        .toolbar {
          display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between; align-items: center;
          margin-bottom: 30px; background: rgba(255,255,255,0.4); padding: 16px;
          border-radius: var(--radius-lg); border: 1px solid var(--glass-border); backdrop-filter: blur(12px);
          box-shadow: 0 4px 16px rgba(244, 114, 182, 0.1);
        }
        .search-group { display: flex; flex-wrap: wrap; gap: 12px; flex: 1; min-width: 280px; }
        .glass-input, .glass-select {
          background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-md);
          padding: 10px 14px; font-family: inherit; font-size: 0.95rem; outline: none; transition: 0.2s; flex: 1; min-width: 140px;
          color: var(--text-dark); font-weight: 500;
        }
        .glass-input:focus, .glass-select:focus { border-color: #f472b6; background: rgba(255,255,255,0.8); box-shadow: 0 0 0 3px rgba(244, 114, 182, 0.25); }

        .glass-btn-primary {
          background: linear-gradient(135deg, #fbcfe8, #fef08a); border: 1px solid rgba(255,255,255,0.8); border-radius: var(--radius-md);
          padding: 10px 20px; cursor: pointer; font-weight: 700; font-family: 'Google Sans'; transition: 0.2s; color: #9f1239;
          box-shadow: 0 4px 12px rgba(244, 114, 182, 0.3);
        }
        .glass-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(244, 114, 182, 0.5); background: linear-gradient(135deg, #f9a8d4, #fde047); }

        .code-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 24px; padding-bottom: 40px; }

        @keyframes cardEnter { 0% { opacity: 0; transform: translateY(25px); } 100% { opacity: 1; transform: translateY(0); } }

        .code-card {
          border-radius: var(--radius-lg); border: 2px solid var(--glass-border);
          box-shadow: 0 10px 25px rgba(244, 114, 182, 0.1); overflow: hidden; 
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          display: flex; flex-direction: column; cursor: pointer; text-decoration: none;
          background: rgba(255,255,255,0.6); backdrop-filter: blur(8px);
          opacity: 0; animation: cardEnter 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .code-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(244, 114, 182, 0.2); background: rgba(255,255,255,0.8); border-color: #fbcfe8; }

        .card-preview { width: 100%; aspect-ratio: 4/3; background: linear-gradient(to bottom right, #fdf2f8, #fefce8); position: relative; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.5); }
        .card-preview img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .code-card:hover .card-preview img { transform: scale(1.08) rotate(-1deg); }
        
        .is-private .card-preview img { filter: blur(14px) brightness(0.85); transform: scale(1.15); }
        .is-private:hover .card-preview img { transform: scale(1.15); }
        .lock-icon-overlay {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          font-size: 3.5rem; color: rgba(255,255,255,1); text-shadow: 0 4px 15px rgba(225, 29, 72, 0.4); z-index: 2;
        }

        .card-info { padding: 18px; flex: 1; display: flex; flex-direction: column; }
        .code-name { font-size: 1.25rem; font-weight: 700; margin: 0 0 12px 0; color: #be123c; line-height: 1.3; }
        .censored-name { color: #f472b6; font-family: monospace; letter-spacing: 2px; }
        
        .tags-container { display: flex; flex-wrap: wrap; gap: 8px; align-items: flex-start; }
        .tag-type { background: #fbcfe8; color: #831843; font-size: 0.75rem; font-weight: 700; padding: 5px 12px; border-radius: 12px; }
        .tag-activity { background: #fef08a; color: #9a3412; font-size: 0.75rem; font-weight: 700; padding: 5px 12px; border-radius: 12px; border: 1px solid rgba(253, 224, 71, 0.4); }

        .back-btn {
          display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; text-decoration: none; color: #be123c;
          font-weight: 700; font-size: 0.95rem; background: var(--glass-bg); border: 2px solid var(--glass-border);
          padding: 8px 18px; border-radius: 20px; backdrop-filter: blur(8px); transition: 0.3s;
        }
        .back-btn:hover { background: rgba(255,255,255,0.9); transform: translateX(-5px); border-color: #fbcfe8; }
        .empty-state { text-align: center; padding: 50px; color: #be123c; font-weight: 600; grid-column: 1 / -1; font-size: 1.1rem; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(131, 24, 67, 0.2); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 100; animation: fadeIn 0.3s; }
        .modal-content { background: rgba(255, 255, 255, 0.9); padding: 35px; border-radius: var(--radius-lg); width: 90%; max-width: 400px; text-align: center; border: 2px solid #fbcfe8; box-shadow: 0 20px 50px rgba(225, 29, 72, 0.15); }
        .modal-title { margin: 0 0 16px; font-weight: 700; font-size: 1.6rem; color: #be123c; }
        .modal-input { width: 100%; padding: 14px; border-radius: var(--radius-md); border: 2px solid #fbcfe8; margin-bottom: 16px; text-align: center; font-size: 1.1rem; outline: none; background: rgba(255,255,255,0.9); color: #831843; font-weight: 600; font-family: 'Google Sans'; }
        .modal-input:focus { border-color: #f472b6; box-shadow: 0 0 0 4px rgba(244, 114, 182, 0.2); }
        .btn-cancel { background: rgba(255,255,255,0.5); border: 2px solid #fbcfe8; padding: 10px 20px; border-radius: var(--radius-md); cursor: pointer; font-weight: 700; color: #be123c; transition: 0.2s; }
        .btn-cancel:hover { background: #fff1f2; }
        .error-msg { color: #e11d48; font-size: 0.9rem; margin-top: -10px; margin-bottom: 16px; font-weight: 700; }
        @keyframes fadeIn { to { opacity: 1; } }
      `}} />

      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">🔒 Admin Login</h2>
            <p style={{ marginBottom: '20px', fontSize: '0.95rem', color: '#9f1239', fontWeight: 500 }}>กรุณาใส่รหัสผ่านเพื่อจัดการเทมเพลต</p>
            <form onSubmit={handleAuthSubmit}>
              <input type="password" className="modal-input" placeholder="Enter password..." value={password} onChange={(e) => { setPassword(e.target.value); setAuthError(false); }} autoFocus />
              {authError && <div className="error-msg">❌ รหัสผ่านไม่ถูกต้อง</div>}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button type="button" className="btn-cancel" onClick={() => setShowAuthModal(false)}>Cancel</button>
                <button type="submit" className="glass-btn-primary">Unlock</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="page-transition">
        <Link href="/" className="back-btn">← back to home</Link>

        <div className="header-section">
          <div className="img-float img-1" />
          <div className="img-float img-2" />
          <div className="img-float img-3" />
          <div className="img-float img-4" />
          
          <h1 className="main-title">
            image <span className="ios-highlight">editor</span>
          </h1>
          <p style={{ color: '#9f1239', marginTop: '12px', position: 'relative', zIndex: 10, fontWeight: 600, fontSize: '1.1rem' }}>
            คลังเทมเพลตรูป 2:5 และแบนเนอร์
          </p>
        </div>

        <div className="toolbar">
          <div className="search-group">
            <input 
              type="text" placeholder="ค้นหาชื่อเทมเพลต..." className="glass-input"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select className="glass-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="All">All Categories</option>
              {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select className="glass-select" value={filterTag} onChange={(e) => setFilterTag(e.target.value)}>
              <option value="All">🏷️ All Tags</option>
              {uniqueTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
          </div>
          <button onClick={() => setShowAuthModal(true)} className="glass-btn-primary">+ Manage</button>
        </div>

        <div className="code-grid">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((tpl, index) => {
              const bgImageUrl = tpl.previewUrl || "https://iili.io/CNQcH1j.md.png";
              const isPrivate = tpl.isLocked;

              return (
                <Link 
                  href={`/imgeditor/${tpl.id}`}
                  className={`code-card ${isPrivate ? 'is-private' : ''}`} 
                  key={tpl.id}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="card-preview">
                    {isPrivate && <div className="lock-icon-overlay">🔒</div>}
                    <img src={bgImageUrl} alt={isPrivate ? 'Private Preview' : tpl.name} loading="lazy" />
                  </div>
                  
                  <div className="card-info">
                    {isPrivate ? (
                      <h3 className="code-name censored-name">████████</h3>
                    ) : (
                      <h3 className="code-name">{tpl.name}</h3>
                    )}
                    
                    {!isPrivate && (
                      <div className="tags-container">
                        <span className="tag-type">{tpl.category}</span>
                        {tpl.tags && tpl.tags.map((tag, i) => (
                          <span key={`act_${i}`} className="tag-activity">🏷️ {tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="empty-state">ไม่พบเทมเพลตที่ตรงกับการค้นหา 😥</div>
          )}
        </div>
      </div>
    </div>
  );
}