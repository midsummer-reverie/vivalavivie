"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ManageCodes() {
  const [codes, setCodes] = useState<any[]>([]);
  const [selectedCodeId, setSelectedCodeId] = useState<string>("new");
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "", 
    codeType: "", 
    activityTags: "",
    previewUrl: "", 
    htmlCode: "", 
    isLocked: false, 
    lockPassword: "",
    variations: [{ id: Date.now().toString(), label: "Default Theme", color: "#d8b4fe", replacements: "**สีหลัก**=#d8b4fe" }],
    customFields: [] as { id: string, label: string, variableName: string, type: string }[] 
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
        variations: [{ id: Date.now().toString(), label: "Default Theme", color: "#d8b4fe", replacements: "" }],
        customFields: []
      });
    } else {
      const code = codes.find(c => c.id === selectedCodeId);
      if (code) {
        let parsedVariations = [];
        let parsedCustomFields = [];
        try { parsedVariations = code.variations ? JSON.parse(code.variations) : []; } catch { parsedVariations = []; }
        try { parsedCustomFields = code.customFields ? JSON.parse(code.customFields) : []; } catch { parsedCustomFields = []; }

        if (parsedVariations.length === 0) parsedVariations = [{ id: Date.now().toString(), label: "Default Theme", color: "#d8b4fe", replacements: "" }];

        setFormData({
          name: code.name || "",
          codeType: code.codeType || "",
          activityTags: code.activityTags ? code.activityTags.join(", ") : "",
          previewUrl: code.previewUrl || "",
          htmlCode: code.htmlCode || "",
          isLocked: code.isLocked || false,
          lockPassword: code.lockPassword || "",
          variations: parsedVariations,
          customFields: parsedCustomFields
        });
      }
    }
  }, [selectedCodeId, codes]);

  const handleVariationChange = (index: number, field: string, value: string) => {
    const newVariations = [...formData.variations];
    newVariations[index] = { ...newVariations[index], [field]: value };
    setFormData({ ...formData, variations: newVariations });
  };
  const addVariation = () => setFormData({ ...formData, variations: [...formData.variations, { id: Date.now().toString(), label: "New Theme", color: "#bae6fd", replacements: "" }] });
  const removeVariation = (index: number) => setFormData({ ...formData, variations: formData.variations.filter((_, i) => i !== index) });

  const handleCustomFieldChange = (index: number, field: string, value: string) => {
    const newFields = [...formData.customFields];
    newFields[index] = { ...newFields[index], [field]: value };
    setFormData({ ...formData, customFields: newFields });
  };
  const addCustomField = () => setFormData({ ...formData, customFields: [...formData.customFields, { id: Date.now().toString(), label: "ชื่อตัวละคร", variableName: "**ชื่อตัวละคร**", type: "text" }] });
  const removeCustomField = (index: number) => setFormData({ ...formData, customFields: formData.customFields.filter((_, i) => i !== index) });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const isNew = selectedCodeId === "new";
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
      variations: JSON.stringify(formData.variations),
      customFields: JSON.stringify(formData.customFields)
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
        .manage-page-wrapper { min-height: 100vh; padding: 4vw; font-family: 'Google Sans', sans-serif; color: #2e1065; background: radial-gradient(circle at 15% 20%, #e9d5ff 0%, transparent 50%), radial-gradient(circle at 85% 80%, #bae6fd 0%, transparent 50%), linear-gradient(135deg, #f3e8ff 0%, #e0f2fe 100%); background-attachment: fixed; }
        .manage-page-wrapper * { box-sizing: border-box; }
        input, select, textarea, button { font-family: 'Google Sans', sans-serif !important; }
        .glass-card { background: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.8); border-radius: 20px; padding: 32px; backdrop-filter: blur(16px); box-shadow: 0 10px 40px rgba(139, 92, 246, 0.05); max-width: 900px; margin: 0 auto; width: 100%; }
        .form-group { margin-bottom: 20px; width: 100%; }
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; width: 100%; }
        @media(max-width: 600px) { .form-grid-2 { grid-template-columns: 1fr; } }
        .form-label { display: flex; justify-content: space-between; align-items: flex-end; font-weight: 600; margin-bottom: 8px; font-size: 0.95rem; color: #4c1d95; }
        .form-hint { font-size: 0.75rem; color: #6b21a8; font-weight: 400; opacity: 0.8; }
        .glass-input { width: 100%; background: rgba(255,255,255,0.7); border: 1px solid rgba(216, 180, 254, 0.6); border-radius: 12px; padding: 12px 14px; font-size: 0.95rem; outline: none; transition: 0.2s; color: #2e1065; }
        .glass-input:focus { border-color: #a855f7; background: rgba(255,255,255,0.9); box-shadow: 0 0 0 3px rgba(216, 180, 254, 0.3); }
        .code-textarea { font-family: monospace !important; font-size: 0.9rem; line-height: 1.5; background: rgba(255,255,255,0.8); }
        .section-title { font-size: 1.15rem; border-bottom: 2px solid rgba(139, 92, 246, 0.15); padding-bottom: 10px; margin: 36px 0 20px; font-weight: 700; color: #4c1d95; }
        .btn-submit { width: 100%; background: linear-gradient(135deg, #d8b4fe, #bae6fd); border: 1px solid #fff; border-radius: 12px; padding: 16px; font-weight: 700; font-size: 1.1rem; cursor: pointer; margin-top: 30px; transition: 0.2s; color: #2e1065; box-shadow: 0 6px 20px rgba(216, 180, 254, 0.4); }
        .btn-submit:hover { transform: translateY(-2px); filter: brightness(1.05); }
        .btn-add { display: inline-block; background: rgba(255,255,255,0.8); border: 1px dashed #a855f7; border-radius: 8px; padding: 10px 16px; font-size: 0.9rem; font-weight: 600; cursor: pointer; color: #6b21a8; margin-top: 10px; }
        .btn-remove { background: #fee2e2; color: #ef4444; border: none; border-radius: 8px; padding: 8px 12px; font-weight: 600; cursor: pointer; font-size: 0.85rem; }
        .back-btn { display: inline-block; margin-bottom: 20px; text-decoration: none; font-weight: 600; color: #4c1d95; background: rgba(255,255,255,0.5); padding: 8px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.6); }
        .variation-box { background: rgba(255,255,255,0.4); border: 1px solid rgba(216, 180, 254, 0.5); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
        .color-picker { padding: 2px; height: 42px; width: 60px; cursor: pointer; border-radius: 8px; border: 1px solid rgba(216, 180, 254, 0.6); }
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
          <h3 className="section-title">📌 ข้อมูลทั่วไป</h3>
          <div className="form-group"><label className="form-label">ชื่อชุดโค้ด *</label><input type="text" required className="glass-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          <div className="form-grid-2">
            <div className="form-group"><label className="form-label">ประเภทโค้ด *</label><input type="text" required className="glass-input" value={formData.codeType} onChange={e => setFormData({...formData, codeType: e.target.value})} /></div>
            <div className="form-group"><label className="form-label"><span>แท็กเสริม</span></label><input type="text" className="glass-input" value={formData.activityTags} onChange={e => setFormData({...formData, activityTags: e.target.value})} /></div>
          </div>
          <div className="form-group"><label className="form-label">URL ภาพพรีวิว</label><input type="url" className="glass-input" value={formData.previewUrl} onChange={e => setFormData({...formData, previewUrl: e.target.value})} /></div>

          <h3 className="section-title">💻 โค้ด HTML (Template)</h3>
          <div className="form-group">
            <label className="form-label"><span>วางโค้ด HTML (รองรับ **ตัวแปร** แบบเดิม และแบบเก่า center/cover)</span></label>
            <textarea required className="glass-input code-textarea" rows={10} value={formData.htmlCode} onChange={e => setFormData({...formData, htmlCode: e.target.value})} />
          </div>

          <h3 className="section-title">🎨 Variations (ปุ่มสีพรีเซ็ต)</h3>
          {formData.variations.map((v, index) => (
            <div key={v.id} className="variation-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, color: '#4c1d95' }}>พรีเซ็ต #{index + 1}</h4>
                {formData.variations.length > 1 && (<button type="button" className="btn-remove" onClick={() => removeVariation(index)}>✕ ลบ</button>)}
              </div>
              <div className="form-grid-2">
                <div className="form-group"><label className="form-label">ชื่อพรีเซ็ต</label><input type="text" required className="glass-input" value={v.label} onChange={e => handleVariationChange(index, 'label', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">สีปุ่มพรีวิว</label><input type="color" className="color-picker" value={v.color} onChange={e => handleVariationChange(index, 'color', e.target.value)} /></div>
              </div>
              <div className="form-group">
                <label className="form-label"><span>ตัวแปรสีเริ่มต้น</span></label>
                <textarea className="glass-input code-textarea" rows={2} value={v.replacements} onChange={e => handleVariationChange(index, 'replacements', e.target.value)} />
              </div>
            </div>
          ))}
          <button type="button" className="btn-add" onClick={addVariation}>+ เพิ่มพรีเซ็ต</button>

          <h3 className="section-title">🛠️ กำหนดจุดที่ให้ผู้ใช้ปรับแต่ง (Custom Fields)</h3>
          {formData.customFields.map((field, index) => (
            <div key={field.id} className="variation-box" style={{ borderColor: '#60a5fa', background: 'rgba(239, 246, 255, 0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, color: '#1e3a8a' }}>จุดที่ #{index + 1}</h4>
                <button type="button" className="btn-remove" onClick={() => removeCustomField(index)}>✕ ลบจุดนี้</button>
              </div>
              <div className="form-grid-2">
                <div className="form-group"><label className="form-label">ชื่อป้ายกำกับ</label><input type="text" required className="glass-input" value={field.label} onChange={e => handleCustomFieldChange(index, 'label', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">ชื่อตัวแปรในโค้ด (เช่น **ลิงก์ภาพเมจ**)</label><input type="text" required className="glass-input" style={{ fontFamily: 'monospace' }} value={field.variableName} onChange={e => handleCustomFieldChange(index, 'variableName', e.target.value)} /></div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">ประเภท</label>
                <select className="glass-input" value={field.type} onChange={e => handleCustomFieldChange(index, 'type', e.target.value)}>
                  <option value="text">✏️ ข้อความสั้น (Input)</option>
                  <option value="richtext">📝 ข้อความยาว / Text Editor</option>
                  <option value="roleplay">🎭 กล่อง Roleplay (นับคำ MS Word + Text Editor)</option>
                  <option value="color">🎨 สี (Color Picker)</option>
                  <option value="image">🖼️ รูปภาพ (ปรับซูม/เลื่อนตำแหน่ง หรือรองรับโค้ดเก่า center/cover)</option>
                </select>
              </div>
            </div>
          ))}
          <button type="button" className="btn-add" onClick={addCustomField}>+ เพิ่มจุดปรับแต่ง</button>

          <button type="submit" className="btn-submit" disabled={isSaving}>
            {isSaving ? "กำลังบันทึก..." : (selectedCodeId === "new" ? "✨ บันทึกโค้ดใหม่" : "💾 อัปเดตข้อมูล")}
          </button>
        </form>
      </div>
    </div>
  );
}