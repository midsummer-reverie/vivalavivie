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
  likes?: number; 
};

type FilterState = {
  sort: "Newest" | "Popular";
  liked: "All" | "LikedOnly";
  visibility: "Default" | "PublicOnly" | "CommissionOnly" | "PrivateOnly";
  type: string;
  event: string;
  activity: string;
};

const DEFAULT_FILTERS: FilterState = {
  sort: "Newest",
  liked: "All",
  visibility: "Default",
  type: "All",
  event: "All",
  activity: "All"
};

export default function CodesShowcase() {
  const [codes, setCodes] = useState<CodeType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 🌟 State สำหรับระบบตัวกรองขั้นสูง
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  const [likedCodes, setLikedCodes] = useState<string[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const res = await fetch('/api/codes');
        if (res.ok) setCodes(await res.json());
      } catch (error) { console.error("Error fetching data:", error); }
    };
    fetchCodes();
    
    const savedLikes = localStorage.getItem('user_liked_codes');
    if (savedLikes) setLikedCodes(JSON.parse(savedLikes));
  }, []);

  // ดึงตัวเลือกสำหรับ Dropdown
  const nonPrivateCodes = codes.filter(c => !c.isLocked || c.isCommission);
  const uniqueTypes = Array.from(new Set(nonPrivateCodes.map(c => c.codeType))).sort();
  const uniqueActivities = Array.from(new Set(nonPrivateCodes.flatMap(c => c.activityTags || []))).sort();
  const uniqueEvents = Array.from(new Set(nonPrivateCodes.flatMap(c => c.eventTags || []))).sort(); 

  // นับว่ามีการเปิดใช้งานตัวกรองกี่อัน (เพื่อโชว์จุดแจ้งเตือนบนปุ่ม)
  const activeFiltersCount = Object.keys(filters).filter(k => {
    const key = k as keyof FilterState;
    return filters[key] !== DEFAULT_FILTERS[key];
  }).length;

  // 🌟 ตรรกะการกรองข้อมูลแบบละเอียด
  let filteredCodes = codes.filter((code) => {
    const isPrivate = code.isLocked && !code.isCommission;
    const isCommission = code.isLocked && code.isCommission;
    const isPublic = !code.isLocked;

    // 1. กรองจากคำค้นหา (Search)
    if (searchTerm && !code.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;

    // 2. กรองจากสถานะโค้ด (Visibility)
    if (filters.visibility === "PublicOnly" && !isPublic) return false;
    if (filters.visibility === "CommissionOnly" && !isCommission) return false;
    if (filters.visibility === "PrivateOnly" && !isPrivate) return false;
    if (filters.visibility === "Default" && isPrivate) {
      // ถ้าเป็นโหมด Default (ปกติ): โค้ดส่วนตัวจะโชว์ก็ต่อเมื่อ "ไม่ได้พิมพ์ค้นหา หรือเลือกตัวกรองใดๆ เลย"
      if (searchTerm !== "" || filters.type !== "All" || filters.event !== "All" || filters.activity !== "All" || filters.liked === "LikedOnly") {
        return false;
      }
    }

    // 3. กรองจากประเภทและแท็ก
    if (filters.type !== "All" && code.codeType !== filters.type) return false;
    if (filters.activity !== "All" && !(code.activityTags && code.activityTags.includes(filters.activity))) return false;
    if (filters.event !== "All" && !(code.eventTags && code.eventTags.includes(filters.event))) return false;

    // 4. กรองจากรายการที่ถูกใจ
    if (filters.liked === "LikedOnly" && !likedCodes.includes(code.id)) return false;

    return true;
  });

  // 🌟 การเรียงลำดับ
  if (filters.sort === "Popular") {
    filteredCodes.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else {
    // Newest คือลำดับเดิมที่ fetch มา (สมมติว่า backend เรียงมาให้แล้ว)
  }

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "712069") {
      setShowAuthModal(false); setPassword(""); setAuthError(false);
      router.push('/codes/manage'); 
    } else { setAuthError(true); }
  };

  const handleLike = async (e: React.MouseEvent, codeId: string) => {
    e.preventDefault(); 
    e.stopPropagation();

    // เช็กว่าตอนนี้เคยกดไลก์ไว้หรือยัง
    const isLiked = likedCodes.includes(codeId);
    const action = isLiked ? 'unlike' : 'like';

    // 1. อัปเดต LocalStorage ว่าไลก์หรือถอนไลก์
    let newLikedCodes;
    if (isLiked) {
      newLikedCodes = likedCodes.filter(id => id !== codeId); // ถอนไลก์ (เอา id ออก)
    } else {
      newLikedCodes = [...likedCodes, codeId]; // กดไลก์ (เพิ่ม id เข้าไป)
    }
    setLikedCodes(newLikedCodes);
    localStorage.setItem('user_liked_codes', JSON.stringify(newLikedCodes));

    // 2. อัปเดต UI ตัวเลขโชว์ให้ผู้ใช้เห็นทันที (Optimistic UI)
    setCodes(prev => prev.map(c => {
      if (c.id === codeId) {
        const currentLikes = c.likes || 0;
        // ถ้าถอนไลก์ให้ลบ 1 (โดยไม่ต่ำกว่า 0) ถ้ากดไลก์ให้บวก 1
        return { ...c, likes: isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1 };
      }
      return c;
    }));

    // 3. ยิงไปบอก API ว่าให้ +1 หรือ -1
    try {
      await fetch(`/api/codes/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: codeId, action }) // ส่ง action ไปบอก Backend ด้วย
      });
    } catch (err) {
      console.error("Failed to update like in DB", err);
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

        .code-page-wrapper { min-height: 100vh; margin: 0; padding: 4vw; font-family: 'Google Sans', sans-serif; color: var(--text-dark); background: radial-gradient(circle at 15% 20%, #e9d5ff 0%, transparent 50%), radial-gradient(circle at 85% 80%, #bae6fd 0%, transparent 50%), linear-gradient(135deg, #f3e8ff 0%, #e0f2fe 100%); background-attachment: fixed; overflow-x: hidden; }
        .code-page-wrapper * { box-sizing: border-box; }
        input, select, textarea, button { font-family: 'Google Sans', sans-serif !important; }

        .page-transition { animation: pageFadeIn 0.8s ease-out forwards; opacity: 0; max-width: 1200px; margin: 0 auto; }
        @keyframes pageFadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

        .header-section { position: relative; text-align: center; margin-bottom: 40px; padding-top: 20px; }
        .main-title { font-size: 2.5rem; font-weight: 700; margin: 0; letter-spacing: -0.02em; position: relative; z-index: 10; }
        .ios-highlight { background-color: var(--theme-primary); color: #2e1065; padding: 0 6px; display: inline-block; line-height: 1.1; border-radius: 4px; }
        
        .img-float { position: absolute; background-size: contain; background-repeat: no-repeat; background-position: center; pointer-events: none; z-index: 1; }
        .img-1 { width: 50px; height: 50px; top: -20px; left: 22%; background-image: url('https://iili.io/COFNW1p.md.png'); animation: floatFade 5s ease-in-out infinite; }
        .img-2 { width: 60px; height: 60px; bottom: -30px; left: 28%; background-image: url('https://iili.io/COFNj2I.md.png'); animation: floatFade 6s ease-in-out infinite 1s; }
        .img-3 { width: 45px; height: 45px; top: -10px; right: 22%; background-image: url('https://iili.io/COFNw7t.md.png'); animation: floatFade 4.5s ease-in-out infinite 0.5s; }
        .img-4 { width: 40px; height: 40px; bottom: -15px; right: 26%; background-image: url('https://iili.io/COFNXrN.md.png'); animation: floatFade 7s ease-in-out infinite; }

        @keyframes floatFade { 0% { transform: translateY(0) rotate(0deg); opacity: 0.85; filter: drop-shadow(0 0 0px rgba(216, 180, 254, 0)); } 50% { transform: translateY(-12px) rotate(6deg); opacity: 1; filter: drop-shadow(0 0 10px rgba(216, 180, 254, 0.7)); } 100% { transform: translateY(0) rotate(0deg); opacity: 0.85; filter: drop-shadow(0 0 0px rgba(216, 180, 254, 0)); } }
        @media (max-width: 768px) { .main-title { font-size: 2rem; } .img-1 { left: 5%; } .img-2 { left: 15%; } .img-3 { right: 5%; } .img-4 { right: 12%; } }

        /* 🌟 Toolbar ฉบับคลีน */
        .toolbar { display: flex; gap: 12px; margin-bottom: 30px; background: rgba(255,255,255,0.4); padding: 12px; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); backdrop-filter: blur(12px); box-shadow: 0 4px 16px rgba(139, 92, 246, 0.05); align-items: center; }
        .search-wrapper { flex: 1; position: relative; }
        .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 1.2rem; opacity: 0.5; }
        .glass-input-search { width: 100%; background: rgba(255,255,255,0.6); border: 1px solid var(--glass-border); border-radius: 14px; padding: 12px 14px 12px 42px; font-size: 1rem; outline: none; transition: 0.2s; color: var(--text-dark); }
        .glass-input-search:focus { border-color: var(--theme-primary); background: rgba(255,255,255,0.9); box-shadow: 0 0 0 3px rgba(216, 180, 254, 0.3); }

        .filter-btn { position: relative; background: #fff; border: 1px solid var(--theme-primary); border-radius: 14px; padding: 12px 20px; font-weight: 700; color: #4c1d95; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 8px; font-size: 1rem; }
        .filter-btn:hover { background: #f3e8ff; box-shadow: 0 4px 12px rgba(216, 180, 254, 0.4); transform: translateY(-2px); }
        .filter-badge { position: absolute; top: -6px; right: -6px; background: #ef4444; color: white; font-size: 0.75rem; font-weight: bold; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        
        .manage-btn { background: linear-gradient(135deg, #e9d5ff, #bae6fd); border: 1px solid rgba(255,255,255,0.8); border-radius: 14px; padding: 12px; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 12px rgba(216, 180, 254, 0.3); font-size: 1.2rem; display: flex; align-items: center; justify-content: center; }
        .manage-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(216, 180, 254, 0.5); filter: brightness(1.05); }

        @media (max-width: 600px) {
          .toolbar { flex-wrap: wrap; }
          .search-wrapper { min-width: 100%; }
          .filter-btn { flex: 1; justify-content: center; }
          .manage-btn { flex: 0 0 auto; }
        }

        /* 🌟 ระบบตัวกรองแบบ Modal (AO3 Style) */
        .filter-modal-overlay { position: fixed; inset: 0; background: rgba(46, 16, 101, 0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 200; animation: fadeIn 0.2s; padding: 20px; }
        .filter-modal-content { background: #faf5ff; width: 100%; max-width: 500px; max-height: 90vh; border-radius: 24px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 24px 48px rgba(46, 16, 101, 0.2); border: 1px solid rgba(216, 180, 254, 0.8); }
        .filter-modal-header { padding: 20px 24px; border-bottom: 1px solid rgba(216, 180, 254, 0.5); display: flex; justify-content: space-between; align-items: center; background: #fff; }
        .filter-modal-title { font-size: 1.25rem; font-weight: 700; color: #4c1d95; margin: 0; display: flex; align-items: center; gap: 8px; }
        .filter-close-btn { background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: #9ca3af; transition: 0.2s; }
        .filter-close-btn:hover { color: #ef4444; }
        
        .filter-modal-body { padding: 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 20px; }
        .filter-group { display: flex; flex-direction: column; gap: 8px; }
        .filter-label { font-size: 0.9rem; font-weight: 700; color: #6b21a8; }
        .filter-select { background: #fff; border: 1px solid #d8b4fe; border-radius: 10px; padding: 10px 14px; font-size: 0.95rem; color: #2e1065; outline: none; cursor: pointer; transition: 0.2s; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); }
        .filter-select:focus { border-color: #a855f7; box-shadow: 0 0 0 3px rgba(216, 180, 254, 0.3); }

        .filter-modal-footer { padding: 16px 24px; background: #fff; border-top: 1px solid rgba(216, 180, 254, 0.5); display: flex; gap: 12px; }
        .btn-reset { flex: 1; background: #f3f4f6; border: 1px solid #d1d5db; color: #4b5563; padding: 12px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .btn-reset:hover { background: #e5e7eb; }
        .btn-apply { flex: 2; background: #a855f7; border: none; color: #fff; padding: 12px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3); }
        .btn-apply:hover { background: #9333ea; box-shadow: 0 6px 16px rgba(168, 85, 247, 0.4); }

        /* การ์ดและอื่นๆ */
        .code-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; padding-bottom: 40px; }
        @keyframes cardEnter { 0% { opacity: 0; transform: translateY(25px); } 100% { opacity: 1; transform: translateY(0); } }

        .code-card { border-radius: var(--radius-md); border: 1px solid var(--glass-border); box-shadow: 0 4px 20px rgba(139, 92, 246, 0.08); overflow: hidden; transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1); display: flex; flex-direction: column; cursor: pointer; text-decoration: none; background: rgba(255,255,255,0.5); backdrop-filter: blur(8px); opacity: 0; animation: cardEnter 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; position: relative; }
        .code-card:hover { transform: translateY(-6px); box-shadow: 0 16px 32px rgba(139, 92, 246, 0.15); background: rgba(255,255,255,0.7); }

        .card-preview { width: 100%; aspect-ratio: 4/3; background: #e2e8f0; position: relative; overflow: hidden; }
        .card-preview img { width: 100%; height: 100%; object-fit: cover; transition: 0.4s; }
        .code-card:hover .card-preview img { transform: scale(1.05); }
        .is-private .card-preview img { filter: blur(12px) brightness(0.7); transform: scale(1.1); }
        .is-private:hover .card-preview img { transform: scale(1.1); }
        .lock-icon-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: rgba(255,255,255,0.9); text-shadow: 0 4px 12px rgba(0,0,0,0.5); z-index: 2; }

        .like-btn { position: absolute; top: 12px; right: 12px; z-index: 3; background: rgba(255,255,255,0.85); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.5); border-radius: 20px; padding: 6px 12px; font-weight: 700; font-size: 0.85rem; color: #4c1d95; display: flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.05); transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .like-btn:hover { background: #fff; transform: scale(1.05); }
        .like-btn.liked { color: #e11d48; }
        .like-btn.liked .heart-icon { animation: heartPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes heartPop { 0% { transform: scale(1); } 50% { transform: scale(1.4); } 100% { transform: scale(1); } }

        .card-info { padding: 16px; flex: 1; display: flex; flex-direction: column; }
        .code-name { font-size: 1.2rem; font-weight: 700; margin: 0 0 10px 0; color: var(--text-dark); line-height: 1.3; }
        .censored-name { color: #6b21a8; font-family: monospace; letter-spacing: 2px; }
        .tags-container { display: flex; flex-wrap: wrap; gap: 6px; align-items: flex-start; }
        .tag-type { background: rgba(216, 180, 254, 0.5); color: #4c1d95; font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 12px; }
        .tag-activity { background: rgba(255, 255, 255, 0.6); color: #4c1d95; font-size: 0.7rem; font-weight: 600; padding: 4px 10px; border-radius: 12px; border: 1px solid rgba(216, 180, 254, 0.4); }
        .tag-event { background: #f59e0b; color: #fff; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 12px; box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3); } 
        .tag-commission { background: #fef08a; color: #854d0e; font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 12px; }

        .back-btn { display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; text-decoration: none; color: var(--text-dark); font-weight: 600; font-size: 0.95rem; background: var(--glass-bg); border: 1px solid var(--glass-border); padding: 8px 16px; border-radius: var(--radius-md); backdrop-filter: blur(8px); transition: 0.2s; }
        .back-btn:hover { background: rgba(255,255,255,0.8); transform: translateX(-4px); }
        .empty-state { text-align: center; padding: 40px; color: #6b21a8; font-weight: 500; grid-column: 1 / -1; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(46, 16, 101, 0.3); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 100; animation: fadeIn 0.3s; padding: 20px; }
        .modal-content { background: rgba(255, 255, 255, 0.85); padding: 32px; border-radius: var(--radius-lg); width: 100%; max-width: 400px; text-align: center; border: 1px solid var(--glass-border); box-shadow: 0 20px 40px rgba(46, 16, 101, 0.2); }
        .modal-title { margin: 0 0 16px; font-weight: 700; font-size: 1.5rem; color: var(--text-dark); }
        .modal-input { width: 100%; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--theme-primary); margin-bottom: 16px; text-align: center; font-size: 1rem; outline: none; background: rgba(255,255,255,0.9); }
        .modal-input:focus { box-shadow: 0 0 0 3px rgba(216, 180, 254, 0.4); }
        .btn-cancel { background: rgba(255,255,255,0.5); border: 1px solid var(--theme-primary); padding: 10px 20px; border-radius: var(--radius-md); cursor: pointer; font-weight: 600; color: var(--text-dark); }
        .error-msg { color: #e11d48; font-size: 0.85rem; margin-top: -10px; margin-bottom: 16px; font-weight: 600; }
        @keyframes fadeIn { to { opacity: 1; } }
      `}} />

      {/* 🔒 Admin Login Modal */}
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
                <button type="submit" className="manage-btn" style={{ padding: '10px 20px', fontSize: '1rem' }}>Unlock</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🎛️ Advanced Filter Modal (AO3 Style) */}
      {showFilterModal && (
        <div className="filter-modal-overlay" onClick={() => setShowFilterModal(false)}>
          <div className="filter-modal-content" onClick={e => e.stopPropagation()}>
            <div className="filter-modal-header">
              <h2 className="filter-modal-title">🎛️ ตัวกรองข้อมูล</h2>
              <button className="filter-close-btn" onClick={() => setShowFilterModal(false)}>✕</button>
            </div>
            
            <div className="filter-modal-body custom-scrollbar">
              
              <div className="filter-group">
                <label className="filter-label">📌 การเรียงลำดับ</label>
                <select className="filter-select" value={filters.sort} onChange={(e) => setFilters({...filters, sort: e.target.value as "Newest"|"Popular"})}>
                  <option value="Newest">✨ อัปเดตล่าสุด (Newest)</option>
                  <option value="Popular">🔥 โค้ดยอดฮิต (Most Liked)</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">💖 รายการที่ถูกใจ</label>
                <select className="filter-select" value={filters.liked} onChange={(e) => setFilters({...filters, liked: e.target.value as "All"|"LikedOnly"})}>
                  <option value="All">โชว์ทั้งหมด (All)</option>
                  <option value="LikedOnly">❤️ เฉพาะที่ฉันถูกใจ (My Likes)</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">🔒 การแสดงผล / สถานะ</label>
                <select className="filter-select" value={filters.visibility} onChange={(e) => setFilters({...filters, visibility: e.target.value as FilterState['visibility']})}>
                  <option value="Default">🌍 โชว์ตามปกติ (ซ่อน Private ตอนค้นหา)</option>
                  <option value="PublicOnly">🔓 เฉพาะโค้ดสาธารณะ (Public Only)</option>
                  <option value="CommissionOnly">💎 เฉพาะโค้ดใสรหัส (Personal Only)</option>
                  <option value="PrivateOnly">🔒 เฉพาะโค้ดส่วนตัว (Private Only)</option>
                </select>
              </div>

              <hr style={{ border: 'none', borderTop: '1px dashed #d8b4fe', margin: '10px 0' }} />

              <div className="filter-group">
                <label className="filter-label">🏷️ ประเภทโค้ด</label>
                <select className="filter-select" value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
                  <option value="All">ทุกประเภท (All Types)</option>
                  {uniqueTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">🌻 กิจกรรม</label>
                <select className="filter-select" value={filters.event} onChange={(e) => setFilters({...filters, event: e.target.value})}>
                  <option value="All">ทุกกิจกรรม (All Events)</option>
                  {uniqueEvents.map(evt => <option key={evt} value={evt}>{evt}</option>)}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">🏷️ แท็กทั่วไป</label>
                <select className="filter-select" value={filters.activity} onChange={(e) => setFilters({...filters, activity: e.target.value})}>
                  <option value="All">ทุกแท็ก (All Tags)</option>
                  {uniqueActivities.map(act => <option key={act} value={act}>{act}</option>)}
                </select>
              </div>
              
            </div>

            <div className="filter-modal-footer">
              <button className="btn-reset" onClick={() => setFilters(DEFAULT_FILTERS)}>ล้างตัวกรอง</button>
              <button className="btn-apply" onClick={() => setShowFilterModal(false)}>ใช้ตัวกรอง ({filteredCodes.length} รายการ)</button>
            </div>
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

        {/* 🌟 Toolbar โฉมใหม่: Search Bar แถวยาวๆ + ปุ่มตัวกรอง + ปุ่ม Manage */}
        <div className="toolbar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="ค้นหาชื่อโค้ด..." 
              className="glass-input-search"
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="filter-btn" onClick={() => setShowFilterModal(true)}>
            🎛️ ตัวกรอง
            {activeFiltersCount > 0 && <span className="filter-badge">{activeFiltersCount}</span>}
          </button>
          
          <button onClick={() => setShowAuthModal(true)} className="manage-btn" title="จัดการโค้ด">⚙️</button>
        </div>

        <div className="code-grid">
          {filteredCodes.length > 0 ? (
            filteredCodes.map((code, index) => {
              const bgImageUrl = code.previewUrl || "https://iili.io/CNQcH1j.md.png";
              
              const isPrivate = code.isLocked && !code.isCommission;
              const isCommission = code.isLocked && code.isCommission;
              const isLiked = likedCodes.includes(code.id);

              return (
                <Link 
                  href={`/codes/${code.id}`}
                  className={`code-card ${isPrivate ? 'is-private' : ''}`} 
                  key={code.id}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {/* ปุ่มกดไลก์บนการ์ด (ยังอยู่) */}
                  {!isPrivate && (
                    <button 
                      className={`like-btn ${isLiked ? 'liked' : ''}`} 
                      onClick={(e) => handleLike(e, code.id)}
                    >
                      <span className="heart-icon">{isLiked ? '❤️' : '🤍'}</span> 
                      {code.likes || 0}
                    </button>
                  )}

                  <div className="card-preview">
                    {isPrivate && <div className="lock-icon-overlay">🔒</div>}
                    <img 
                      src={bgImageUrl} 
                      alt={isPrivate ? 'Private Preview' : code.name} 
                      loading="lazy" 
                      onError={(e) => { e.currentTarget.src = "https://i.pinimg.com/1200x/1d/e5/78/1de578351b09df48023a06e33341fd77.jpg"; }}
                    />
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