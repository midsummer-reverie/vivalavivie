"use client";

import React, { useState, useRef, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import Link from 'next/link';

const defaultFormData = {
  nameTh: "", nameEn: "",
  nickTh: "", nickEn: "",
  team: "", expectedRank: "",
  song1: "", ori1: "",
  song2: "", ori2: "",
  song3: "", ori3: "",
  signature: "", date: "",
  signatureType: "text", 
  signatureImageUrl: "",
  sigOffsetX: 0,
  sigOffsetY: 0,
  sigScale: 100
};

const defaultSettings = {
  fontColor: "#2563eb",
  fontFamily: "'Mali', cursive",
  logoUrl: "https://iili.io/qHof9rF.md.png",
  fontSize: 20,
  fontOffsetY: -7 
};

export default function ELS48GeneralElection() {
  const formRef = useRef<HTMLDivElement>(null);
  
  // ใช้เช็คว่าหน้าเว็บโหลดเสร็จหรือยัง เพื่อป้องกันปัญหา Hydration ของ Next.js
  const [isMounted, setIsMounted] = useState(false);

  // 🌟 ข้อมูลที่กรอกในฟอร์ม (ฝั่งซ้าย)
  const [formData, setFormData] = useState(defaultFormData);

  // 🌟 การตั้งค่าฟอร์ม
  const [settings, setSettings] = useState(defaultSettings);

  // 🌟 จัดการฟอนต์ลายมือจากหลังบ้าน
  const [customFonts, setCustomFonts] = useState([
    { name: 'Mali', value: "'Mali', cursive" },
    { name: 'Charm ', value: "'Charm', cursive" },
    { name: 'Caveat', value: "'Caveat', cursive" }
  ]);
  
  const [newFontName, setNewFontName] = useState("");
  const [newFontUrl, setNewFontUrl] = useState("");
  const [newFontFamily, setNewFontFamily] = useState("");

  const teams = [
    "ELS48 Team Eclipse",
    "ELS48 Team Lumina",
    "ELS48 Team Starlight",
    "ELS48 Team Trainee"
  ];

  // 🛠️ โหลด Font เริ่มต้น, ดึงจาก Database และโหลดข้อมูลจาก LocalStorage
  useEffect(() => {
    setIsMounted(true);

    // โหลดข้อมูลที่เคยพิมพ์ไว้จาก LocalStorage (ถ้ามี)
    const savedFormData = localStorage.getItem('els48-ge-form-data');
    const savedSettings = localStorage.getItem('els48-ge-settings');
    if (savedFormData) setFormData(JSON.parse(savedFormData));
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    // 1. โหลด THSarabun PSK
    fetch("https://midsummer-reverie.github.io/font-face/THSarabun-PSK.css")
      .then(res => res.text())
      .then(css => {
        const absCss = css.replace(/url\((['"]?)([^)'"]+)(['"]?)\)/g, (match, p1, p2, p3) => {
          if (p2.startsWith('http') || p2.startsWith('data:')) return match;
          return `url(${p1}https://midsummer-reverie.github.io/font-face/${p2}${p3})`;
        });
        const style = document.createElement('style');
        style.innerHTML = absCss;
        document.head.appendChild(style);
      }).catch(e => console.error(e));

    // 2. ดึงฟอนต์ที่เคยอิมพอร์ตไว้จาก Database
    const fetchGlobalFonts = async () => {
      try {
        const res = await fetch('/api/fonts');
        if (res.ok) {
          const dbFonts = await res.json();
          
          for (const font of dbFonts) {
            try {
              const fontRes = await fetch(font.url);
              const cssText = await fontRes.text();
              const style = document.createElement('style');
              style.innerHTML = cssText;
              document.head.appendChild(style);
            } catch (e) {
              console.error(`Failed to load font: ${font.name}`, e);
            }
          }

          if (dbFonts.length > 0) {
            setCustomFonts([
              { name: 'Mali', value: "'Mali', cursive" },
              { name: 'Charm', value: "'Charm', cursive" },
              { name: 'Caveat', value: "'Caveat', cursive" },
              ...dbFonts.map((f: any) => ({ name: f.name, value: f.family }))
            ]);
          }
        }
      } catch (err) {
        console.error("Error fetching fonts:", err);
      }
    };

    fetchGlobalFonts();
  }, []);

  // 🛠️ Auto-save ลง LocalStorage ทุกครั้งที่ข้อมูลเปลี่ยน
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('els48-ge-form-data', JSON.stringify(formData));
    }
  }, [formData, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('els48-ge-settings', JSON.stringify(settings));
    }
  }, [settings, isMounted]);

  // 🗑️ ฟังก์ชันล้างข้อมูลทั้งหมด
  const handleResetData = () => {
    if (window.confirm("คุณต้องการล้างข้อมูลทั้งหมดและเริ่มกรอกข้อมูลใหม่ใช่หรือไม่?")) {
      setFormData(defaultFormData);
      setSettings(defaultSettings);
      localStorage.removeItem('els48-ge-form-data');
      localStorage.removeItem('els48-ge-settings');
    }
  };

  // 🛠️ ฟังก์ชันบันทึกฟอนต์ลง Database
  const handleAddCustomFont = async () => {
    if (!newFontName || !newFontUrl || !newFontFamily) return alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    
    try {
      let formattedFont = newFontFamily.trim();
      if (!formattedFont.startsWith("'") && !formattedFont.startsWith('"') && formattedFont.includes(" ")) {
        formattedFont = `'${formattedFont}'`;
      }

      const res = await fetch('/api/fonts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFontName,
          url: newFontUrl,
          family: formattedFont
        })
      });

      if (!res.ok) throw new Error("Failed to save to DB");

      const fontRes = await fetch(newFontUrl);
      const cssText = await fontRes.text();
      const style = document.createElement('style');
      style.innerHTML = cssText;
      document.head.appendChild(style);
      
      setCustomFonts([...customFonts, { name: newFontName, value: formattedFont }]);
      setSettings({ ...settings, fontFamily: formattedFont });
      setNewFontName(""); setNewFontUrl(""); setNewFontFamily("");
      
      alert(`✨ นำเข้าและแชร์ฟอนต์ ${newFontName} ให้ทุกคนสำเร็จ!`);
    } catch (err) {
      alert("❌ ไม่สามารถบันทึกฟอนต์ได้ กรุณาตรวจสอบลิงก์และ Database");
    }
  };

  const handleChange = (field: string, value: string | number) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleExportImage = () => {
    if (!formRef.current) return;
    
    htmlToImage.toPng(formRef.current, { 
      quality: 1, 
      pixelRatio: 2, 
      width: 1123,  
      height: 1587, 
      backgroundColor: '#ffffff',
      style: { 
        transform: 'scale(1)', 
        transformOrigin: 'top left',
        margin: '0' 
      }
    })
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `ELS48_GEApplication_${formData.nickEn || 'Form'}.png`;
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => {
      console.error('Export Error:', err);
      alert('ไม่สามารถ Export ภาพได้ กรุณาตรวจสอบคอนโซล');
    });
  };

  const PrintDisplay = ({ label, field, width="100%", align="left", labelWidth, isSignature = false }: { label?: string, field: string, width?: string, align?: "left"|"center"|"right", labelWidth?: string, isSignature?: boolean }) => {
    const xPos = align === 'left' ? `calc(0% + ${formData.sigOffsetX}px)` : `calc(50% + ${formData.sigOffsetX}px)`;
    const yPos = `calc(100% + ${formData.sigOffsetY}px)`;

    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', width, marginBottom: '14px' }}>
        {label && <span style={{ marginRight: '12px', fontWeight: 'bold', whiteSpace: 'nowrap', width: labelWidth }}>{label}</span>}
        <div style={{ flex: 1, borderBottom: '1px dotted #000', position: 'relative', height: '30px' }}>
          
          {isSignature && formData.signatureType === 'image' && formData.signatureImageUrl ? (
            <div style={{
              position: 'absolute', bottom: '2px', left: align === 'left' ? '16px' : '0', width: 'calc(100% - 16px)', height: '60px',
              display: 'flex', justifyContent: align === 'left' ? 'flex-start' : 'center'
            }}>
              <div
                style={{
                  width: '100%', height: '100%',
                  backgroundColor: settings.fontColor, 
                  WebkitMaskImage: `url(${formData.signatureImageUrl})`, 
                  WebkitMaskSize: `auto ${formData.sigScale}%`,
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: `${xPos} ${yPos}`, 
                  maskImage: `url(${formData.signatureImageUrl})`,
                  maskSize: `auto ${formData.sigScale}%`,
                  maskRepeat: 'no-repeat',
                  maskPosition: `${xPos} ${yPos}`,
                }}
              />
            </div>
          ) : (
            <div
              style={{
                position: 'absolute', 
                bottom: `${settings.fontOffsetY}px`, 
                left: 0, 
                width: '100%',
                textAlign: align,
                paddingLeft: align === 'left' ? '16px' : '0',
                color: settings.fontColor,
                fontFamily: settings.fontFamily,
                fontSize: `${settings.fontSize}px`, 
                lineHeight: '1',
                whiteSpace: 'nowrap',
                overflow: 'visible'
              }}
            >
              {formData[field as keyof typeof formData]}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isMounted) return null; // ป้องกัน UI กระตุกตอนดึงข้อมูลจาก LocalStorage

  return (
    <div className="els-page-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;600;700&display=swap');
        
        /* ============================
            ✨ แอนิเมชันสำหรับหน้าฟอร์ม
            ============================ */
        @keyframes pageFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .els-page-wrapper { 
          min-height: 100vh; 
          margin: 0; 
          padding: 2vw 4vw; 
          font-family: 'Google Sans', sans-serif; 
          color: #2e1065; 
          background: radial-gradient(circle at 15% 20%, #e9d5ff 0%, transparent 50%), radial-gradient(circle at 85% 80%, #bae6fd 0%, transparent 50%), linear-gradient(135deg, #f3e8ff 0%, #e0f2fe 100%); 
          background-attachment: fixed; 
          overflow-x: hidden;
          
          /* แอนิเมชันตอนเริ่มโหลด */
          animation: pageFadeIn 0.8s ease-out forwards;
        }
        
        .els-page-wrapper * { box-sizing: border-box; }
        button, input, textarea, select { font-family: 'Google Sans', sans-serif !important; }
        
        .wide-w { max-width: 1700px; margin: 0 auto; position: relative; z-index: 10; width: 100%; }
        .split-layout { display: grid; grid-template-columns: 480px 1fr; gap: 24px; align-items: start; }
        @media (max-width: 1200px) { .split-layout { grid-template-columns: 1fr; } }
        
        .nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .back-btn { 
          display: inline-flex; 
          align-items: center; 
          text-decoration: none; 
          color: #2e1065; 
          font-weight: 600; 
          background: rgba(255,255,255,0.45); 
          border: 1px solid rgba(255,255,255,0.6); 
          padding: 8px 16px; 
          border-radius: 12px; 
          backdrop-filter: blur(8px);
          opacity: 0;
          animation: pageFadeIn 0.6s ease-out 0.1s forwards;
          transition: all 0.2s;
        }
        .back-btn:hover { background: rgba(255,255,255,0.8); transform: translateX(-4px); }
        
        .reset-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #dc2626;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 12px;
          cursor: pointer;
          backdrop-filter: blur(8px);
          opacity: 0;
          animation: pageFadeIn 0.6s ease-out 0.1s forwards;
          transition: all 0.2s;
        }
        .reset-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.5);
          transform: translateY(-2px);
        }

        .glass-panel { background: rgba(255,255,255,0.55); border: 1px solid rgba(255,255,255,0.7); border-radius: 20px; padding: 24px; backdrop-filter: blur(16px); box-shadow: 0 10px 40px rgba(139, 92, 246, 0.08); }
        .left-panel { position: sticky; top: 20px; max-height: calc(100vh - 40px); overflow-y: auto; display: flex; flex-direction: column; gap: 24px; }
        
        /* 🌟 เอฟเฟกต์เด้งพรีวิวทางขวา */
        .right-panel { 
          display: flex; 
          flex-direction: column; 
          gap: 20px; 
          min-width: 0; 
          background: #e2e8f0; 
          align-items: center; 
          padding: 0 20px 40px 20px; 
          overflow-x: visible; 
          overflow-y: visible; 
          border: 1px solid #cbd5e1; 
          position: relative;
          opacity: 0;
          animation: popIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s forwards;
        }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.3); border-radius: 10px; }
        
        .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
        .form-label { font-weight: 700; color: #4c1d95; font-size: 0.9rem; }
        .glass-input { width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #d8b4fe; background: rgba(255,255,255,0.9); outline: none; font-size: 0.95rem; color: #2e1065; transition: 0.2s; }
        .glass-input:focus { border-color: #a855f7; box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2); }
        
        /* 🌟 เอฟเฟกต์เลื่อนขึ้นของกล่องตั้งค่าทางซ้าย (ไล่เวลา) */
        .section-box { 
          background: rgba(255,255,255,0.6); 
          border: 1px solid #d8b4fe; 
          border-radius: 14px; 
          padding: 16px; 
          opacity: 0;
          animation: slideUpFade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .left-panel .section-box:nth-child(1) { animation-delay: 0.1s; }
        .left-panel .section-box:nth-child(2) { animation-delay: 0.2s; }
        .left-panel .section-box:nth-child(3) { animation-delay: 0.3s; }
        .left-panel .section-box:nth-child(4) { animation-delay: 0.4s; }
        .left-panel .section-box:nth-child(5) { animation-delay: 0.5s; }
        
        .section-title { font-size: 1.05rem; font-weight: 700; color: #4c1d95; margin: 0 0 16px 0; border-bottom: 1px solid rgba(216,180,254,0.5); padding-bottom: 8px; }
        
        .btn-export { background: linear-gradient(135deg, #a855f7, #6b21a8); color: #fff; border: none; padding: 14px; border-radius: 12px; font-weight: bold; font-size: 1.1rem; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 12px rgba(168,85,247,0.4); text-align: center; }
        .btn-export:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(168,85,247,0.6); }

        .preview-scale-wrapper {
          transform: scale(0.65);
          transform-origin: top center;
          margin-bottom: -45%;
        }
        @media (max-width: 1400px) { .preview-scale-wrapper { transform: scale(0.5); margin-bottom: -65%; } }
        @media (max-width: 768px) { .preview-scale-wrapper { transform: scale(0.32); margin-bottom: -95%; } }

        /* Custom Slider Style */
        input[type=range] { -webkit-appearance: none; width: 100%; background: transparent; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 16px; width: 16px; border-radius: 50%; background: #a855f7; cursor: pointer; margin-top: -6px; box-shadow: 0 1px 3px rgba(0,0,0,0.3); transition: 0.2s; }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.2); }
        input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 4px; cursor: pointer; background: #d8b4fe; border-radius: 2px; }
      `}} />

      <div className="wide-w">
        <div className="nav-header">
          <Link className="back-btn" href="/els48-ge">← กลับไปหน้าหลัก</Link>
          <button className="reset-btn" onClick={handleResetData}>
            🗑️ ล้างข้อมูลทั้งหมด
          </button>
        </div>

        <div className="split-layout">
          {/* ================= ซ้าย: ตัวควบคุมฟอร์ม ================= */}
          <div className="glass-panel left-panel custom-scrollbar">
            
            <div className="section-box">
              <h3 className="section-title">⚙️ ตั้งค่าสไตล์ฟอร์ม</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">สีปากกา</label>
                  <input type="color" className="glass-input" style={{ padding: '2px', height: '42px' }} value={settings.fontColor} onChange={e => setSettings({...settings, fontColor: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">ฟอนต์ลายมือ</label>
                  <select className="glass-input" value={settings.fontFamily} onChange={e => setSettings({...settings, fontFamily: e.target.value})}>
                    {customFonts.map((f, i) => <option key={i} value={f.value}>{f.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '8px' }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>ขนาดฟอนต์ลายมือ</span>
                  <span>{settings.fontSize}px</span>
                </label>
                <input type="range" min="10" max="60" value={settings.fontSize} onChange={e => setSettings({...settings, fontSize: Number(e.target.value)})} />
              </div>

              <div className="form-group" style={{ marginTop: '8px' }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>ปรับตำแหน่งบรรทัด (ขึ้น-ลง)</span>
                  <span>{settings.fontOffsetY}px</span>
                </label>
                <input type="range" min="-30" max="30" value={settings.fontOffsetY} onChange={e => setSettings({...settings, fontOffsetY: Number(e.target.value)})} />
              </div>

              <div className="form-group" style={{ marginTop: '12px' }}>
                <label className="form-label">URL โลโก้ด้านบนกระดาษ</label>
                <input type="text" className="glass-input" value={settings.logoUrl} onChange={e => setSettings({...settings, logoUrl: e.target.value})} />
              </div>
            </div>

            <div className="section-box" style={{ background: 'rgba(239,246,255,0.7)', borderColor: '#93c5fd' }}>
              <h3 className="section-title" style={{ color: '#1d4ed8' }}>➕ อิมพอร์ตฟอนต์ลายมือเพิ่มเติม</h3>
              <div className="form-group">
                <input type="text" className="glass-input" placeholder="1. ชื่อที่จะให้แสดงใน Dropdown..." value={newFontName} onChange={e => setNewFontName(e.target.value)} />
              </div>
              <div className="form-group">
                <input type="text" className="glass-input" placeholder="2. ลิงก์ CSS (เช่น https://...)" value={newFontUrl} onChange={e => setNewFontUrl(e.target.value)} />
              </div>
              <div className="form-group">
                <input type="text" className="glass-input" placeholder="3. Font-Family (เช่น Kira GracegoroDemo)" value={newFontFamily} onChange={e => setNewFontFamily(e.target.value)} />
              </div>
              <button onClick={handleAddCustomFont} style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px', transition: '0.2s' }}>อิมพอร์ตฟอนต์</button>
            </div>

            <div className="section-box">
              <h3 className="section-title">📝 ข้อมูลทั่วไป</h3>
              <div className="form-group"><label className="form-label">ชื่อ-นามสกุล (TH)</label><input type="text" className="glass-input" value={formData.nameTh} onChange={e => handleChange('nameTh', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Full Name (EN)</label><input type="text" className="glass-input" value={formData.nameEn} onChange={e => handleChange('nameEn', e.target.value)} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group"><label className="form-label">ชื่อเล่น (TH)</label><input type="text" className="glass-input" value={formData.nickTh} onChange={e => handleChange('nickTh', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Nickname (EN)</label><input type="text" className="glass-input" value={formData.nickEn} onChange={e => handleChange('nickEn', e.target.value)} /></div>
              </div>
            </div>

            <div className="section-box">
              <h3 className="section-title">🎤 ข้อมูลการเลือกตั้ง</h3>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">ทีมที่สังกัด</label>
                <select className="glass-input" value={formData.team} onChange={e => handleChange('team', e.target.value)}>
                  <option value="">-- เลือกทีม --</option>
                  {teams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">อันดับที่คาดหวัง</label><input type="text" className="glass-input" value={formData.expectedRank} onChange={e => handleChange('expectedRank', e.target.value)} /></div>
              
              <label className="form-label" style={{ display: 'block', marginTop: '16px', marginBottom: '8px' }}>รายชื่อเพลงที่เลือก (3 อันดับ)</label>
              {[1, 2, 3].map(num => (
                <div key={num} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input type="text" className="glass-input" placeholder={`เพลงที่ ${num}`} value={formData[`song${num}` as keyof typeof formData]} onChange={e => handleChange(`song${num}`, e.target.value)} style={{ flex: 2 }} />
                  <input type="text" className="glass-input" placeholder={`ต้นฉบับ`} value={formData[`ori${num}` as keyof typeof formData]} onChange={e => handleChange(`ori${num}`, e.target.value)} style={{ flex: 1 }} />
                </div>
              ))}
            </div>

            <div className="section-box">
              <h3 className="section-title">✍️ การยืนยัน</h3>
              
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ marginBottom: '8px' }}>รูปแบบการลงชื่อ</label>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.95rem' }}>
                  <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input type="radio" checked={formData.signatureType === 'text'} onChange={() => handleChange('signatureType', 'text')} />
                    พิมพ์ชื่อ
                  </label>
                  <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input type="radio" checked={formData.signatureType === 'image'} onChange={() => handleChange('signatureType', 'image')} />
                    แทรกภาพลายเซ็น
                  </label>
                </div>
              </div>

              {formData.signatureType === 'text' ? (
                <div className="form-group">
                  <label className="form-label">พิมพ์ชื่อ</label>
                  <input type="text" className="glass-input" value={formData.signature} onChange={e => handleChange('signature', e.target.value)} />
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">URL ภาพลายเซ็น (พื้นใส)</label>
                  <input type="text" className="glass-input" placeholder="https://..." value={formData.signatureImageUrl} onChange={e => handleChange('signatureImageUrl', e.target.value)} />
                  
                  <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.7)', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: '12px', color: '#6b21a8' }}>🕹️ ปรับแต่งตำแหน่งและขนาด</label>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '45px' }}>ซ้าย-ขวา</span>
                      <input type="range" min="-100" max="100" value={formData.sigOffsetX} onChange={e => handleChange('sigOffsetX', Number(e.target.value))} />
                      <span style={{ fontSize: '0.85rem', width: '30px', textAlign: 'right' }}>{formData.sigOffsetX}</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '45px' }}>ขึ้น-ลง</span>
                      <input type="range" min="-100" max="100" value={formData.sigOffsetY} onChange={e => handleChange('sigOffsetY', Number(e.target.value))} />
                      <span style={{ fontSize: '0.85rem', width: '30px', textAlign: 'right' }}>{formData.sigOffsetY}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '45px' }}>ขนาด</span>
                      <input type="range" min="10" max="300" value={formData.sigScale} onChange={e => handleChange('sigScale', Number(e.target.value))} />
                      <span style={{ fontSize: '0.85rem', width: '30px', textAlign: 'right' }}>{formData.sigScale}%</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="form-group" style={{ marginTop: '16px' }}><label className="form-label">วันที่ลงสมัคร</label><input type="text" className="glass-input" value={formData.date} onChange={e => handleChange('date', e.target.value)} /></div>
            </div>

          </div>

          {/* ================= ขวา: กระดาษ A4 Preview ================= */}
          <div className="glass-panel right-panel">
            
            {/* 🌟 ปุ่ม Export ย้ายมาอยู่ด้านบนของฝั่ง Preview (ติดแบบ Sticky) */}
            <div style={{ 
              position: 'sticky', 
              top: '0px', 
              zIndex: 50, 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              padding: '20px 0',
              background: 'linear-gradient(180deg, #e2e8f0 70%, transparent 100%)' // ไล่สีกลืนไปกับพื้นหลังเดิม
            }}>
              <button className="btn-export" onClick={handleExportImage} style={{ padding: '14px 30px', fontSize: '1.15rem', boxShadow: '0 8px 25px rgba(168,85,247,0.4)' }}>
                📸 บันทึกเป็นรูปภาพ (Export)
              </button>
            </div>

            <div className="preview-scale-wrapper">
              
              <div 
                ref={formRef}
                style={{
                  width: '1123px', 
                  height: '1587px', 
                  background: '#ffffff',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                  padding: '90px 110px', 
                  boxSizing: 'border-box',
                  position: 'relative',
                  color: '#000',
                  fontFamily: "'THSarabun PSK', sans-serif", 
                  fontSize: '24px' 
                }}
              >
                {/* หัวกระดาษ */}
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                  <img src={settings.logoUrl} alt="Logo" style={{ height: '140px', objectFit: 'contain', marginBottom: '16px' }} />
                  <div style={{ fontSize: '38px', margin: 0, fontWeight: 'bold', lineHeight: '1.2' }}>แบบฟอร์มใบสมัคร</div>
                  <div style={{ fontSize: '32px', margin: 0, fontWeight: 'bold' }}>ELS48 Senbatsu General Election 2026</div>
                </div>

                {/* ข้อมูลแถว 1 */}
                <div style={{ display: 'flex', gap: '30px', marginBottom: '16px' }}>
                  <PrintDisplay label="ชื่อ-นามสกุล (ภาษาไทย)" field="nameTh" />
                  <PrintDisplay label="Full Name (English)" field="nameEn" />
                </div>

                {/* ข้อมูลแถว 2 */}
                <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
                  <PrintDisplay label="ชื่อเล่น (ภาษาไทย)" field="nickTh" />
                  <PrintDisplay label="Nickname (English)" field="nickEn" />
                </div>

                {/* ส่วนเลือกทีม */}
                <div style={{ marginBottom: '40px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>ทีมที่สังกัด</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '16px', columnGap: '40px', paddingLeft: '30px' }}>
                    {teams.map(team => (
                      <div key={team} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                          width: '24px', height: '24px', 
                          border: '2px solid #000', 
                          borderRadius: '50%', 
                          marginRight: '16px',
                          display: 'flex', justifyContent: 'center', alignItems: 'center',
                          backgroundColor: 'transparent',
                          position: 'relative'
                        }}>
                          {formData.team === team && 
                            <span style={{ 
                              color: settings.fontColor, 
                              fontFamily: settings.fontFamily, 
                              fontSize: '30px', 
                              position: 'absolute', 
                              top: '-15px', left: '1px' 
                            }}>
                              ✓
                            </span>
                          }
                        </div>
                        <span style={{ fontWeight: 'bold' }}>{team}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* อันดับ */}
                <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '40px', width: '60%' }}>
                  <PrintDisplay label="อันดับที่คาดหวัง" field="expectedRank" />
                </div>

                {/* ลิสต์เพลง */}
                <div style={{ marginBottom: '60px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '16px' }}>
                    3 อันดับเพลงจาก AKB48 Group ที่ถ้าได้อันดับ 1, 13 หรือ 25 จะเลือกมาเป็นเพลงที่อยู่ในซิงเกิล
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '30px' }}>
                    {[1, 2, 3].map(num => (
                      <div key={num} style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
                        <span style={{ fontWeight: 'bold' }}>{num}.</span>
                        <PrintDisplay field={`song${num}`} width="60%" />
                        <PrintDisplay label="ต้นฉบับโดย" field={`ori${num}`} width="40%" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* ลายเซ็นอยู่ชิดขวา */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '60px' }}>
                  <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <PrintDisplay label="ลงชื่อ" field="signature" isSignature={true} />
                    <PrintDisplay label="วันที่ลงสมัคร" field="date" />
                  </div>
                </div>

                {/* หมายเหตุอยู่ล่างสุด */}
                <div style={{ fontSize: '22px', lineHeight: '1.5' }}>
                  <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '8px' }}>หมายเหตุ</div>
                  <div style={{ paddingLeft: '24px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}><span> </span><span>สามารถเลือกเพลง Original Song จาก AKB48 Overseas Sister Groups ได้</span></div>
                    <div style={{ display: 'flex', gap: '8px' }}><span> </span><span>ไม่สามารถเลือกเพลงซ้ำใน 3 อันดับที่เลือกได้</span></div>
                    <div style={{ display: 'flex', gap: '8px' }}><span> </span><span>ขอสงวนสิทธิ์ในการเลือกเพลงที่มีเนื้อหาที่สุ่มเสี่ยงขัดต่อวัฒนธรรมและสังคม</span></div>
                    <div style={{ display: 'flex', gap: '8px' }}><span> </span><span>แบบฟอร์มนี้จัดทำเพื่อความบันเทิงเท่านั้น ไม่ได้มีเจตนาแอบอ้างหรือค้ากำไรใด ๆ ทั้งสิ้น</span></div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}