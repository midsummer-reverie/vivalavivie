"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function CodeDetail() {
  const params = useParams();
  const codeId = params.id as string;

  const [code, setCode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // ระบบ Lock & Unlock
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  // ระบบแสดงผล
  const [activeVariation, setActiveVariation] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const res = await fetch('/api/codes');
        if (res.ok) {
          const data = await res.json();
          const foundCode = data.find((c: any) => c.id === codeId);
          if (foundCode) {
            if (typeof foundCode.variations === 'string') {
              try { foundCode.variations = JSON.parse(foundCode.variations); }
              catch { foundCode.variations = []; }
            }
            setCode(foundCode);
            if (!foundCode.isLocked) setIsUnlocked(true);
          }
        }
      } catch (error) {
        console.error("Error fetching code:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCode();
  }, [codeId]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === code.lockPassword) {
      setIsUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const getRenderedHtml = () => {
    if (!code || !code.htmlCode) return "";
    let finalHtml = code.htmlCode;
    
    const variation = code.variations?.[activeVariation];
    if (variation && variation.replacements) {
      const lines = variation.replacements.split('\n');
      lines.forEach((line: string) => {
        const separatorIdx = line.indexOf('=');
        if (separatorIdx !== -1) {
          const key = line.substring(0, separatorIdx).trim();
          const val = line.substring(separatorIdx + 1).trim();
          if (key) {
            finalHtml = finalHtml.split(key).join(val);
          }
        }
      });
    }
    return finalHtml;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getRenderedHtml());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  if (!code) return <div style={{ textAlign: 'center', padding: '50px' }}><h2>ไม่พบข้อมูลโค้ดนี้ 😥</h2><Link href="/codes" style={{ color: '#8b5cf6' }}>กลับไปหน้าหลัก</Link></div>;

  const currentHtml = getRenderedHtml();

  return (
    <div 
      className="code-detail-wrapper"
      style={{
        '--glass-bg': 'rgba(255, 255, 255, 0.45)',
        '--glass-border': 'rgba(255, 255, 255, 0.6)',
        '--text-dark': '#2e1065', 
        '--theme-primary': '#d8b4fe', 
        '--theme-secondary': '#bae6fd', 
        '--radius-lg': '20px',
        '--radius-md': '12px',
      } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;600;700&display=swap');

        .code-detail-wrapper {
          min-height: 100vh; margin: 0; padding: 4vw;
          font-family: 'Google Sans', sans-serif; color: var(--text-dark);
          background: radial-gradient(circle at 15% 20%, #e9d5ff 0%, transparent 50%),
                      radial-gradient(circle at 85% 80%, #bae6fd 0%, transparent 50%),
                      linear-gradient(135deg, #f3e8ff 0%, #e0f2fe 100%);
          background-attachment: fixed; overflow-x: hidden;
        }
        .code-detail-wrapper * { box-sizing: border-box; }

        /* 🌟 บังคับฟอนต์ให้ปุ่มทั้งหมด */
        button { font-family: 'Google Sans', sans-serif !important; }

        .max-w { max-width: 1000px; margin: 0 auto; position: relative; z-index: 10; animation: fadeUp 0.6s ease-out forwards; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .back-btn {
          display: inline-flex; align-items: center; justify-content: center; margin-bottom: 24px; text-decoration: none; color: var(--text-dark);
          font-weight: 600; font-size: 0.95rem; background: var(--glass-bg); border: 1px solid var(--glass-border);
          padding: 8px 16px; border-radius: var(--radius-md); backdrop-filter: blur(8px); transition: 0.2s;
        }
        .back-btn:hover { background: rgba(255,255,255,0.8); transform: translateX(-4px); }

        .glass-card {
          background: rgba(255,255,255,0.5); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); 
          padding: 32px; backdrop-filter: blur(16px); box-shadow: 0 10px 40px rgba(139, 92, 246, 0.08); margin-bottom: 30px;
        }

        .header-box { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; border-bottom: 2px solid rgba(139, 92, 246, 0.15); padding-bottom: 20px; }
        .code-title { font-size: 2.2rem; font-weight: 700; margin: 0 0 12px 0; color: #2e1065; line-height: 1.1; }
        .tags-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag-type { background: rgba(216, 180, 254, 0.6); color: #4c1d95; font-size: 0.8rem; font-weight: 700; padding: 6px 12px; border-radius: 12px; }
        .tag-activity { background: rgba(255, 255, 255, 0.7); color: #4c1d95; font-size: 0.8rem; font-weight: 600; padding: 6px 12px; border-radius: 12px; border: 1px solid rgba(216, 180, 254, 0.5); }

        /* Lock Screen */
        .lock-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; }
        .lock-icon { font-size: 4rem; margin-bottom: 16px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1)); }
        .lock-input { width: 100%; max-width: 300px; padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--theme-primary); background: rgba(255,255,255,0.9); font-family: inherit; font-size: 1rem; text-align: center; margin-bottom: 16px; outline: none; }
        .lock-input:focus { box-shadow: 0 0 0 3px rgba(216, 180, 254, 0.4); }
        .btn-unlock { background: linear-gradient(135deg, #d8b4fe, #bae6fd); border: 1px solid #fff; padding: 12px 30px; border-radius: var(--radius-md); cursor: pointer; font-weight: 700; color: #2e1065; font-size: 1rem; transition: 0.2s; box-shadow: 0 4px 12px rgba(216, 180, 254, 0.3); }
        .btn-unlock:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(216, 180, 254, 0.5); }

        /* Toolbar / Variations */
        .controls-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; margin-bottom: 24px; }
        .variations-list { display: flex; gap: 10px; flex-wrap: wrap; }
        .var-btn { 
          display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.6); border: 1px solid var(--glass-border);
          padding: 8px 16px; border-radius: 20px; cursor: pointer; font-weight: 600; color: #4c1d95; font-size: 0.9rem; transition: 0.2s;
        }
        .var-btn:hover { background: rgba(255,255,255,0.9); }
        .var-btn.active { background: #fff; border-color: #a855f7; box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2); }
        .color-dot { width: 14px; height: 14px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); }

        .view-toggles { display: flex; background: rgba(255,255,255,0.4); border-radius: 20px; padding: 4px; border: 1px solid var(--glass-border); }
        .toggle-btn { background: transparent; border: none; padding: 8px 20px; border-radius: 16px; font-weight: 600; color: #6b21a8; cursor: pointer; transition: 0.2s; }
        .toggle-btn.active { background: #fff; color: #2e1065; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

        /* 🌟 Display Area ปรับพื้นหลังเป็น #131313 */
        .display-area { background: #131313; border-radius: var(--radius-md); border: 1px solid var(--glass-border); min-height: 400px; overflow: hidden; position: relative; }
        
        .preview-container { padding: 40px; display: flex; justify-content: center; align-items: center; background: #131313; min-height: 400px; }
        .preview-inner { box-shadow: 0 20px 40px rgba(0,0,0,0.5); border-radius: 8px; overflow: hidden; max-width: 100%; background: transparent; }

        .code-container { padding: 24px; background: #131313; color: #e2e8f0; font-family: monospace !important; font-size: 0.95rem; line-height: 1.6; overflow-x: auto; margin: 0; min-height: 400px; }
        
        .btn-copy { position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.9); border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; color: #2e1065; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        .btn-copy:hover { transform: translateY(-2px); background: #fff; }
      `}} />

      <div className="max-w">
        <Link href="/codes" className="back-btn">← Back to Showcase</Link>

        <div className="glass-card">
          {!isUnlocked ? (
            <div className="lock-screen">
              <div className="lock-icon">🔒</div>
              <h2 style={{ fontSize: '2rem', margin: '0 0 10px 0', color: '#2e1065', fontFamily: 'monospace' }}>LOCKED_FILE</h2>
              <p style={{ color: '#6b21a8', marginBottom: '24px' }}>โค้ดนี้ถูกเข้ารหัสไว้ กรุณาใส่รหัสผ่านเพื่อเข้าถึง</p>
              
              <form onSubmit={handleUnlock}>
                <input 
                  type="password" className="lock-input" placeholder="Enter password..." 
                  value={passwordInput} onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }} autoFocus 
                />
                {passwordError && <div style={{ color: '#ef4444', marginBottom: '16px', fontWeight: 600 }}>❌ รหัสผ่านไม่ถูกต้อง</div>}
                <div><button type="submit" className="btn-unlock">Unlock Code</button></div>
              </form>
            </div>
          ) : (
            <>
              <div className="header-box">
                <div>
                  <h1 className="code-title">{code.name}</h1>
                  <div className="tags-row">
                    <span className="tag-type">{code.codeType}</span>
                    {code.activityTags && code.activityTags.map((tag: string, i: number) => (
                      <span key={i} className="tag-activity">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="controls-row">
                <div className="variations-list">
                  {code.variations && code.variations.map((v: any, index: number) => (
                    <button 
                      key={v.id || index} 
                      className={`var-btn ${activeVariation === index ? 'active' : ''}`}
                      onClick={() => setActiveVariation(index)}
                    >
                      <div className="color-dot" style={{ backgroundColor: v.color || '#ccc' }}></div>
                      {v.label}
                    </button>
                  ))}
                </div>

                <div className="view-toggles">
                  <button className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`} onClick={() => setViewMode('preview')}>✨ Live Preview</button>
                  <button className={`toggle-btn ${viewMode === 'code' ? 'active' : ''}`} onClick={() => setViewMode('code')}>💻 HTML Code</button>
                </div>
              </div>

              <div className="display-area">
                <button className="btn-copy" onClick={handleCopy}>
                  {copied ? "✅ Copied!" : "📋 Copy HTML"}
                </button>

                {viewMode === 'preview' ? (
                  <div className="preview-container">
                    <div className="preview-inner" dangerouslySetInnerHTML={{ __html: currentHtml }} />
                  </div>
                ) : (
                  <pre className="code-container"><code>{currentHtml}</code></pre>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}