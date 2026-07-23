"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ManageCodes() {
  const [codes, setCodes] = useState<any[]>([]);
  const [selectedCodeId, setSelectedCodeId] = useState<string>("new");
  const [isSaving, setIsSaving] = useState(false);

  // โครงสร้างข้อมูลสำหรับ Form
  const [formData, setFormData] = useState({
    name: "", 
    codeType: "", 
    activityTags: "", // เก็บเป็น string ก่อน ค่อย split ตอนเซฟ
    previewUrl: "", 
    htmlCode: "", 
    isLocked: false, 
    lockPassword: "",
    variations: [{ id: Date.now().toString(), label: "Default Theme", color: "#d8b4fe", replacements: "**สีหลัก**=#d8b4fe\n**ลิงก์ภาพเมจ**=https://iili.io/..." }]
  });

  const fetchCodes = async () => {
    try {
      const res = await fetch('/api/codes');
      if (res.ok) setCodes(await res.json());
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchCodes(); }, []);

  useEffect(() => {
    if (selectedCodeId === "new") {
      setFormData({
        name: "", codeType: "", activityTags: "", previewUrl: "", htmlCode: "", 
        isLocked: false, lockPassword: "",
        variations: [{ id: Date.now().toString(), label: "Default Theme", color: "#d8b4fe", replacements: "" }]
      });
    } else {
      const code = codes.find(c => c.id === selectedCodeId);
      if (code) {
        let parsedVariations = [];
        try {
          parsedVariations = code.variations ? JSON.parse(code.variations) : [];
        } catch { parsedVariations = []; }

        if (parsedVariations.length === 0) {
          parsedVariations = [{ id: Date.now().toString(), label: "Default Theme", color: "#d8b4fe", replacements: "" }];
        }

        setFormData({
          name: code.name || "",
          codeType: code.codeType || "",
          activityTags: code.activityTags ? code.activityTags.join(", ") : "",
          previewUrl: code.previewUrl || "",
          htmlCode: code.htmlCode || "",
          isLocked: code.isLocked || false,
          lockPassword: code.lockPassword || "",
          variations: parsedVariations
        });
      }
    }
  }, [selectedCodeId, codes]);

  // จัดการ Variations
  const handleVariationChange = (index: number, field: string, value: string) => {
    const newVariations = [...formData.variations];
    newVariations[index] = { ...newVariations[index], [field]: value };
    setFormData({ ...formData, variations: newVariations });
  };

  const addVariation = () => {
    setFormData({
      ...formData,
      variations: [...formData.variations, { id: Date.now().toString(), label: "New Theme", color: "#bae6fd", replacements: "" }]
    });
  };

  const removeVariation = (index: number) => {
    const newVariations = formData.variations.filter((_, i) => i !== index);
    setFormData({ ...formData, variations: newVariations });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const isNew = selectedCodeId === "new";
    
    // แปลง Tags จาก String เป็น Array
    const tagsArray = formData.activityTags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");

    const payload = {
      id: isNew ? Math.floor(10000 + Math.random() * 90000).toString() : selectedCodeId,
      name: formData.name,
      codeType: formData.codeType,
      activityTags: tagsArray,
      previewUrl: formData.previewUrl,
      htmlCode: formData.htmlCode,
      isLocked: formData.isLocked,
      lockPassword: formData.isLocked ? formData.lockPassword : "",
      variations: JSON.stringify(formData.variations) // เซฟเป็น JSON String
    };

    try {
      const res = await fetch('/api/codes', {
        method: isNew ? "POST" : "PUT", 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(isNew ? "✨ บันทึกโค้ดสำเร็จ!" : "✨ อัปเดตโค้ดสำเร็จ!");
        fetchCodes();
        if (isNew) {
          const newData = await res.json();
          setSelectedCodeId(newData.id);
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`❌ ระบบปฏิเสธการบันทึก: ${errorData.error}`);
      }
    } catch { alert("❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"); } 
    finally { setIsSaving(false); }
  };

  return (
    <div className="manage-page-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;600;700&display=swap');
        
        .manage-page-wrapper { 
          min-height: 100vh; padding: 4vw; 
          font-family: 'Google Sans', sans-serif; color: #2e1065;
          background: radial-gradient(circle at 15% 20%, #e9d5ff 0%, transparent 50%),
                      radial-gradient(circle at 85% 80%, #bae6fd 0%, transparent 50%),
                      linear-gradient(135deg, #f3e8ff 0%, #e0f2fe 100%);
          background-attachment: fixed;
        }
        .manage-page-wrapper * { box-sizing: border-box; }
        
        .glass-card { 
          background: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.8); 
          border-radius: 20px; padding: 32px; backdrop-filter: blur(16px); 
          box-shadow: 0 10px 40px rgba(139, 92, 246, 0.05); max-width: 900px; margin: 0 auto; width: 100%; 
        }
        
        /* 🌟 บังคับใส่ฟอนต์ให้ทุก Input และปุ่ม */
        input, select, textarea, button { font-family: 'Google Sans', sans-serif !important; }

        .form-group { margin-bottom: 20px; width: 100%; }
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; width: 100%; }
        @media(max-width: 600px) { .form-grid-2 { grid-template-columns: 1fr; } }
        
        .form-label { display: flex; justify-content: space-between; align-items: flex-end; font-weight: 600; margin-bottom: 8px; font-size: 0.95rem; color: #4c1d95; }
        .form-hint { font-size: 0.75rem; color: #6b21a8; font-weight: 400; opacity: 0.8; }
        
        .glass-input { 
          width: 100%; background: rgba(255,255,255,0.7); border: 1px solid rgba(216, 180, 254, 0.6); 
          border-radius: 12px; padding: 12px 14px; font-size: 0.95rem; outline: none; transition: 0.2s; color: #2e1065;
        }
        .glass-input:focus { border-color: #a855f7; background: rgba(255,255,255,0.9); box-shadow: 0 0 0 3px rgba(216, 180, 254, 0.3); }
        
        .code-textarea { font-family: monospace !important; font-size: 0.9rem; line-height: 1.5; background: rgba(255,255,255,0.8); }
        
        .section-title { font-size: 1.15rem; border-bottom: 2px solid rgba(139, 92, 246, 0.15); padding-bottom: 10px; margin: 36px 0 20px; font-weight: 700; color: #4c1d95; }
        
        /* สไตล์ปุ่มกดต่างๆ */
        .btn-submit { 
          width: 100%; background: linear-gradient(135deg, #d8b4fe, #bae6fd); border: 1px solid #fff; 
          border-radius: 12px; padding: 16px; font-weight: 700; font-size: 1.1rem; 
          cursor: pointer; margin-top: 30px; transition: 0.2s; color: #2e1065; box-shadow: 0 6px 20px rgba(216, 180, 254, 0.4); 
        }
        .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(216, 180, 254, 0.6); filter: brightness(1.05); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        
        .btn-add { display: inline-block; background: rgba(255,255,255,0.8); border: 1px dashed #a855f7; border-radius: 8px; padding: 10px 16px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: 0.2s; margin-top: 10px; color: #6b21a8; }
        .btn-add:hover { background: #f3e8ff; }
        
        .btn-remove { background: #fee2e2; color: #ef4444; border: none; border-radius: 8px; padding: 8px 12px; font-weight: 600; cursor: pointer; font-size: 0.85rem; transition: 0.2s; }
        .btn-remove:hover { background: #fca5a5; color: #991b1b; }

        .back-btn { display: inline-block; margin-bottom: 20px; text-decoration: none; font-weight: 600; color: #4c1d95; background: rgba(255,255,255,0.5); padding: 8px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.6); transition: 0.2s; }
        .back-btn:hover { background: rgba(255,255,255,0.8); transform: translateX(-4px); }

        /* กล่อง Variation */
        .variation-box { background: rgba(255,255,255,0.4); border: 1px solid rgba(216, 180, 254, 0.5); border-radius: 12px; padding: 20px; margin-bottom: 16px; position: relative; }
        .color-picker { padding: 2px; height: 42px; width: 60px; cursor: pointer; border-radius: 8px; border: 1px solid rgba(216, 180, 254, 0.6); }
        
        /* Lock Checkbox */
        .lock-container { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.5); padding: 16px; border-radius: 12px; border: 1px solid rgba(216, 180, 254, 0.6); }
        .lock-checkbox { width: 20px; height: 20px; accent-color: #a855f7; cursor: pointer; }
        .lock-label { font-weight: 600; cursor: pointer; color: #4c1d95; user-select: none; }
      `}} />

      <Link href="/codes" className="back-btn">← กลับไปหน้า Showcase</Link>
      
      <div className="glass-card">
        <h1 style={{textAlign: 'center', margin: '0 0 24px 0', color: '#2e1065'}}>⚙️ Manage Codes</h1>

        <div className="form-group" style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid rgba(139, 92, 246, 0.15)' }}>
          <label className="form-label">เลือกโหมดการจัดการ:</label>
          <select className="glass-input" style={{fontWeight: 'bold', fontSize: '1rem'}} value={selectedCodeId} onChange={(e) => setSelectedCodeId(e.target.value)}>
            <option value="new">✨ + เพิ่มโค้ดใหม่</option>
            <optgroup label="แก้ไขโค้ดที่มีอยู่">
              {codes.map(c => <option key={c.id} value={c.id}>✏️ {c.name} {c.isLocked ? '(🔒)' : ''}</option>)}
            </optgroup>
          </select>
        </div>

        <form onSubmit={handleSave}>
          {/* ================= 1. ข้อมูลทั่วไป ================= */}
          <h3 className="section-title">📌 ข้อมูลทั่วไป</h3>
          <div className="form-group">
            <label className="form-label">ชื่อชุดโค้ด *</label>
            <input type="text" required className="glass-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">ประเภทโค้ด *</label>
              <input type="text" required className="glass-input" placeholder="เช่น Character Card, Timeline" value={formData.codeType} onChange={e => setFormData({...formData, codeType: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label"><span>ชื่อกิจกรรม / แท็กเสริม</span><span className="form-hint">(คั่นด้วยลูกน้ำ ,)</span></label>
              <input type="text" className="glass-input" placeholder="เช่น Event Hallow, AU TH" value={formData.activityTags} onChange={e => setFormData({...formData, activityTags: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">URL ภาพพรีวิว</label>
            <input type="url" className="glass-input" placeholder="https://..." value={formData.previewUrl} onChange={e => setFormData({...formData, previewUrl: e.target.value})} />
          </div>

          {/* ================= 2. ระบบความปลอดภัย ================= */}
          <h3 className="section-title">🔒 ตั้งค่าความเป็นส่วนตัว</h3>
          <div className="form-group">
            <label className="lock-container">
              <input type="checkbox" className="lock-checkbox" checked={formData.isLocked} onChange={e => setFormData({...formData, isLocked: e.target.checked})} />
              <span className="lock-label">ล็อกโค้ดนี้ (ซ่อนจากหน้าค้นหา และเบลอภาพพรีวิว)</span>
            </label>
          </div>
          
          {formData.isLocked && (
            <div className="form-group" style={{ marginTop: '16px', animation: 'fadeIn 0.3s' }}>
              <label className="form-label">รหัสผ่านสำหรับปลดล็อก *</label>
              <input type="text" required={formData.isLocked} className="glass-input" placeholder="ตั้งรหัสผ่านสำหรับโค้ดนี้..." value={formData.lockPassword} onChange={e => setFormData({...formData, lockPassword: e.target.value})} style={{ borderColor: '#f87171' }} />
            </div>
          )}

          {/* ================= 3. โค้ด HTML ================= */}
          <h3 className="section-title">💻 โค้ด HTML (Template)</h3>
          <div className="form-group">
            <label className="form-label">
              <span>วางโค้ด HTML ที่นี่</span>
              <span className="form-hint">ระบุตัวแปรที่ต้องการให้คนเปลี่ยนด้วย **ชื่อตัวแปร**</span>
            </label>
            <textarea 
              required className="glass-input code-textarea" rows={12} 
              placeholder={`<div style="color: **สีหลัก**; background-image: url(**ลิงก์ภาพเมจ**);">\n  <h1>**ชื่อตัวละคร**</h1>\n</div>`}
              value={formData.htmlCode} onChange={e => setFormData({...formData, htmlCode: e.target.value})} 
            />
          </div>

          {/* ================= 4. Variations ================= */}
          <h3 className="section-title">🎨 Variations (ตัวเลือกสี / พรีเซ็ต)</h3>
          <p style={{ fontSize: '0.85rem', color: '#6b21a8', marginBottom: '16px' }}>สร้างปุ่มพรีเซ็ตเพื่อให้ผู้ใช้กดดูตัวอย่างสีหรือสไตล์ต่างๆ ได้</p>
          
          {formData.variations.map((v, index) => (
            <div key={v.id} className="variation-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, color: '#4c1d95' }}>พรีเซ็ต #{index + 1}</h4>
                {formData.variations.length > 1 && (
                  <button type="button" className="btn-remove" onClick={() => removeVariation(index)}>✕ ลบพรีเซ็ตนี้</button>
                )}
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">ชื่อพรีเซ็ต (เช่น โทนสว่าง)</label>
                  <input type="text" required className="glass-input" value={v.label} onChange={e => handleVariationChange(index, 'label', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">สีปุ่มพรีวิว (กดเลือกสีได้เลย)</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input type="color" className="color-picker" value={v.color} onChange={e => handleVariationChange(index, 'color', e.target.value)} />
                    <input type="text" className="glass-input" value={v.color} onChange={e => handleVariationChange(index, 'color', e.target.value)} style={{ fontFamily: 'monospace' }} />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <span>ตัวแปรที่ต้องการแทนที่ (Replacement Rules)</span>
                  <span className="form-hint">ใส่บรรทัดละ 1 ค่า รูปแบบ: **ตัวแปร**=ค่าที่ต้องการ</span>
                </label>
                <textarea 
                  className="glass-input code-textarea" rows={4} 
                  placeholder={"**สีหลัก**=#ff0000\n**ลิงก์ภาพเมจ**=https://iili.io/example.png\n**ชื่อตัวละคร**=John Doe"}
                  value={v.replacements} onChange={e => handleVariationChange(index, 'replacements', e.target.value)} 
                />
              </div>
            </div>
          ))}
          
          <button type="button" className="btn-add" onClick={addVariation}>+ เพิ่มพรีเซ็ต (Variation)</button>

          {/* ================= ปุ่ม Submit ================= */}
          <button type="submit" className="btn-submit" disabled={isSaving}>
            {isSaving ? "กำลังบันทึก..." : (selectedCodeId === "new" ? "✨ บันทึกโค้ดใหม่ลงคลัง" : "💾 อัปเดตข้อมูลโค้ด")}
          </button>
        </form>
      </div>
    </div>
  );
}