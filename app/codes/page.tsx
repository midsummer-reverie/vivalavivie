"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type CodeType = {
  id: string;
  name: string;
  codeType: string;
  activityTags?: string[];
  eventTags?: string[];
  previewUrl?: string;
  isLocked: boolean;
  isCommission?: boolean; 
};

export default function CodesShowcase() {
  const [codes, setCodes] = useState<CodeType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterActivity, setFilterActivity] = useState("All");
  const [filterEvent, setFilterEvent] = useState("All"); // 🌟 1. เพิ่ม State สำหรับเก็บค่าแท็กกิจกรรมที่เลือก
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const res = await fetch('/api/codes');
        if (res.ok) {
          const data = await res.json();
          setCodes(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCodes();
  }, []);

  const nonPrivateCodes = codes.filter(c => !c.isLocked || c.isCommission);
  
  // 🌟 2. แยกดึงตัวเลือกของ Type, แท็กทั่วไป และ แท็กกิจกรรม ออกจากกัน
  const uniqueTypes = Array.from(new Set(nonPrivateCodes.map(c => c.codeType))).sort();
  const uniqueActivities = Array.from(new Set(nonPrivateCodes.flatMap(c => c.activityTags || []))).sort();
  const uniqueEvents = Array.from(new Set(nonPrivateCodes.flatMap(c => c.eventTags || []))).sort(); 

  const filteredCodes = codes.filter((code) => {
    const isPrivate = code.isLocked && !code.isCommission;

    if (isPrivate) {
      // ซ่อนจากผลการค้นหาถ้ามีการพิมพ์หรือเปลี่ยนตัวกรองใดๆ
      if (searchTerm !== "" || filterType !== "All" || filterActivity !== "All" || filterEvent !== "All") return false;
      return true; 
    }

    const matchName = code.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "All" || code.codeType === filterType;
    const matchActivity = filterActivity === "All" || (code.activityTags && code.activityTags.includes(filterActivity));
    
    // 🌟 3. เพิ่มเงื่อนไขการกรองแท็กกิจกรรม
    const matchEvent = filterEvent === "All" || (code.eventTags && code.eventTags.includes(filterEvent));
                          
    return matchName && matchType && matchActivity && matchEvent;
  });

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "712viva") {
      setShowAuthModal(false);
      setPassword("");
      setAuthError(false);
      router.push('/codes/manage'); 
    } else {
      setAuthError(true);
    }
  };

  return (
    <div 
      className="code-page-wrapper"
      style={{
        '--glass-bg': 'rgba(255, 255, 255, 0.35)',
        '--glass-border': 'rgba(255, 255, 255, 0.5)',
        '--text-dark': '#2e1065',
        '--theme-primary': '#d8b4fe',
        '--theme-secondary': '#bae6fd',
        '--radius-lg': '20px',
        '--radius-md': '12px',
      } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;600;700&display=swap');

        .code-page-wrapper {
          min-height: 100vh; margin: 0; padding: 4vw;
          font-family: 'Google Sans', sans-serif; color: var(--text-dark);
          background: radial-gradient(circle at 15% 20%, #e9d5ff 0%, transparent 50%),
                      radial-gradient(circle at 85% 80%, #bae6fd 0%, transparent 50%),
                      linear-gradient(135deg, #f3e8ff 0%, #e0f2fe 100%);
          background-attachment: fixed; overflow-x: hidden;
        }
        .code-page-wrapper * { box-sizing: border-box; }

        .page-transition { animation: pageFadeIn 0.8s ease-out forwards; opacity: 0; max-width: 1100px; margin: 0 auto; }
        @keyframes pageFadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

        .header-section { position: relative; text-align: center; margin-bottom: 40px; padding-top: 20px; }
        .main-title { font-size: 2.5rem; font-weight: 700; margin: 0; letter-spacing: -0.02em; position: relative; z-index: 10; }
        .ios-highlight { background-color: var(--theme-primary); color: #2e1065; padding: 0 6px; display: inline-block; line-height: 1.1; border-radius: 4px; }

        .img-float { position: absolute; background-size: contain; background-repeat: no-repeat; background-position: center; pointer-events: none; z-index: 1; }
        .img-1 { width: 50px; height: 50px; top: -20px; left: 22%; background-image: url('https://iili.io/COFNW1p.md.png'); animation: floatFade 5s ease-in-out infinite; }
        .img-2 { width: 60px; height: 60px; bottom: -30px; left: 28%; background-image: url('https://iili.io/COFNj2I.md.png'); animation: floatFade 6s ease-in-out infinite 1s; }
        .img-3 { width: 45px; height: 45px; top: -10px; right: 22%; background-image: url('https://iili.io/COFNw7t.md.png'); animation: floatFade 4.5s ease-in-out infinite 0.5s; }
        .img-4 { width: 40px; height: 40px; bottom: -15px; right: 26%; background-image: url('https://iili.io/COFNXrN.md.png'); animation: floatFade 7s ease-in-out infinite; }

        @keyframes floatFade {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0.85; filter: drop-shadow(0 0 0px rgba(216, 180, 254, 0)); }
          50%  { transform: translateY(-12px) rotate(6deg); opacity: 1; filter: drop-shadow(0 0 10px rgba(216, 180, 254, 0.7)); }
          100% { transform: translateY(0) rotate(0deg); opacity: 0.85; filter: drop-shadow(0 0 0px rgba(216, 180, 254, 0)); }
        }
        
        @media (max-width: 768px) {
          .main-title { font-size: 2rem; }
          .img-1 { left: 5%; } .img-2 { left: 15%; }
          .img-3 { right: 5%; } .img-4 { right: 12%; }
        }

        .toolbar {
          display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between; align-items: center;
          margin-bottom: 30px; background: rgba(255,255,255,0.3); padding: 16px;
          border-radius: var(--radius-lg); border: 1px solid var(--glass-border); backdrop-filter: blur(12px);
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.05);
        }
        .search-group { display: flex; flex-wrap: wrap; gap: 12px; flex: 1; min-width: 280px; }
        .glass-input, .glass-select {
          background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-md);
          padding: 10px 14px; font-family: inherit; font-size: 0.95rem; outline: none; transition: 0.2s; flex: 1; min-width: 140px;
          color: var(--text-dark);
        }
        .glass-input:focus, .glass-select:focus { border-color: var(--theme-primary); background: rgba(255,255,255,0.7); box-shadow: 0 0 0 3px rgba(216, 180, 254, 0.3); }

        .glass-btn-primary {
          background: linear-gradient(135deg, #e9d5ff, #bae6fd); border: 1px solid rgba(255,255,255,0.8); border-radius: var(--radius-md);
          padding: 10px 20px; cursor: pointer; font-weight: 700; font-family: 'Google Sans'; transition: 0.2s; color: var(--text-dark);
          box-shadow: 0 4px 12px rgba(216, 180, 254, 0.3);
        }
        .glass-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(216, 180, 254, 0.5); }

        .code-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 24px; padding-bottom: 40px; }

        @keyframes cardEnter { 0% { opacity: 0; transform: translateY(25px); } 100% { opacity: 1; transform: translateY(0); } }

        .code-card {
          border-radius: var(--radius-md); border: 1px solid var(--glass-border);
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.08); overflow: hidden; 
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          display: flex; flex-direction: column; cursor: pointer; text-decoration: none;
          background: rgba(255,255,255,0.5); backdrop-filter: blur(8px);
          opacity: 0; animation: cardEnter 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .code-card:hover { transform: translateY(-6px); box-shadow: 0 16px 32px rgba(139, 92, 246, 0.15); background: rgba(255,255,255,0.7); }

        .card-preview { width: 100%; aspect-ratio: 4/3; background: #e2e8f0; position: relative; overflow: hidden; }
        .card-preview img { width: 100%; height: 100%; object-fit: cover; transition: 0.4s; }
        .code-card:hover .card-preview img { transform: scale(1.05); }
        
        .is-private .card-preview img { filter: blur(12px) brightness(0.7); transform: scale(1.1); }
        .is-private:hover .card-preview img { transform: scale(1.1); }
        .lock-icon-overlay {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          font-size: 3rem; color: rgba(255,255,255,0.9); text-shadow: 0 4px 12px rgba(0,0,0,0.5); z-index: 2;
        }

        .card-info { padding: 16px; flex: 1; display: flex; flex-direction: column; }
        .code-name { font-size: 1.2rem; font-weight: 700; margin: 0 0 10px 0; color: var(--text-dark); line-height: 1.3; }
        .censored-name { color: #6b21a8; font-family: monospace; letter-spacing: 2px; }
        
        .tags-container { display: flex; flex-wrap: wrap; gap: 6px; align-items: flex-start; }
        .tag-type { background: rgba(216, 180, 254, 0.5); color: #4c1d95; font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 12px; }
        .tag-activity { background: rgba(255, 255, 255, 0.6); color: #4c1d95; font-size: 0.7rem; font-weight: 600; padding: 4px 10px; border-radius: 12px; border: 1px solid rgba(216, 180, 254, 0.4); }
        .tag-event { background: #f59e0b; color: #fff; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 12px; box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3); } 
        .tag-commission { background: #fef08a; color: #854d0e; font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 12px; }

        .back-btn {
          display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; text-decoration: none; color: var(--text-dark);
          font-weight: 600; font-size: 0.95rem; background: var(--glass-bg); border: 1px solid var(--glass-border);
          padding: 8px 16px; border-radius: var(--radius-md); backdrop-filter: blur(8px); transition: 0.2s;
        }
        .back-btn:hover { background: rgba(255,255,255,0.8); transform: translateX(-4px); }
        .empty-state { text-align: center; padding: 40px; color: #6b21a8; font-weight: 500; grid-column: 1 / -1; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(46, 16, 101, 0.3); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 100; animation: fadeIn 0.3s; }
        .modal-content { background: rgba(255, 255, 255, 0.85); padding: 32px; border-radius: var(--radius-lg); width: 90%; max-width: 400px; text-align: center; border: 1px solid var(--glass-border); box-shadow: 0 20px 40px rgba(46, 16, 101, 0.2); }
        .modal-title { margin: 0 0 16px; font-weight: 700; font-size: 1.5rem; color: var(--text-dark); }
        .modal-input { width: 100%; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--theme-primary); margin-bottom: 16px; text-align: center; font-size: 1rem; outline: none; background: rgba(255,255,255,0.9); }
        .modal-input:focus { box-shadow: 0 0 0 3px rgba(216, 180, 254, 0.4); }
        .btn-cancel { background: rgba(255,255,255,0.5); border: 1px solid var(--theme-primary); padding: 10px 20px; border-radius: var(--radius-md); cursor: pointer; font-weight: 600; color: var(--text-dark); }
        .error-msg { color: #e11d48; font-size: 0.85rem; margin-top: -10px; margin-bottom: 16px; font-weight: 600; }
        @keyframes fadeIn { to { opacity: 1; } }
      `}} />

      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">🔒 Admin Login</h2>
            <p style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#6b21a8' }}>กรุณาใส่รหัสผ่านเพื่อจัดการโค้ด</p>
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
            code <span className="ios-highlight">showcase</span>
          </h1>
          <p style={{ color: '#6b21a8', marginTop: '10px', position: 'relative', zIndex: 10, fontWeight: 500 }}>คลังรวบรวมผลงานโค้ด</p>
        </div>

        <div className="toolbar">
          <div className="search-group">
            <input 
              type="text" placeholder="Search by name..." className="glass-input"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select className="glass-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="All">All Types</option>
              {uniqueTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <select className="glass-select" value={filterActivity} onChange={(e) => setFilterActivity(e.target.value)}>
              <option value="All">🏷️ All Tags</option>
              {uniqueActivities.map(act => <option key={act} value={act}>{act}</option>)}
            </select>
            {/* 🌟 4. เพิ่ม Dropdown สำหรับกรอง แท็กกิจกรรม โดยเฉพาะ */}
            <select className="glass-select" value={filterEvent} onChange={(e) => setFilterEvent(e.target.value)}>
              <option value="All">🌻 All Events</option>
              {uniqueEvents.map(evt => <option key={evt} value={evt}>{evt}</option>)}
            </select>
          </div>
          <button onClick={() => setShowAuthModal(true)} className="glass-btn-primary">+ Manage</button>
        </div>

        <div className="code-grid">
          {filteredCodes.length > 0 ? (
            filteredCodes.map((code, index) => {
              const bgImageUrl = code.previewUrl || "https://iili.io/CNQcH1j.md.png";
              
              const isPrivate = code.isLocked && !code.isCommission;
              const isCommission = code.isLocked && code.isCommission;

              return (
                <Link 
                  href={`/codes/${code.id}`}
                  className={`code-card ${isPrivate ? 'is-private' : ''}`} 
                  key={code.id}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="card-preview">
                    {isPrivate && <div className="lock-icon-overlay">🔒</div>}
                    <img src={bgImageUrl} alt={isPrivate ? 'Private Preview' : code.name} loading="lazy" />
                  </div>
                  
                  <div className="card-info">
                    {isPrivate ? (
                      <h3 className="code-name censored-name">████████</h3>
                    ) : (
                      <h3 className="code-name">{code.name}</h3>
                    )}
                    
                    {!isPrivate && (
                      <div className="tags-container">
                        <span className="tag-type">{code.codeType}</span>
                        {isCommission && <span className="tag-commission">💎 Private</span>}
                        {code.eventTags && code.eventTags.map((tag, i) => (
                          <span key={`evt_${i}`} className="tag-event">🌻 {tag}</span>
                        ))}
                        {code.activityTags && code.activityTags.map((tag, i) => (
                          <span key={`act_${i}`} className="tag-activity">🏷️ {tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="empty-state">ไม่พบโค้ดที่ตรงกับการค้นหา 😥</div>
          )}
        </div>
      </div>
    </div>
  );
}