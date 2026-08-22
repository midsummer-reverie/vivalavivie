"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ManageCodes() {
  const [codes, setCodes] = useState<any[]>([]);
  const [selectedCodeId, setSelectedCodeId] = useState<string>("new");
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "", codeType: "", activityTags: [] as string[], eventTags: [] as string[], 
    previewUrl: "", htmlCode: "", description: "",
    isLocked: false, lockPassword: "", isCommission: false, 
    variations: [{ id: Date.now().toString(), label: "Default Theme", color: "#d8b4fe", type: "replace", replacements: "**สีหลัก**=#d8b4fe", fullHtml: "" }],
    customFields: [] as any[],
    blocks: [] as any[]
  });

  const [tagInput, setTagInput] = useState(""); 
  const [eventTagInput, setEventTagInput] = useState("");

  const fetchCodes = async () => {
    try {
      const res = await fetch('/api/codes');
      if (res.ok) setCodes(await res.json());
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    const textareas = document.querySelectorAll('.code-textarea');
    textareas.forEach(el => {
      const target = el as HTMLTextAreaElement;
      target.style.height = 'auto';
      target.style.height = target.scrollHeight + 'px';
    });
  }, [formData.htmlCode, formData.variations, formData.blocks, selectedCodeId]);

  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, onChangeCallback: (val: string) => void) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChangeCallback(newValue);
      setTimeout(() => { target.selectionStart = target.selectionEnd = start + 2; }, 0);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const t = tagInput.trim().replace(/,/g, '');
      if (t && !formData.activityTags.includes(t)) {
        setFormData({ ...formData, activityTags: [...formData.activityTags, t] });
      }
      setTagInput("");
    }
  };
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, activityTags: formData.activityTags.filter(t => t !== tagToRemove) });
  };

  const handleAddEventTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const t = eventTagInput.trim().replace(/,/g, '');
      if (t && !formData.eventTags.includes(t)) {
        setFormData({ ...formData, eventTags: [...formData.eventTags, t] });
      }
      setEventTagInput("");
    }
  };
  const handleRemoveEventTag = (tagToRemove: string) => {
    setFormData({ ...formData, eventTags: formData.eventTags.filter(t => t !== tagToRemove) });
  };

  // 🌟 ฟังก์ชันจัดการ Custom Fields (รวมปุ่มเลื่อนขึ้น-ลง)
  const handleCustomFieldChange = (index: number, field: string, value: any) => {
    const newFields = [...formData.customFields];
    newFields[index] = { ...newFields[index], [field]: value };
    setFormData({ ...formData, customFields: newFields });
  };
  const addCustomField = () => setFormData({ ...formData, customFields: [...formData.customFields, { id: Date.now().toString(), label: "ชื่อตัวละคร", variableName: "**ชื่อตัวละคร**", type: "text", options: "", conditionVar: "", conditionVal: "" }] });
  const removeCustomField = (index: number) => setFormData({ ...formData, customFields: formData.customFields.filter((_, i) => i !== index) });
  const moveCustomField = (index: number, direction: 'up' | 'down') => {
    const newArr = [...formData.customFields];
    if (direction === 'up' && index > 0) {
      [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
    } else if (direction === 'down' && index < newArr.length - 1) {
      [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
    }
    setFormData({ ...formData, customFields: newArr });
  };

  // 🌟 ฟังก์ชันจัดการ Blocks
  const handleAddBlock = (type: string) => {
    let newBlock = { id: `block_${Date.now()}`, name: "", placeholder: "", html: "", fields: [] as any[] };
    if (type === "gallery") {
      newBlock = { ...newBlock, name: "แกลลอรี่ภาพ", placeholder: "[[GALLERY_HERE]]", html: "<div class=\"gallery\">\n  <img src=\"**IMG_1**\" />\n</div>", fields: [{ id: `field_${Date.now()}_1`, variableName: "**IMG_1**", label: "รูปที่ 1", type: "image" }] };
    } else if (type === "textbox") {
      newBlock = { ...newBlock, name: "กล่องข้อความ", placeholder: "[[TEXTBOX_HERE]]", html: "<div class=\"textbox\">\n  <p>**TEXT_1**</p>\n</div>", fields: [{ id: `field_${Date.now()}_1`, variableName: "**TEXT_1**", label: "ข้อความ", type: "richtext" }] };
    } else {
      newBlock = { ...newBlock, name: "บล็อกเปล่า", placeholder: "[[PLACEHOLDER]]" };
    }
    setFormData({ ...formData, blocks: [...formData.blocks, newBlock] });
  };
  const handleUpdateBlock = (index: number, key: string, value: any) => {
    const newBlocks = [...formData.blocks];
    newBlocks[index] = { ...newBlocks[index], [key]: value };
    setFormData({ ...formData, blocks: newBlocks });
  };
  const handleRemoveBlock = (index: number) => {
    if (confirm("ลบบล็อกนี้ทิ้งใช่หรือไม่?")) setFormData({ ...formData, blocks: formData.blocks.filter((_, i) => i !== index) });
  };
  const handleAddFieldToBlock = (blockIndex: number) => {
    const newBlocks = [...formData.blocks];
    newBlocks[blockIndex].fields.push({ id: `field_${Date.now()}`, variableName: "", label: "", type: "text", options: "", conditionVar: "", conditionVal: "" });
    setFormData({ ...formData, blocks: newBlocks });
  };
  const handleUpdateBlockField = (blockIndex: number, fieldIndex: number, key: string, value: any) => {
    const newBlocks = [...formData.blocks];
    newBlocks[blockIndex].fields[fieldIndex] = { ...newBlocks[blockIndex].fields[fieldIndex], [key]: value };
    setFormData({ ...formData, blocks: newBlocks });
  };
  const handleRemoveBlockField = (blockIndex: number, fieldIndex: number) => {
    const newBlocks = [...formData.blocks];
    newBlocks[blockIndex].fields = newBlocks[blockIndex].fields.filter((_: any, i: number) => i !== fieldIndex);
    setFormData({ ...formData, blocks: newBlocks });
  };

  useEffect(() => { fetchCodes(); }, []);

  useEffect(() => {
    if (selectedCodeId === "new") {
      setFormData({
        name: "", codeType: "", activityTags: [], eventTags: [], previewUrl: "", htmlCode: "", description: "",
        isLocked: false, lockPassword: "", isCommission: false,
        variations: [{ id: Date.now().toString(), label: "Default Theme", color: "#d8b4fe", type: "replace", replacements: "", fullHtml: "" }],
        customFields: [], blocks: []
      });
    } else {
      const code = codes.find(c => c.id === selectedCodeId);
      if (code) {
        let parsedVariations = []; let parsedCustomFields = []; let parsedBlocks = []; 
        try { parsedVariations = code.variations ? JSON.parse(code.variations) : []; } catch { parsedVariations = []; }
        try { parsedCustomFields = code.customFields ? JSON.parse(code.customFields) : []; } catch { parsedCustomFields = []; }
        try { parsedBlocks = code.blocks ? (typeof code.blocks === 'string' ? JSON.parse(code.blocks) : code.blocks) : []; } catch { parsedBlocks = []; }

        if (parsedVariations.length === 0) parsedVariations = [{ id: Date.now().toString(), label: "Default Theme", color: "#d8b4fe", type: "replace", replacements: "", fullHtml: "" }];
        if (!Array.isArray(parsedBlocks)) parsedBlocks = [];

        setFormData({
          name: code.name || "",
          description: code.description || "", 
          codeType: code.codeType || "",
          activityTags: code.activityTags || [], 
          eventTags: code.eventTags || [], 
          previewUrl: code.previewUrl || "",
          htmlCode: code.htmlCode || "",
          isLocked: code.isLocked || false,
          lockPassword: code.lockPassword || "",
          isCommission: code.isCommission || false, 
          variations: parsedVariations,
          customFields: parsedCustomFields,
          blocks: parsedBlocks
        });
      }
    }
  }, [selectedCodeId, codes]);

  const handleVariationChange = (index: number, field: string, value: string) => {
    const newVariations = [...formData.variations];
    newVariations[index] = { ...newVariations[index], [field]: value };
    setFormData({ ...formData, variations: newVariations });
  };
  const addVariation = () => setFormData({ ...formData, variations: [...formData.variations, { id: Date.now().toString(), label: "New Theme", color: "#bae6fd", type: "replace", replacements: "", fullHtml: "" }] });
  const removeVariation = (index: number) => setFormData({ ...formData, variations: formData.variations.filter((_, i) => i !== index) });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const isNew = selectedCodeId === "new";
    const payload = {
      id: isNew ? Math.floor(10000 + Math.random() * 90000).toString() : selectedCodeId,
      name: formData.name,
      codeType: formData.codeType,
      activityTags: formData.activityTags, 
      eventTags: formData.eventTags,
      previewUrl: formData.previewUrl,
      htmlCode: formData.htmlCode,
      description: formData.description,
      isLocked: formData.isLocked,
      lockPassword: formData.isLocked ? formData.lockPassword : "",
      isCommission: formData.isLocked ? formData.isCommission : false, 
      variations: JSON.stringify(formData.variations),
      customFields: JSON.stringify(formData.customFields),
      blocks: JSON.stringify(formData.blocks)
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
        .code-textarea { font-family: monospace !important; font-size: 0.9rem; line-height: 1.5; background: rgba(255,255,255,0.8); white-space: pre-wrap; overflow-x: auto; resize: none; min-height: 80px; transition: height 0.1s ease; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.5); }
        .section-title { font-size: 1.15rem; border-bottom: 2px solid rgba(139, 92, 246, 0.15); padding-bottom: 10px; margin: 36px 0 20px; font-weight: 700; color: #4c1d95; }
        .btn-submit { width: 100%; background: linear-gradient(135deg, #d8b4fe, #bae6fd); border: 1px solid #fff; border-radius: 12px; padding: 16px; font-weight: 700; font-size: 1.1rem; cursor: pointer; margin-top: 30px; transition: 0.2s; color: #2e1065; box-shadow: 0 6px 20px rgba(216, 180, 254, 0.4); }
        .btn-submit:hover { transform: translateY(-2px); filter: brightness(1.05); }
        .btn-add { display: inline-block; background: rgba(255,255,255,0.8); border: 1px dashed #a855f7; border-radius: 8px; padding: 10px 16px; font-size: 0.9rem; font-weight: 600; cursor: pointer; color: #6b21a8; margin-top: 10px; }
        .btn-remove { background: #fee2e2; color: #ef4444; border: none; border-radius: 8px; padding: 8px 12px; font-weight: 600; cursor: pointer; font-size: 0.85rem; }
        .back-btn { display: inline-block; margin-bottom: 20px; text-decoration: none; font-weight: 600; color: #4c1d95; background: rgba(255,255,255,0.5); padding: 8px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.6); }
        .variation-box { background: rgba(255,255,255,0.4); border: 1px solid rgba(216, 180, 254, 0.5); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
        .color-picker { padding: 2px; height: 42px; width: 60px; cursor: pointer; border-radius: 8px; border: 1px solid rgba(216, 180, 254, 0.6); }
        .tag-chip { background: #a855f7; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 6px rgba(168, 85, 247, 0.3); }
        .tag-remove { cursor: pointer; font-weight: bold; opacity: 0.8; transition: 0.2s; }
        .tag-remove:hover { opacity: 1; color: #fca5a5; }
        
        .privacy-box { background: rgba(255, 255, 255, 0.8); border-radius: 12px; padding: 20px; border: 1px solid rgba(216, 180, 254, 0.8); }
        .checkbox-label { display: flex; align-items: center; gap: 10px; font-weight: 600; color: #4c1d95; cursor: pointer; margin-bottom: 12px; }
        .custom-checkbox { width: 18px; height: 18px; accent-color: #a855f7; cursor: pointer; }

        .tool-btn { background: #fff; border: 1px solid #d8b4fe; border-radius: 6px; padding: 4px 8px; font-size: 0.85rem; font-weight: 600; color: #6b21a8; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.15s; }
        .tool-btn:hover { background: #f3e8ff; border-color: #a855f7; }
        .tool-btn:disabled { opacity: 0.3; cursor: not-allowed; }
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
          <div className="form-group">
            <label className="form-label">คำอธิบายสั้น ๆ (ไม่บังคับ)</label>
            <input type="text" className="glass-input" placeholder="เช่น ใช้ได้เฉพาะหน้าเทศกาลเท่านั้น..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          
          <div className="form-grid-2">
            <div className="form-group"><label className="form-label">ประเภทโค้ด *</label><input type="text" required className="glass-input" value={formData.codeType} onChange={e => setFormData({...formData, codeType: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">URL ภาพพรีวิว</label><input type="url" className="glass-input" value={formData.previewUrl} onChange={e => setFormData({...formData, previewUrl: e.target.value})} /></div>
          </div>
          
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label"><span>🏷️ แท็กทั่วไป (Enter เพื่อเพิ่ม)</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                {formData.activityTags.map(tag => (
                  <span key={tag} className="tag-chip">
                    {tag} <span className="tag-remove" onClick={() => handleRemoveTag(tag)}>✕</span>
                  </span>
                ))}
              </div>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="พิมพ์แท็กทั่วไปแล้วกด Enter..." 
                value={tagInput} 
                onChange={e => setTagInput(e.target.value)} 
                onKeyDown={handleAddTag} 
              />
            </div>

            <div className="form-group">
              <label className="form-label"><span>🎯 แท็กกิจกรรม (Enter เพื่อเพิ่ม)</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                {formData.eventTags.map(tag => (
                  <span key={tag} className="tag-chip" style={{ background: '#f59e0b', boxShadow: '0 2px 6px rgba(245, 158, 11, 0.3)' }}>
                    {tag} <span className="tag-remove" onClick={() => handleRemoveEventTag(tag)}>✕</span>
                  </span>
                ))}
              </div>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="พิมพ์แท็กกิจกรรมแล้วกด Enter..." 
                value={eventTagInput} 
                onChange={e => setEventTagInput(e.target.value)} 
                onKeyDown={handleAddEventTag} 
              />
            </div>
          </div>

          <h3 className="section-title">🔒 การตั้งค่าความเป็นส่วนตัว</h3>
          <div className="privacy-box">
            <div className="form-group" style={{ marginBottom: formData.isLocked ? '16px' : '0' }}>
              <label className="form-label">โหมดการแสดงผล</label>
              <select 
                className="glass-input" 
                style={{ fontWeight: 'bold' }}
                value={formData.isLocked ? (formData.isCommission ? 'commission' : 'private') : 'public'}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'public') setFormData({...formData, isLocked: false, isCommission: false, lockPassword: ""});
                  if (val === 'commission') setFormData({...formData, isLocked: true, isCommission: true});
                  if (val === 'private') setFormData({...formData, isLocked: true, isCommission: false});
                }}
              >
                <option value="public">🌍 โค้ดสาธารณะ (ค้นหาเจอ, โชว์พรีวิว, ก๊อปปี้และปรับแต่งได้อิสระ)</option>
                <option value="commission">💎 โค้ดคอมมิชชั่น (ค้นหาเจอ, โชว์พรีวิวได้, แต่ล็อกการคัดลอก/ปรับแต่ง)</option>
                <option value="private">🔒 โค้ดส่วนตัว (เบลอภาพ, ซ่อนชื่อ, ค้นหาแท็กไม่เจอ, ล็อก 100%)</option>
              </select>
            </div>
            
            {formData.isLocked && (
              <div style={{ padding: '16px', background: 'rgba(216, 180, 254, 0.2)', borderRadius: '12px', border: '1px solid rgba(216, 180, 254, 0.5)' }}>
                <label className="form-label" style={{ color: '#4c1d95', fontSize: '0.9rem' }}>🔑 ตั้งรหัสผ่านสำหรับโค้ดนี้</label>
                <input type="text" required className="glass-input" placeholder="พิมพ์รหัสผ่าน..." value={formData.lockPassword} onChange={e => setFormData({...formData, lockPassword: e.target.value})} />
              </div>
            )}
          </div>

          <h3 className="section-title">💻 โค้ด HTML (Template หลัก)</h3>
          <div className="form-group">
            <label className="form-label"><span>วางโค้ด HTML หลัก (จะถูกใช้ถ้าพรีเซ็ตไม่มีโค้ดเต็ม)</span></label>
            <textarea 
              required={formData.variations.every(v => v.type === 'replace')}
              className="glass-input code-textarea custom-scrollbar" 
              rows={10} 
              value={formData.htmlCode} 
              onChange={e => setFormData({...formData, htmlCode: e.target.value})} 
              onKeyDown={e => handleCodeKeyDown(e, (val) => setFormData({...formData, htmlCode: val}))}
            />
          </div>

          <h3 className="section-title">🎨 Variations (ปุ่มพรีเซ็ต)</h3>
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
              
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">รูปแบบพรีเซ็ต</label>
                <select className="glass-input" value={v.type || "replace"} onChange={e => handleVariationChange(index, 'type', e.target.value)}>
                  <option value="replace">🔄 แทนที่ตัวแปร (ใช้โครงสร้างจาก HTML หลัก)</option>
                  <option value="full_html">📝 โค้ด HTML เต็ม (ไม่พึ่ง HTML หลัก)</option>
                </select>
              </div>

              {(!v.type || v.type === "replace") ? (
                <div className="form-group">
                  <label className="form-label"><span>ตัวแปรที่ต้องการแทนที่ (1 บรรทัดต่อ 1 ค่า เช่น **สีหลัก**=#000000)</span></label>
                  <textarea 
                    className="glass-input code-textarea custom-scrollbar" 
                    rows={2} 
                    value={v.replacements} 
                    onChange={e => handleVariationChange(index, 'replacements', e.target.value)} 
                    onKeyDown={e => handleCodeKeyDown(e, (val) => handleVariationChange(index, 'replacements', val))}
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label"><span>วางโค้ด HTML แบบเต็มๆ สำหรับพรีเซ็ตนี้</span></label>
                  <textarea 
                    className="glass-input code-textarea custom-scrollbar" 
                    rows={6} 
                    value={v.fullHtml || ""} 
                    onChange={e => handleVariationChange(index, 'fullHtml', e.target.value)} 
                    onKeyDown={e => handleCodeKeyDown(e, (val) => handleVariationChange(index, 'fullHtml', val))}
                  />
                </div>
              )}
            </div>
          ))}
          <button type="button" className="btn-add" onClick={addVariation}>+ เพิ่มพรีเซ็ต</button>

          <h3 className="section-title">🛠️ กำหนดจุดที่ให้ผู้ใช้ปรับแต่ง (Custom Fields)</h3>
          {formData.customFields.map((field, index) => (
            <div key={field.id} className="variation-box" style={{ borderColor: '#60a5fa', background: 'rgba(239, 246, 255, 0.4)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #bfdbfe', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ margin: 0, color: '#1e3a8a' }}>จุดที่ #{index + 1}</h4>
                  
                  {/* 🌟 ปุ่มเลื่อนขึ้น-ลงของ Custom Fields */}
                  <div style={{ display: 'flex', gap: '4px', marginLeft: '12px' }}>
                    <button type="button" className="tool-btn" onClick={() => moveCustomField(index, 'up')} disabled={index === 0} title="เลื่อนขึ้น">⬆️</button>
                    <button type="button" className="tool-btn" onClick={() => moveCustomField(index, 'down')} disabled={index === formData.customFields.length - 1} title="เลื่อนลง">⬇️</button>
                  </div>
                </div>
                
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
                  <option value="roleplay">🎭 กล่อง Roleplay (นับคำ)</option>
                  <option value="color">🎨 สี (Color Picker)</option>
                  <option value="gradient">🌈 ไล่ระดับสี (Gradient)</option>
                  <option value="image">🖼️ รูปภาพ (เลื่อนตำแหน่ง/ซูม)</option>
                  <option value="dropdown">📋 ตัวเลือก (Dropdown + พิมพ์เอง)</option>
                </select>
              </div>

              {field.type === 'dropdown' && (
                <div className="form-group" style={{ marginTop: '16px', marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>ระบุตัวเลือก (คั่นด้วยลูกน้ำ เช่น home, about, profile)</label>
                  <input type="text" className="glass-input" placeholder="ใส่ตัวเลือกที่นี่..." value={field.options || ""} onChange={e => handleCustomFieldChange(index, 'options', e.target.value)} />
                </div>
              )}

              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.4)', borderRadius: '8px', marginTop: '16px' }}>
                <label className="checkbox-label" style={{ fontSize: '0.85rem', marginBottom: field.conditionVar ? '8px' : '0' }}>
                  <input type="checkbox" className="custom-checkbox" style={{ width: '14px', height: '14px' }} checked={!!field.conditionVar} onChange={e => {
                    if (e.target.checked) {
                      handleCustomFieldChange(index, 'conditionVar', "VAR_NAME");
                    } else {
                      const newFields = [...formData.customFields];
                      delete newFields[index].conditionVar;
                      delete newFields[index].conditionVal;
                      setFormData({ ...formData, customFields: newFields });
                    }
                  }} />
                  👁️ ซ่อนฟิลด์นี้ และจะโชว์ก็ต่อเมื่อ...
                </label>
                
                {field.conditionVar !== undefined && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input type="text" className="glass-input" style={{ padding: '6px 10px', fontSize: '0.85rem', flex: 1 }} placeholder="ตัวแปรที่ใช้เช็ก (เช่น **ชนิด**)" value={field.conditionVar === "VAR_NAME" ? "" : field.conditionVar} onChange={e => handleCustomFieldChange(index, 'conditionVar', e.target.value)} />
                    <span style={{ fontWeight: 'bold', color: '#4c1d95' }}>=</span>
                    <input type="text" className="glass-input" style={{ padding: '6px 10px', fontSize: '0.85rem', flex: 1 }} placeholder="ค่าที่ต้องตรงกัน (เช่น รูปภาพ)" value={field.conditionVal || ""} onChange={e => handleCustomFieldChange(index, 'conditionVal', e.target.value)} />
                  </div>
                )}
              </div>
            </div>
          ))}
          <button type="button" className="btn-add" onClick={addCustomField}>+ เพิ่มจุดปรับแต่ง</button>

          <div style={{ marginTop: '40px', padding: '24px', background: 'rgba(255,255,255,0.7)', border: '2px dashed #a855f7', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ margin: 0, color: '#4c1d95', fontSize: '1.15rem', fontWeight: 700 }}>🧱 จัดการส่วนเสริม (Dynamic Blocks)</h3>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <select id="add-block-select" className="glass-input" style={{ width: 'auto', padding: '8px 12px', fontWeight: 'bold' }}>
                  <option value="blank">📦 บล็อกเปล่า</option>
                  <option value="gallery">🖼️ บล็อก: แกลลอรี่ภาพ</option>
                  <option value="textbox">📝 บล็อก: กล่องข้อความ</option>
                </select>
                <button type="button" onClick={() => handleAddBlock((document.getElementById('add-block-select') as HTMLSelectElement).value)} style={{ background: '#a855f7', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}>➕ เพิ่ม</button>
              </div>
            </div>

            {formData.blocks.length === 0 && <p style={{ color: '#6b21a8', opacity: 0.7, textAlign: 'center', margin: '20px 0' }}>ยังไม่มีบล็อกเสริมสำหรับโค้ดชุดนี้</p>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {formData.blocks.map((block, bIndex) => (
                <div key={block.id} style={{ background: '#fff', border: '1px solid #d8b4fe', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, color: '#6b21a8' }}>บล็อกที่ {bIndex + 1}</h4>
                    <button type="button" onClick={() => handleRemoveBlock(bIndex)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>🗑️ ลบบล็อก</button>
                  </div>
                  <div className="form-grid-2">
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>ชื่อบล็อก (ให้ผู้ใช้เห็น)</label>
                      <input type="text" value={block.name} onChange={(e) => handleUpdateBlock(bIndex, 'name', e.target.value)} placeholder="เช่น กล่องเนื้อเพลง, แกลลอรี่" className="glass-input" />
                    </div>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>ตัวแทนตำแหน่ง (Placeholder)</label>
                      <input type="text" value={block.placeholder} onChange={(e) => handleUpdateBlock(bIndex, 'placeholder', e.target.value)} placeholder="เช่น [[GALLERY_HERE]]" className="glass-input" style={{ fontFamily: 'monospace' }} />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>โค้ด HTML เฉพาะส่วนของบล็อกนี้</label>
                    <textarea value={block.html} onChange={(e) => handleUpdateBlock(bIndex, 'html', e.target.value)} onKeyDown={e => handleCodeKeyDown(e, (val) => handleUpdateBlock(bIndex, 'html', val))} placeholder="<div class='song-box'>...</div>" className="glass-input code-textarea custom-scrollbar" rows={4} />
                  </div>
                  <div style={{ background: 'rgba(243, 232, 255, 0.5)', padding: '16px', borderRadius: '12px', marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <strong style={{ color: '#4c1d95', fontSize: '0.9rem' }}>🛠️ จุดแก้ไข (Fields) ภายในบล็อกนี้</strong>
                      <button type="button" onClick={() => handleAddFieldToBlock(bIndex)} style={{ background: '#fff', color: '#6b21a8', border: '1px solid #c084fc', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>+ เพิ่มจุดแก้ไขย่อย</button>
                    </div>
                    {block.fields.map((field: any, fIndex: number) => (
                      <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e9d5ff', marginBottom: '8px' }}>
                        
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          <div style={{ flex: '1 1 200px' }}>
                            <input type="text" value={field.label} onChange={(e) => handleUpdateBlockField(bIndex, fIndex, 'label', e.target.value)} placeholder="ชื่อป้ายกำกับ" className="glass-input" style={{ padding: '8px', fontSize: '0.85rem', marginBottom: '8px' }} />
                            <input type="text" value={field.variableName} onChange={(e) => handleUpdateBlockField(bIndex, fIndex, 'variableName', e.target.value)} placeholder="ตัวแปร (เช่น TEXT_1)" className="glass-input" style={{ padding: '8px', fontSize: '0.85rem', fontFamily: 'monospace' }} />
                          </div>
                          <div style={{ flex: '0 0 160px' }}>
                            <select value={field.type} onChange={(e) => handleUpdateBlockField(bIndex, fIndex, 'type', e.target.value)} className="glass-input" style={{ padding: '8px', fontSize: '0.85rem', width: '100%' }}>
                              <option value="text">ข้อความสั้น</option>
                              <option value="richtext">กล่องข้อความ</option>
                              <option value="roleplay">โรลเพลย์</option>
                              <option value="image">รูปภาพ</option>
                              <option value="color">เลือกสี</option>
                              <option value="gradient">ไล่ระดับสี</option>
                              <option value="dropdown">ตัวเลือก</option>
                            </select>
                            
                            {field.type === 'dropdown' && (
                              <input type="text" value={field.options || ""} onChange={(e) => handleUpdateBlockField(bIndex, fIndex, 'options', e.target.value)} placeholder="คั่นด้วยลูกน้ำ (,)" className="glass-input" style={{ padding: '8px', fontSize: '0.85rem', marginTop: '8px', width: '100%' }} />
                            )}
                          </div>
                          <button type="button" onClick={() => handleRemoveBlockField(bIndex, fIndex)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '4px' }} title="ลบ Field">✕</button>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(216, 180, 254, 0.2)', padding: '8px', borderRadius: '6px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6b21a8' }}>👁️ โชว์เมื่อ:</span>
                          <input type="text" className="glass-input" style={{ padding: '4px 8px', fontSize: '0.75rem', flex: 1 }} placeholder="ตัวแปรหลัก (ปล่อยว่างถ้าโชว์ตลอด)" value={field.conditionVar || ""} onChange={(e) => handleUpdateBlockField(bIndex, fIndex, 'conditionVar', e.target.value)} />
                          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6b21a8' }}>=</span>
                          <input type="text" className="glass-input" style={{ padding: '4px 8px', fontSize: '0.75rem', flex: 1 }} placeholder="ค่าที่กำหนด" value={field.conditionVal || ""} onChange={(e) => handleUpdateBlockField(bIndex, fIndex, 'conditionVal', e.target.value)} />
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={isSaving}>
            {isSaving ? "กำลังบันทึก..." : (selectedCodeId === "new" ? "✨ บันทึกโค้ดใหม่" : "💾 อัปเดตข้อมูล")}
          </button>
        </form>
      </div>
    </div>
  );
}