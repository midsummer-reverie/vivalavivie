"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ==========================================
// 🛠️ สร้าง Component: แถบเครื่องมือ Text Editor
// ==========================================
const HtmlEditor = ({ value, onChange, placeholder, minHeight = "120px" }: { value: string, onChange: (val: string) => void, placeholder?: string, minHeight?: string }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string, defaultText: string = "") => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const handleLink = () => {
    const url = prompt("🔗 กรุณาวาง URL ที่ต้องการลิงก์ไป:");
    if (url) {
      insertText(`<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #4ea8de; text-decoration: underline;">`, '</a>', 'ข้อความลิงก์');
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-toolbar">
        <button type="button" className="editor-btn" onClick={() => insertText('<b>', '</b>')} title="ตัวหนา"><b>B</b></button>
        <button type="button" className="editor-btn" onClick={() => insertText('<i>', '</i>')} title="ตัวเอียง"><i>I</i></button>
        <button type="button" className="editor-btn" onClick={() => insertText('<u>', '</u>')} title="ขีดเส้นใต้"><u>U</u></button>
        <div className="editor-divider"></div>
        <button type="button" className="editor-btn" onClick={() => insertText('<ul>\n  <li>', '</li>\n</ul>\n')} title="รายการ (List)">⁝三</button>
        <button type="button" className="editor-btn" onClick={() => insertText('<div style="text-align: left;">\n', '\n</div>\n')} title="จัดซ้าย">⫷</button>
        <button type="button" className="editor-btn" onClick={() => insertText('<div style="text-align: center;">\n', '\n</div>\n')} title="จัดกลาง">≡</button>
        <button type="button" className="editor-btn" onClick={() => insertText('<div style="text-align: right;">\n', '\n</div>\n')} title="จัดขวา">⫸</button>
        <div className="editor-divider"></div>
        <button type="button" className="editor-btn" onClick={handleLink} title="แทรกลิงก์">🔗</button>
        <button type="button" className="editor-btn" onClick={() => insertText('<details style="background: rgba(255,255,255,0.4); padding: 10px; border-radius: 8px; margin: 8px 0;">\n  <summary style="font-weight: bold; cursor: pointer;">คลิกเพื่ออ่านเพิ่มเติม</summary>\n  <div style="padding-top: 10px;">\n    ', '\n  </div>\n</details>\n')} title="แทรก Spoiler (Details)">📂</button>
      </div>
      <textarea ref={textareaRef} className="glass-input editor-textarea" style={{ minHeight }} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
};
// ==========================================

export default function ManageCharacters() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [selectedCharId, setSelectedCharId] = useState<string>("new");
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "", verse: "", imageUrl: "", description: "",
    themeColor: "#add6ff", nickname: "", age: "", birthday: "", hometown: "",
    currentLocation: "", faceclaim: "", personality: "", tmi: "", iconImage: "",
    gallery: [{ url: "", credit: "" }], youtubeUrl: "", youtubeSongName: ""
  });

  const fetchCharacters = async () => {
    try {
      const res = await fetch('/api/characters');
      if (res.ok) setCharacters(await res.json());
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchCharacters(); }, []);

  useEffect(() => {
    if (selectedCharId === "new") {
      setFormData({
        name: "", verse: "", imageUrl: "", description: "",
        themeColor: "#add6ff", nickname: "", age: "", birthday: "", hometown: "",
        currentLocation: "", faceclaim: "", personality: "", tmi: "", iconImage: "",
        gallery: [{ url: "", credit: "" }], youtubeUrl: "", youtubeSongName: ""
      });
    } else {
      const char = characters.find(c => c.id === selectedCharId);
      if (char) {
        const parsedGallery = char.gallery && char.gallery.length > 0 
          ? char.gallery.map((g: string) => {
              try { const obj = JSON.parse(g); return obj.url !== undefined ? obj : { url: g, credit: "" }; }
              catch { return { url: g, credit: "" }; }
            })
          : [{ url: "", credit: "" }];

        setFormData({
          name: char.name || "", verse: char.verseTag && char.verseTag.length > 0 ? char.verseTag[0] : "",
          imageUrl: char.image || char.imageUrl || "", description: char.description || "",
          themeColor: char.themeColor || "#add6ff", nickname: char.nickname || "",
          age: char.age || "", birthday: char.birthday || "", hometown: char.hometown || "",
          currentLocation: char.currentLocation || "", faceclaim: char.faceclaim || "",
          personality: char.personality || "", tmi: char.tmi || "", iconImage: char.iconImage || "",
          gallery: parsedGallery, youtubeUrl: char.youtubeSongId ? `https://youtube.com/watch?v=${char.youtubeSongId}` : "",
          youtubeSongName: char.youtubeSongName || ""
        });
      }
    }
  }, [selectedCharId, characters]);

  const extractYoutubeId = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const handleGalleryChange = (index: number, field: 'url' | 'credit', value: string) => {
    const newGallery = [...formData.gallery];
    newGallery[index][field] = value;
    setFormData({ ...formData, gallery: newGallery });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const isNew = selectedCharId === "new";
    const payload = {
      id: isNew ? Math.floor(1000 + Math.random() * 9000).toString() : selectedCharId,
      name: formData.name, verseTag: formData.verse, image: formData.imageUrl, description: formData.description,
      themeColor: formData.themeColor, nickname: formData.nickname, age: formData.age, birthday: formData.birthday,
      hometown: formData.hometown, currentLocation: formData.currentLocation, faceclaim: formData.faceclaim,
      personality: formData.personality, tmi: formData.tmi, iconImage: formData.iconImage,
      gallery: formData.gallery.filter(g => g.url.trim() !== "").map(g => JSON.stringify(g)),
      youtubeSongId: extractYoutubeId(formData.youtubeUrl), youtubeSongName: formData.youtubeSongName
    };

    try {
      const res = await fetch('/api/characters', {
        method: isNew ? "POST" : "PUT", headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(isNew ? "✨ สร้างตัวละครสำเร็จ!" : "✨ อัปเดตข้อมูลสำเร็จ!");
        fetchCharacters();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`❌ ระบบปฏิเสธการบันทึก: ${errorData.error}`);
      }
    } catch { alert("❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"); } 
    finally { setIsSaving(false); }
  };

  return (
    <div className="manage-page-wrapper" style={{ '--glass-bg': 'rgba(255,255,255,0.45)', '--glass-border': 'rgba(255,255,255,0.6)', '--glass-blur': '16px', '--text-dark': '#2c2c34', '--radius-md': '12px' } as any}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;600;700&display=swap');
        .manage-page-wrapper * { box-sizing: border-box; }
        .manage-page-wrapper { min-height: 100vh; padding: 4vw; font-family: 'Google Sans', sans-serif; background: #f0f9ff; color: var(--text-dark); }
        .glass-card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 20px; padding: 30px; backdrop-filter: blur(var(--glass-blur)); box-shadow: 0 10px 40px rgba(0,0,0,0.05); max-width: 900px; margin: 0 auto; width: 100%; }
        .form-group { margin-bottom: 18px; width: 100%; }
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; width: 100%; }
        @media(max-width: 600px) { .form-grid-2 { grid-template-columns: 1fr; } }
        .form-label { display: flex; justify-content: space-between; align-items: flex-end; font-weight: 600; margin-bottom: 8px; font-size: 0.95rem; }
        .form-hint { font-size: 0.75rem; color: #666; font-weight: 400; }
        .glass-input { width: 100%; background: rgba(255,255,255,0.6); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 12px 14px; font-family: inherit; font-size: 0.95rem; outline: none; transition: 0.2s; }
        .glass-input:focus { border-color: #8fb4e3; background: rgba(255,255,255,0.9); box-shadow: 0 0 0 3px rgba(143,180,227,0.2); }
        .color-picker-container { display: flex; align-items: center; gap: 12px; }
        .color-picker { padding: 2px; height: 45px; width: 60px; cursor: pointer; }
        .hex-input { width: 120px; font-family: monospace; text-transform: uppercase; font-weight: bold; }
        .section-title { font-size: 1.15rem; border-bottom: 2px solid rgba(0,0,0,0.08); padding-bottom: 10px; margin: 36px 0 20px; font-weight: 700; color: #444; }
        .btn-submit { width: 100%; background: #a8cbf0; border: none; border-radius: var(--radius-md); padding: 16px; font-family: 'Google Sans', sans-serif; font-weight: 700; font-size: 1.1rem; cursor: pointer; margin-top: 30px; transition: 0.2s; color: #111; }
        .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(143, 180, 227, 0.4); }
        .btn-add-img { display: inline-block; background: rgba(255,255,255,0.8); border: 1px dashed #8fb4e3; border-radius: 8px; padding: 10px 16px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: 0.2s; margin-top: 10px; font-family: 'Google Sans'; }
        .btn-add-img:hover { background: #e0f2fe; }
        .back-btn { display: inline-block; margin-bottom: 20px; text-decoration: none; font-weight: 600; color: #555; background: rgba(255,255,255,0.5); padding: 8px 16px; border-radius: 12px; }
        .editor-container { background: rgba(255,255,255,0.5); border: 1px solid var(--glass-border); border-radius: var(--radius-md); overflow: hidden; display: flex; flex-direction: column; }
        .editor-toolbar { display: flex; gap: 4px; padding: 8px 12px; background: rgba(255,255,255,0.7); border-bottom: 1px solid var(--glass-border); align-items: center; flex-wrap: wrap; }
        .editor-btn { background: transparent; border: none; border-radius: 6px; padding: 6px 10px; font-family: inherit; font-size: 0.95rem; cursor: pointer; color: var(--text-dark); transition: 0.2s; font-weight: 600; }
        .editor-btn:hover { background: rgba(255,255,255,0.9); box-shadow: 0 2px 5px rgba(0,0,0,0.05); transform: translateY(-1px); }
        .editor-divider { width: 1px; height: 18px; background: rgba(0,0,0,0.1); margin: 0 4px; }
        .editor-textarea { border: none !important; border-radius: 0 !important; background: transparent !important; resize: vertical; line-height: 1.6; padding: 14px !important; }
        .editor-textarea:focus { box-shadow: none !important; background: rgba(255,255,255,0.2) !important; }
      `}} />

      <Link href="/characters" className="back-btn">← กลับไปหน้า Characters</Link>
      <div className="glass-card">
        <h1 style={{textAlign: 'center', marginTop: 0}}>⚙️ Manage Character</h1>

        <div className="form-group" style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <label className="form-label">เลือกโหมดการจัดการ:</label>
          <select className="glass-input" style={{fontWeight: 'bold', fontSize: '1rem'}} value={selectedCharId} onChange={(e) => setSelectedCharId(e.target.value)}>
            <option value="new">✨ + สร้างตัวละครใหม่</option>
            <optgroup label="แก้ไขตัวละครที่มีอยู่">
              {characters.map(char => <option key={char.id} value={char.id}>✏️ {char.name}</option>)}
            </optgroup>
          </select>
        </div>

        <form onSubmit={handleSave}>
          <h3 className="section-title">📌 ข้อมูลหลัก</h3>
          <div className="form-grid-2">
            <div className="form-group"><label className="form-label">ชื่อตัวละคร *</label><input type="text" required className="glass-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Verse ที่มา (Tag) *</label><input type="text" required className="glass-input" placeholder="เช่น Cakeverse" value={formData.verse} onChange={e => setFormData({...formData, verse: e.target.value})} /></div>
          </div>
          <div className="form-group">
            <label className="form-label">สี Theme พื้นหลัง 🎨</label>
            <div className="color-picker-container">
              <input type="color" className="glass-input color-picker" value={formData.themeColor} onChange={e => setFormData({...formData, themeColor: e.target.value})} />
              <input type="text" className="glass-input hex-input" value={formData.themeColor} onChange={e => setFormData({...formData, themeColor: e.target.value})} maxLength={7} />
            </div>
          </div>

          <h3 className="section-title">👤 ข้อมูลส่วนตัว</h3>
          <div className="form-grid-2">
            <div className="form-group"><label className="form-label">ชื่อเล่น</label><input type="text" className="glass-input" value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">อายุ</label><input type="text" className="glass-input" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">วันเกิด</label><input type="text" className="glass-input" value={formData.birthday} onChange={e => setFormData({...formData, birthday: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">บ้านเกิด</label><input type="text" className="glass-input" value={formData.hometown} onChange={e => setFormData({...formData, hometown: e.target.value})} /></div>
            
            {/* 🌟 ย้าย Face Claim มาคู่กับ ที่อยู่ปัจจุบัน ตรงนี้เลย */}
            <div className="form-group"><label className="form-label">ที่อยู่ปัจจุบัน</label><input type="text" className="glass-input" value={formData.currentLocation} onChange={e => setFormData({...formData, currentLocation: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Face Claim (อิมเมจ)</label><input type="text" className="glass-input" placeholder="ชื่อตัวละคร / บุคคล" value={formData.faceclaim} onChange={e => setFormData({...formData, faceclaim: e.target.value})} /></div>
          </div>

          <div className="form-group">
            <label className="form-label"><span>ลักษณะนิสัย</span><span className="form-hint">(เว้นบรรทัด, ตกแต่งข้อความได้)</span></label>
            <HtmlEditor value={formData.personality} onChange={(val) => setFormData({...formData, personality: val})} minHeight="100px" placeholder="พิมพ์ลักษณะนิสัยที่นี่..." />
          </div>
          <div className="form-group">
            <label className="form-label"><span>ประวัติความเป็นมา</span><span className="form-hint">(เว้นบรรทัด, ตกแต่งข้อความได้)</span></label>
            <HtmlEditor value={formData.description} onChange={(val) => setFormData({...formData, description: val})} minHeight="150px" placeholder="พิมพ์เนื้อเรื่องตัวละครที่นี่..." />
          </div>
          <div className="form-group">
            <label className="form-label"><span>TMI (Too Much Info)</span><span className="form-hint">(เว้นบรรทัด, ตกแต่งข้อความได้)</span></label>
            <HtmlEditor value={formData.tmi} onChange={(val) => setFormData({...formData, tmi: val})} minHeight="120px" placeholder="พิมพ์ข้อมูลน่ารู้ที่นี่..." />
          </div>

          <h3 className="section-title">🖼️ รูปภาพและแกลเลอรี</h3>
          <div className="form-group"><label className="form-label">URL ภาพปก (หน้า Detail - แนวตั้ง) *</label><input type="url" required className="glass-input" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} /></div>
          
          <label className="form-label" style={{marginTop: '20px'}}>แกลเลอรีรูปภาพ (ไม่จำกัดจำนวน)</label>
          <div style={{ background: 'rgba(255,255,255,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
            {formData.gallery.map((img, i) => (
              <div key={i} className="form-grid-2" style={{ marginBottom: '12px', gap: '12px' }}>
                <input type="url" placeholder={`URL ภาพที่ ${i+1}`} className="glass-input" value={img.url} onChange={e => handleGalleryChange(i, 'url', e.target.value)} />
                <input type="text" placeholder={`รายละเอียด / เครดิตนักวาด`} className="glass-input" value={img.credit} onChange={e => handleGalleryChange(i, 'credit', e.target.value)} />
              </div>
            ))}
            <button type="button" className="btn-add-img" onClick={() => setFormData({ ...formData, gallery: [...formData.gallery, { url: "", credit: "" }] })}>+ เพิ่มรูปภาพอีก</button>
          </div>

          <h3 className="section-title">🎵 เพลงประจำตัว (YouTube)</h3>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">ชื่อเพลง</label>
              <input type="text" className="glass-input" placeholder="เช่น Cupid - FIFTY FIFTY" value={formData.youtubeSongName} onChange={e => setFormData({...formData, youtubeSongName: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">ลิงก์ YouTube (หรือ Video ID)</label>
              <input type="text" className="glass-input" placeholder="https://youtube.com/watch?v=..." value={formData.youtubeUrl} onChange={e => setFormData({...formData, youtubeUrl: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={isSaving}>
            {isSaving ? "กำลังบันทึก..." : (selectedCharId === "new" ? "✨ บันทึกตัวละครใหม่" : "💾 อัปเดตข้อมูล")}
          </button>
        </form>
      </div>
    </div>
  );
}