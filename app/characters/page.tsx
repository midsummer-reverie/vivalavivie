"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type CharacterType = {
  id: string;
  name: string;
  description: string;
  image?: string | null;     
  imageUrl?: string | null; 
  verseTag?: string[];       
};

export default function Characters() {
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVerse, setFilterVerse] = useState("All");
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const router = useRouter();

  const fetchCharacters = async () => {
    try {
      const res = await fetch('/api/characters');
      if (res.ok) {
        const data = await res.json();
        
        data.sort((a: CharacterType, b: CharacterType) => {
          const verseA = (a.verseTag && a.verseTag.length > 0) ? a.verseTag[0].toLowerCase() : "zzzz";
          const verseB = (b.verseTag && b.verseTag.length > 0) ? b.verseTag[0].toLowerCase() : "zzzz";
          
          if (verseA === verseB) {
            return a.name.localeCompare(b.name);
          }
          return verseA.localeCompare(verseB);
        });

        setCharacters(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const filteredCharacters = characters.filter((char) => {
    const matchName = char.name.toLowerCase().includes(searchTerm.toLowerCase());
    const verse = (char.verseTag && char.verseTag.length > 0) ? char.verseTag[0] : "";
    const matchVerse = filterVerse === "All" || verse === filterVerse;
    return matchName && matchVerse;
  });

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "712069") {
      setShowAuthModal(false);
      setPassword("");
      setAuthError(false);
      router.push('/characters/manage'); 
    } else {
      setAuthError(true);
    }
  };

  return (
    <div 
      className="char-page-wrapper"
      style={{
        '--glass-bg': 'rgba(255, 255, 255, 0.45)',
        '--glass-border': 'rgba(255, 255, 255, 0.6)',
        '--glass-blur': '16px',
        '--text-dark': '#2c2c34',
        '--ios-blue': '#add6ff', 
        '--ios-blue-dark': '#7eaadb',
        '--radius-lg': '20px',
        '--radius-md': '12px',
      } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap');

        .char-page-wrapper {
          min-height: 100vh; margin: 0; padding: 4vw;
          font-family: 'Google Sans', "Helvetica Neue", Arial, sans-serif;
          color: var(--text-dark);
          background: radial-gradient(circle at 20% 30%, #e0f2fe 0%, transparent 60%),
                      radial-gradient(circle at 80% 70%, #fef9c3 0%, transparent 60%),
                      linear-gradient(135deg, #f0f9ff 0%, #fffbeb 100%);
          background-attachment: fixed; overflow-x: hidden;
        }

        .char-page-wrapper * { box-sizing: border-box; }

        .page-transition {
          animation: pageFadeIn 0.8s ease-out forwards; opacity: 0;
          transform: translateY(15px); max-width: 1000px; margin: 0 auto;
        }

        @keyframes pageFadeIn { to { opacity: 1; transform: translateY(0); } }

        .header-section { position: relative; text-align: center; margin-bottom: 40px; padding-top: 20px; }
        .main-title { font-size: 2.5rem; font-weight: 700; margin: 0; letter-spacing: -0.02em; position: relative; z-index: 10; }
        .ios-highlight {
          background-color: var(--ios-blue); color: #000; padding: 0;
          border-left: 3px solid var(--ios-blue-dark); border-right: 3px solid var(--ios-blue-dark);
          display: inline-block; line-height: 1.1;
        }

        .img-float { position: absolute; background-size: contain; background-repeat: no-repeat; background-position: center; pointer-events: none; z-index: 1; }
        .img-1 { width: 50px; height: 50px; top: -20px; left: 22%; background-image: url('https://iili.io/CNQcH1j.md.png'); animation: floatFade 5s ease-in-out infinite; }
        .img-2 { width: 60px; height: 60px; bottom: -30px; left: 28%; background-image: url('https://iili.io/CNQamXe.png'); animation: floatFade 6s ease-in-out infinite 1s; }
        .img-3 { width: 45px; height: 45px; top: -10px; right: 22%; background-image: url('https://iili.io/CNQapLu.md.png'); animation: floatFade 4.5s ease-in-out infinite 0.5s; }
        .img-4 { width: 40px; height: 40px; bottom: -15px; right: 26%; background-image: url('https://iili.io/CNQc9qb.md.png'); animation: floatFade 7s ease-in-out infinite; }

        @keyframes floatFade {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0.9; }
          50%  { transform: translateY(-12px) rotate(6deg); opacity: 1; }
          100% { transform: translateY(0) rotate(0deg); opacity: 0.9; }
        }
        
        @media (max-width: 768px) {
          .main-title { font-size: 2rem; }
          .img-1 { left: 5%; } .img-2 { left: 15%; }
          .img-3 { right: 5%; } .img-4 { right: 12%; }
        }

        .toolbar {
          display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between; align-items: center;
          margin-bottom: 30px; background: rgba(255,255,255,0.3); padding: 16px;
          border-radius: var(--radius-lg); border: 1px solid var(--glass-border); backdrop-filter: blur(8px);
        }

        .search-group { display: flex; gap: 12px; flex: 1; min-width: 280px; }
        .glass-input, .glass-select {
          background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-md);
          padding: 10px 14px; font-family: inherit; font-size: 0.95rem; color: var(--text-dark); outline: none; transition: all 0.2s; flex: 1;
        }
        .glass-input:focus, .glass-select:focus { border-color: #8fb4e3; box-shadow: 0 0 0 3px rgba(143, 180, 227, 0.3); background: rgba(255,255,255,0.6); }

        .glass-btn-primary {
          background: linear-gradient(135deg, #a8cbf0, #d4e5f7); border: 1px solid #ffffff; border-radius: var(--radius-md);
          padding: 10px 20px; cursor: pointer; font-weight: 700; color: var(--text-dark); font-family: 'Google Sans';
          box-shadow: 0 4px 12px rgba(143, 180, 227, 0.3); transition: all 0.2s;
        }
        .glass-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(143, 180, 227, 0.4); }

        .char-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 24px; padding-bottom: 40px; }

        @keyframes cardEnter {
          0% { opacity: 0; transform: translateY(25px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .char-card {
          border-radius: var(--radius-md); 
          border: 1px solid var(--glass-border);
          box-shadow: 0 4px 20px rgba(90, 110, 150, 0.1), inset 0 1px 0 rgba(255,255,255,0.4);
          overflow: hidden; 
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.7s cubic-bezier(0.22, 1, 0.36, 1);
          display: flex; 
          flex-direction: column; 
          justify-content: flex-end; 
          cursor: pointer;
          aspect-ratio: 3 / 4; 
          background-color: #e2e8f0; 
          background-size: cover;
          background-position: center;
          position: relative;
          opacity: 0;
          animation: cardEnter 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          text-decoration: none;
        }

        .char-card:hover { 
          transform: translateY(-6px) !important; 
          box-shadow: 0 20px 40px rgba(90, 110, 150, 0.18), inset 0 1px 0 rgba(255,255,255,0.6) !important; 
        }

        .char-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 100%);
          pointer-events: none;
          z-index: 1;
        }

        .char-info { 
          padding: 20px 16px 16px 16px; 
          text-align: left; 
          position: relative; 
          z-index: 2; 
        }
        
        .char-name { 
          font-size: 1.25rem; 
          font-weight: 700; 
          margin: 0 0 8px 0; 
          color: #ffffff; 
          text-shadow: 0 2px 4px rgba(0,0,0,0.6);
          line-height: 1.2;
        }

        .char-verse { 
          font-size: 0.75rem; 
          font-weight: 600; 
          color: var(--text-dark); 
          margin: 0; 
          background: rgba(255,255,255,0.9); 
          display: inline-block; 
          padding: 4px 10px; 
          border-radius: 20px; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          backdrop-filter: blur(4px);
        }
        
        .back-btn {
          display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; text-decoration: none; color: var(--text-dark);
          font-weight: 600; font-size: 0.95rem; background: var(--glass-bg); border: 1px solid var(--glass-border);
          padding: 8px 16px; border-radius: var(--radius-md); backdrop-filter: blur(var(--glass-blur)); transition: all 0.2s;
        }
        .back-btn:hover { background: rgba(255,255,255,0.6); transform: translateX(-4px); }
        
        .empty-state { text-align: center; padding: 40px; color: #666; font-weight: 500; grid-column: 1 / -1; }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; z-index: 100;
          animation: fadeIn 0.3s ease-out;
        }
        .modal-content {
          background: var(--glass-bg); border: 1px solid var(--glass-border);
          padding: 32px; border-radius: var(--radius-lg); width: 90%; max-width: 400px;
          box-shadow: 0 10px 40px rgba(90, 110, 150, 0.2), inset 0 1px 0 rgba(255,255,255,0.7);
          text-align: center; animation: slideUp 0.3s ease-out;
        }
        .modal-title { font-size: 1.5rem; margin: 0 0 16px; font-weight: 700; }
        .modal-input {
          width: 100%; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--glass-border);
          background: rgba(255,255,255,0.6); font-family: inherit; font-size: 1rem; margin-bottom: 16px;
          outline: none; text-align: center;
        }
        .modal-input:focus { border-color: #8fb4e3; box-shadow: 0 0 0 3px rgba(143, 180, 227, 0.3); }
        .modal-actions { display: flex; gap: 12px; justify-content: center; }
        .btn-cancel {
          background: rgba(255,255,255,0.5); border: 1px solid var(--glass-border); padding: 10px 20px;
          border-radius: var(--radius-md); cursor: pointer; font-weight: 600; color: var(--text-dark); transition: all 0.2s;
        }
        .btn-cancel:hover { background: rgba(255,255,255,0.8); }
        .error-msg { color: #e11d48; font-size: 0.85rem; margin-top: -10px; margin-bottom: 16px; font-weight: 600; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}} />

      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">🔒 Admin Login</h2>
            <p style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#555' }}>
              กรุณาใส่รหัสผ่านเพื่อจัดการตัวละคร
            </p>
            <form onSubmit={handleAuthSubmit}>
              <input 
                type="password" 
                className="modal-input" 
                placeholder="Enter password..." 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setAuthError(false); }}
                autoFocus
              />
              {authError && <div className="error-msg">❌ รหัสผ่านไม่ถูกต้อง</div>}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAuthModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="glass-btn-primary">
                  Unlock
                </button>
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
            vivie's <span className="ios-highlight">character</span>
          </h1>
        </div>

        <div className="toolbar">
          <div className="search-group">
            <input 
              type="text" 
              placeholder="Search by name..." 
              className="glass-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="glass-select"
              value={filterVerse}
              onChange={(e) => setFilterVerse(e.target.value)}
            >
              <option value="All">All Verses</option>
              {Array.from(new Set(characters.flatMap(c => c.verseTag || []))).sort().map(verse => (
                <option key={verse} value={verse}>{verse}</option>
              ))}
            </select>
          </div>

          <button onClick={() => setShowAuthModal(true)} className="glass-btn-primary">
            + Manage
          </button>
        </div>

        <div className="char-grid">
          {filteredCharacters.length > 0 ? (
            filteredCharacters.map((char, index) => {
              const bgImageUrl = char.image || char.imageUrl || ""; 
              
              return (
                <Link 
                  href={`/characters/${char.id}`}
                  className="char-card" 
                  key={char.id}
                  style={{ 
                    backgroundImage: bgImageUrl ? `url('${bgImageUrl}')` : 'none',
                    animationDelay: `${index * 0.1}s` 
                  }}
                >
                  <div className="char-info">
                    <h3 className="char-name">{char.name}</h3>
                    {(char.verseTag && char.verseTag.length > 0) && <p className="char-verse">{char.verseTag[0]}</p>}
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="empty-state">
              ไม่พบตัวละครในฐานข้อมูล 😥
            </div>
          )}
        </div>
      </div>
    </div>
  );
}