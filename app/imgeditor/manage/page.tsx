"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ManageTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("new");
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "", category: "", tags: [] as string[], eventTags: [] as string[], 
    previewUrl: "", htmlCode: "", cssCode: "", description: "",
    isLocked: false, lockPassword: "", 
    variations: [{ id: Date.now().toString(), label: "Default Theme", color: "#fbcfe8", type: "replace", replacements: "**สีหลัก**=#fbcfe8", fullHtml: "" }],
    customFields: [] as any[],
    blocks: [] as any[]
  });

  const [tagInput, setTagInput] = useState(""); 
  const [eventTagInput, setEventTagInput] = useState(""); 

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/templates');
      if (res.ok) setTemplates(await res.json());
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    const textareas = document.querySelectorAll('.code-textarea');
    textareas.forEach(el => {
      const target = el as HTMLTextAreaElement;
      target.style.height = 'auto';
      target.style.height = target.scrollHeight + 'px';
    });
  }, [formData.htmlCode, formData.cssCode, formData.variations, formData.blocks, selectedId]);

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
      if (t && !formData.tags.includes(t)) {
        setFormData({ ...formData, tags: [...formData.tags, t] });
      }
      setTagInput("");
    }
  };
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
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

  useEffect(() => { fetchTemplates(); }, []);

  useEffect(() => {
    if (selectedId === "new") {
      setFormData({
        name: "", category: "", tags: [], eventTags: [], previewUrl: "", htmlCode: "", cssCode: "", description: "",
        isLocked: false, lockPassword: "",
        variations: [{ id: Date.now().toString(), label: "Default Theme", color: "#fbcfe8", type: "replace", replacements: "", fullHtml: "" }],
        customFields: [], blocks: []
      });
    } else {
      const template = templates.find(c => c.id === selectedId);
      if (template) {
        let parsedVariations = []; let parsedCustomFields = []; let parsedBlocks = []; 
        try { parsedVariations = template.variations ? JSON.parse(template.variations) : []; } catch { parsedVariations = []; }
        try { parsedCustomFields = template.customFields ? JSON.parse(template.customFields) : []; } catch { parsedCustomFields = []; }
        try { parsedBlocks = template.blocks ? (typeof template.blocks === 'string' ? JSON.parse(template.blocks) : template.blocks) : []; } catch { parsedBlocks = []; }

        if (parsedVariations.length === 0) parsedVariations = [{ id: Date.now().toString(), label: "Default Theme", color: "#fbcfe8", type: "replace", replacements: "", fullHtml: "" }];
        if (!Array.isArray(parsedBlocks)) parsedBlocks = [];

        setFormData({
          name: template.name || "",
          description: template.description || "", 
          category: template.category || "",
          tags: template.tags || [], 
          eventTags: template.eventTags || [], 
          previewUrl: template.previewUrl || "",
          htmlCode: template.htmlCode || "",
          cssCode: template.cssCode || "",
          isLocked: template.isLocked || false,
          lockPassword: template.lockPassword || "",
          variations: parsedVariations,
          customFields: parsedCustomFields,
          blocks: parsedBlocks
        });
      }
    }
  }, [selectedId, templates]);

  const handleVariationChange = (index: number, field: string, value: string) => {
    const newVariations = [...formData.variations];
    newVariations[index] = { ...newVariations[index], [field]: value };
    setFormData({ ...formData, variations: newVariations });
  };
  
  const addVariation = () => setFormData({ ...formData, variations: [...formData.variations, { id: Date.now().toString(), label: "New Theme", color: "#fef08a", type: "replace", replacements: "", fullHtml: "" }] });
  const removeVariation = (index: number) => setFormData({ ...formData, variations: formData.variations.filter((_, i) => i !== index) });

  const handleCustomFieldChange = (index: number, field: string, value: any) => {
    const newFields = [...formData.customFields];
    newFields[index] = { ...newFields[index], [field]: value };
    setFormData({ ...formData, customFields: newFields });
  };
  
  const addCustomField = () => setFormData({ ...formData, customFields: [...formData.customFields, { id: Date.now().toString(), label: "ข้อความ", variableName: "**TEXT**", type: "text", options: "", conditionVar: "", conditionVal: "" }] });
  const removeCustomField = (index: number) => setFormData({ ...formData, customFields: formData.customFields.filter((_, i) => i !== index) });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const isNew = selectedId === "new";
    const payload = {
      id: isNew ? Math.floor(10000 + Math.random() * 90000).toString() : selectedId,
      name: formData.name,
      category: formData.category,
      tags: formData.tags, 
      eventTags: formData.eventTags, 
      previewUrl: formData.previewUrl,
      htmlCode: formData.htmlCode,
      cssCode: formData.cssCode,
      description: formData.description,
      isLocked: formData.isLocked,
      lockPassword: formData.isLocked ? formData.lockPassword : "",
      variations: JSON.stringify(formData.variations),
      customFields: JSON.stringify(formData.customFields),
      blocks: JSON.stringify(formData.blocks)
    };

    try {
      const res = await fetch('/api/templates', {
        method: isNew ? "POST" : "PUT", 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(isNew ? "✨ บันทึกเทมเพลตสำเร็จ!" : "✨ อัปเดตเทมเพลตสำเร็จ!");
        fetchTemplates();
        if (isNew) {
          const newData = await res.json();
          setSelectedId(newData.id);
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
          font-family: 'Google Sans', sans-serif; color: #831843; 
          background: radial-gradient(circle at 15% 20%, #fce7f3 0%, transparent 50%), 
                      radial-gradient(circle at 85% 80%, #fef08a 0%, transparent 50%), 
                      linear-gradient(135deg, #fff1f2 0%, #ffedd5 100%); 
          background-attachment: fixed; 
        }
        .manage-page-wrapper * { box-sizing: border-box; }
        input, select, textarea, button { font-family: 'Google Sans', sans-serif !important; }
        
        .glass-card { background: rgba(255,255,255,0.7); border: 2px solid rgba(255,255,255,0.9); border-radius: 24px; padding: 32px; backdrop-filter: blur(16px); box-shadow: 0 15px 40px rgba(244, 114, 182, 0.15); max-width: 900px; margin: 0 auto; width: 100%; }
        .form-group { margin-bottom: 20px; width: 100%; }
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; width: 100%; }
        @media(max-width: 600px) { .form-grid-2 { grid-template-columns: 1fr; } }
        
        .form-label { display: flex; justify-content: space-between; align-items: flex-end; font-weight: 700; margin-bottom: 8px; font-size: 0.95rem; color: #be123c; }
        .form-hint { font-size: 0.75rem; color: #f472b6; font-weight: 500; opacity: 0.9; }
        
        .glass-input { width: 100%; background: rgba(255,255,255,0.8); border: 2px solid rgba(244, 114, 182, 0.4); border-radius: 14px; padding: 12px 14px; font-size: 0.95rem; outline: none; transition: 0.3s; color: #831843; font-weight: 500; }
        .glass-input:focus { border-color: #f472b6; background: #ffffff; box-shadow: 0 0 0 4px rgba(244, 114, 182, 0.2); }
        
        .code-textarea { font-family: monospace !important; font-size: 0.9rem; line-height: 1.5; background: #282c34 !important; color: #fbcfe8 !important; white-space: pre-wrap; overflow-x: auto; resize: none; min-height: 120px; transition: height 0.1s ease; border-color: transparent !important; }
        .code-textarea:focus { box-shadow: 0 0 0 4px rgba(244, 114, 182, 0.4); }
        
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.5); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(244, 114, 182, 0.6); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(219, 39, 119, 0.8); }
        
        .section-title { font-size: 1.25rem; border-bottom: 2px dashed rgba(244, 114, 182, 0.4); padding-bottom: 10px; margin: 40px 0 24px; font-weight: 800; color: #9f1239; }
        
        .btn-submit { width: 100%; background: linear-gradient(135deg, #fbcfe8, #fef08a); border: 2px solid #fff; border-radius: 16px; padding: 16px; font-weight: 800; font-size: 1.15rem; cursor: pointer; margin-top: 30px; transition: 0.3s; color: #9f1239; box-shadow: 0 8px 25px rgba(244, 114, 182, 0.35); }
        .btn-submit:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(244, 114, 182, 0.5); }
        
        .btn-add { display: inline-block; background: rgba(255,255,255,0.9); border: 2px dashed #f472b6; border-radius: 12px; padding: 10px 18px; font-size: 0.9rem; font-weight: 700; cursor: pointer; color: #db2777; margin-top: 10px; transition: 0.2s; }
        .btn-add:hover { background: #fdf2f8; transform: scale(1.02); }
        
        .btn-remove { background: #ffe4e6; color: #e11d48; border: none; border-radius: 8px; padding: 8px 14px; font-weight: 700; cursor: pointer; font-size: 0.85rem; transition: 0.2s; }
        .btn-remove:hover { background: #fecdd3; }
        
        .back-btn { display: inline-block; margin-bottom: 24px; text-decoration: none; font-weight: 700; color: #be123c; background: rgba(255,255,255,0.7); padding: 10px 20px; border-radius: 20px; border: 2px solid rgba(255,255,255,0.9); box-shadow: 0 4px 10px rgba(244, 114, 182, 0.1); transition: 0.3s; }
        .back-btn:hover { background: rgba(255,255,255,1); transform: translateX(-5px); border-color: #fbcfe8; }
        
        .variation-box { background: rgba(255,255,255,0.6); border: 2px solid rgba(252, 231, 243, 0.8); border-radius: 16px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(244, 114, 182, 0.05); }
        .color-picker { padding: 2px; height: 45px; width: 65px; cursor: pointer; border-radius: 10px; border: 2px solid rgba(244, 114, 182, 0.4); }
        
        .tag-chip { background: #f472b6; color: #fff; padding: 5px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 3px 10px rgba(244, 114, 182, 0.4); }
        .tag-remove { cursor: pointer; opacity: 0.8; transition: 0.2s; font-size: 0.9rem; }
        .tag-remove:hover { opacity: 1; color: #ffe4e6; transform: scale(1.2); }
        
        .privacy-box { background: rgba(255, 255, 255, 0.9); border-radius: 16px; padding: 24px; border: 2px solid #fbcfe8; box-shadow: 0 4px 15px rgba(244, 114, 182, 0.1); }
        .checkbox-label { display: flex; align-items: center; gap: 10px; font-weight: 700; color: #be123c; cursor: pointer; margin-bottom: 12px; }
        .custom-checkbox { width: 18px; height: 18px; accent-color: #db2777; cursor: pointer; }
      `}} />

      <Link href="/imgeditor" className="back-btn">← กลับไปหน้า Gallery</Link>
      
      <div className="glass-card">
        <h1 style={{textAlign: 'center', margin: '0 0 28px 0', color: '#9f1239', fontWeight: 800, fontSize: '2.2rem'}}>
          🎀 Manage Templates
        </h1>

        <div className="form-group" style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '2px dashed rgba(244, 114, 182, 0.4)' }}>
          <label className="form-label">เลือกโหมดการจัดการ:</label>
          <select className="glass-input" style={{fontWeight: '800', fontSize: '1.05rem', color: '#db2777'}} value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            <option value="new">✨ + เพิ่มเทมเพลตภาพใหม่</option>
            <optgroup label="แก้ไขเทมเพลตที่มีอยู่">
              {templates.map(c => <option key={c.id} value={c.id}>✏️ {c.name} {c.isLocked ? '(🔒)' : ''}</option>)}
            </optgroup>
          </select>
        </div>

        <form onSubmit={handleSave}>
          <h3 className="section-title">📌 ข้อมูลทั่วไป</h3>
          <div className="form-group"><label className="form-label">ชื่อเทมเพลตภาพ *</label><input type="text" required className="glass-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          <div className="form-group">
            <label className="form-label">คำอธิบายสั้น ๆ (ไม่บังคับ)</label>
            <input type="text" className="glass-input" placeholder="เช่น เทมเพลตป้ายชื่อสไตล์มินิมอล..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          
          <div className="form-grid-2">
            <div className="form-group"><label className="form-label">หมวดหมู่ (Category) *</label><input type="text" required className="glass-input" placeholder="เช่น Profile, Banner" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">URL ภาพพรีวิว</label><input type="url" className="glass-input" placeholder="ใส่ลิงก์รูปภาพตัวอย่าง" value={formData.previewUrl} onChange={e => setFormData({...formData, previewUrl: e.target.value})} /></div>
          </div>
          
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label"><span>🏷️ แท็กรูปแบบ (Enter เพื่อเพิ่ม)</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                {formData.tags.map(tag => (
                  <span key={tag} className="tag-chip">
                    {tag} <span className="tag-remove" onClick={() => handleRemoveTag(tag)}>✕</span>
                  </span>
                ))}
              </div>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="เช่น Cute, Minimal..." 
                value={tagInput} 
                onChange={e => setTagInput(e.target.value)} 
                onKeyDown={handleAddTag} 
              />
            </div>

            <div className="form-group">
              <label className="form-label"><span>🎯 แท็กเทศกาล/กิจกรรม (Enter เพื่อเพิ่ม)</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                {formData.eventTags.map(tag => (
                  <span key={tag} className="tag-chip" style={{ background: '#fef08a', color: '#9a3412', boxShadow: '0 3px 10px rgba(253, 224, 71, 0.4)' }}>
                    {tag} <span className="tag-remove" onClick={() => handleRemoveEventTag(tag)}>✕</span>
                  </span>
                ))}
              </div>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="เช่น Halloween, Event..." 
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
                value={formData.isLocked ? 'private' : 'public'}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'public') setFormData({...formData, isLocked: false, lockPassword: ""});
                  if (val === 'private') setFormData({...formData, isLocked: true});
                }}
              >
                <option value="public">🌍 เทมเพลตสาธารณะ (ใครก็เข้ามาทำรูปได้)</option>
                <option value="private">🔒 เทมเพลตส่วนตัว (ต้องใส่รหัสผ่านก่อนเข้าใช้งาน)</option>
              </select>
            </div>
            
            {formData.isLocked && (
              <div style={{ padding: '16px', background: '#fff1f2', borderRadius: '12px', border: '2px solid #fbcfe8' }}>
                <label className="form-label" style={{ color: '#be123c', fontSize: '0.9rem' }}>🔑 ตั้งรหัสผ่านสำหรับเทมเพลตนี้</label>
                <input type="text" required className="glass-input" placeholder="พิมพ์รหัสผ่าน..." value={formData.lockPassword} onChange={e => setFormData({...formData, lockPassword: e.target.value})} />
              </div>
            )}
          </div>

          <h3 className="section-title">💻 โค้ด (Template หลัก)</h3>
          
          <div className="form-group">
            <label className="form-label"><span>📝 โค้ด HTML (โครงสร้างรูปภาพ)</span></label>
            <textarea 
              required={formData.variations.every(v => v.type === 'replace')}
              className="glass-input code-textarea custom-scrollbar" 
              rows={8} 
              value={formData.htmlCode} 
              onChange={e => setFormData({...formData, htmlCode: e.target.value})} 
              onKeyDown={e => handleCodeKeyDown(e, (val) => setFormData({...formData, htmlCode: val}))}
            />
          </div>

          <div className="form-group">
            <label className="form-label"><span>🎨 โค้ด CSS (ตกแต่งความสวยงาม)</span></label>
            <textarea 
              className="glass-input code-textarea custom-scrollbar" 
              rows={8} 
              value={formData.cssCode} 
              onChange={e => setFormData({...formData, cssCode: e.target.value})} 
              onKeyDown={e => handleCodeKeyDown(e, (val) => setFormData({...formData, cssCode: val}))}
              placeholder=".my-card { background: pink; }"
            />
          </div>

          <h3 className="section-title">🎀 Variations (ปุ่มเปลี่ยนสี/ธีม)</h3>
          {formData.variations.map((v, index) => (
            <div key={v.id} className="variation-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, color: '#be123c', fontWeight: 800 }}>ธีมทางเลือก #{index + 1}</h4>
                {formData.variations.length > 1 && (<button type="button" className="btn-remove" onClick={() => removeVariation(index)}>✕ ลบ</button>)}
              </div>
              <div className="form-grid-2">
                <div className="form-group"><label className="form-label">ชื่อธีม</label><input type="text" required className="glass-input" value={v.label} onChange={e => handleVariationChange(index, 'label', e.target.value)} /></div>
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
                  <label className="form-label"><span>ตัวแปรที่ต้องการแทนที่ (1 บรรทัดต่อ 1 ค่า เช่น **สีหลัก**=#ffb6c1)</span></label>
                  <textarea 
                    className="glass-input code-textarea custom-scrollbar" 
                    rows={3} 
                    value={v.replacements} 
                    onChange={e => handleVariationChange(index, 'replacements', e.target.value)} 
                    onKeyDown={e => handleCodeKeyDown(e, (val) => handleVariationChange(index, 'replacements', val))}
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label"><span>วางโค้ด HTML แบบเต็มๆ สำหรับธีมนี้</span></label>
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
          <button type="button" className="btn-add" onClick={addVariation}>+ เพิ่มธีมทางเลือก</button>

          <h3 className="section-title">🛠️ กำหนดจุดที่ให้ผู้ใช้พิมพ์ข้อความ/รูปภาพ (Custom Fields)</h3>
          {formData.customFields.map((field, index) => (
            <div key={field.id} className="variation-box" style={{ borderColor: '#fcd34d', background: 'rgba(254, 252, 232, 0.6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, color: '#b45309', fontWeight: 800 }}>จุดที่ #{index + 1}</h4>
                <button type="button" className="btn-remove" onClick={() => removeCustomField(index)}>✕ ลบจุดนี้</button>
              </div>
              <div className="form-grid-2">
                <div className="form-group"><label className="form-label">ชื่อป้ายกำกับ (Label)</label><input type="text" required className="glass-input" value={field.label} onChange={e => handleCustomFieldChange(index, 'label', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">ชื่อตัวแปรในโค้ด (เช่น **ชื่อ**)</label><input type="text" required className="glass-input" style={{ fontFamily: 'monospace' }} value={field.variableName} onChange={e => handleCustomFieldChange(index, 'variableName', e.target.value)} /></div>
              </div>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">ประเภท Input</label>
                <select className="glass-input" value={field.type} onChange={e => handleCustomFieldChange(index, 'type', e.target.value)}>
                  <option value="text">✏️ ข้อความสั้น (Input)</option>
                  <option value="richtext">📝 ข้อความยาว (Textarea)</option>
                  <option value="roleplay">🎭 โรลเพลย์ (Roleplay)</option>
                  <option value="color">🎨 สี (Color Picker)</option>
                  <option value="gradient">🌈 ไล่สี (Gradient)</option>
                  <option value="image">🖼️ รูปภาพ (อัปโหลดรูป)</option>
                  <option value="dropdown">📋 ตัวเลือก (Dropdown)</option>
                </select>
              </div>

              {field.type === 'dropdown' && (
                <div className="form-group" style={{ marginTop: '16px', marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>ระบุตัวเลือก (คั่นด้วยลูกน้ำ เช่น red, blue, green)</label>
                  <input type="text" className="glass-input" placeholder="ใส่ตัวเลือกที่นี่..." value={field.options || ""} onChange={e => handleCustomFieldChange(index, 'options', e.target.value)} />
                </div>
              )}

              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.7)', borderRadius: '12px', marginTop: '16px' }}>
                <label className="checkbox-label" style={{ fontSize: '0.85rem', marginBottom: field.conditionVar ? '8px' : '0' }}>
                  <input type="checkbox" className="custom-checkbox" style={{ width: '16px', height: '16px' }} checked={!!field.conditionVar} onChange={e => {
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
                    <input type="text" className="glass-input" style={{ padding: '8px 12px', fontSize: '0.85rem', flex: 1 }} placeholder="ตัวแปรที่ใช้เช็ก (เช่น **สไตล์**)" value={field.conditionVar === "VAR_NAME" ? "" : field.conditionVar} onChange={e => handleCustomFieldChange(index, 'conditionVar', e.target.value)} />
                    <span style={{ fontWeight: '900', color: '#db2777' }}>=</span>
                    <input type="text" className="glass-input" style={{ padding: '8px 12px', fontSize: '0.85rem', flex: 1 }} placeholder="ค่าที่ต้องตรงกัน (เช่น 2)" value={field.conditionVal || ""} onChange={e => handleCustomFieldChange(index, 'conditionVal', e.target.value)} />
                  </div>
                )}
              </div>
            </div>
          ))}
          <button type="button" className="btn-add" onClick={addCustomField}>+ เพิ่มจุดพิมพ์ข้อความ/รูปภาพ</button>

          {/* ส่วน Dynamic Blocks ซ่อนไว้ก่อนได้ถ้ายังไม่ใช้ แต่ถ้าใช้ก็คงโครงสร้างเดิมไว้ให้แล้วครับ */}
          <div style={{ marginTop: '50px', padding: '24px', background: 'rgba(255,255,255,0.8)', border: '2px dashed #f472b6', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ margin: 0, color: '#be123c', fontSize: '1.2rem', fontWeight: 800 }}>🧱 ส่วนเสริมพิเศษ (Dynamic Blocks)</h3>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <select id="add-block-select" className="glass-input" style={{ width: 'auto', padding: '10px 14px', fontWeight: 'bold' }}>
                  <option value="blank">📦 บล็อกเปล่า</option>
                  <option value="gallery">🖼️ บล็อก: แกลลอรี่</option>
                  <option value="textbox">📝 บล็อก: กล่องข้อความ</option>
                </select>
                <button type="button" onClick={() => handleAddBlock((document.getElementById('add-block-select') as HTMLSelectElement).value)} style={{ background: '#db2777', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}>➕ เพิ่ม</button>
              </div>
            </div>

            {formData.blocks.length === 0 && <p style={{ color: '#f472b6', fontWeight: 600, textAlign: 'center', margin: '30px 0' }}>ไม่มีบล็อกเสริม</p>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {formData.blocks.map((block, bIndex) => (
                <div key={block.id} style={{ background: '#fff', border: '2px solid #fbcfe8', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 15px rgba(244, 114, 182, 0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h4 style={{ margin: 0, color: '#db2777', fontWeight: 800 }}>บล็อกที่ {bIndex + 1}</h4>
                    <button type="button" onClick={() => handleRemoveBlock(bIndex)} className="btn-remove">🗑️ ลบบล็อก</button>
                  </div>
                  <div className="form-grid-2">
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label">ชื่อบล็อก (ให้ผู้ใช้เห็น)</label>
                      <input type="text" value={block.name} onChange={(e) => handleUpdateBlock(bIndex, 'name', e.target.value)} placeholder="เช่น กล่องคำคม" className="glass-input" />
                    </div>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label">ตัวแทนตำแหน่ง (Placeholder)</label>
                      <input type="text" value={block.placeholder} onChange={(e) => handleUpdateBlock(bIndex, 'placeholder', e.target.value)} placeholder="เช่น [[QUOTE]]" className="glass-input" style={{ fontFamily: 'monospace' }} />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label">โค้ด HTML สำหรับบล็อกนี้</label>
                    <textarea value={block.html} onChange={(e) => handleUpdateBlock(bIndex, 'html', e.target.value)} onKeyDown={e => handleCodeKeyDown(e, (val) => handleUpdateBlock(bIndex, 'html', val))} className="glass-input code-textarea custom-scrollbar" rows={4} />
                  </div>
                  
                  <div style={{ background: 'rgba(252, 231, 243, 0.5)', padding: '20px', borderRadius: '14px', marginTop: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <strong style={{ color: '#9f1239', fontSize: '0.95rem' }}>🛠️ จุดแก้ไข (Fields) ในบล็อก</strong>
                      <button type="button" onClick={() => handleAddFieldToBlock(bIndex)} className="btn-add" style={{ marginTop: 0, padding: '6px 14px' }}>+ เพิ่มจุดแก้ไขย่อย</button>
                    </div>
                    {block.fields.map((field: any, fIndex: number) => (
                      <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #fbcfe8', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          <div style={{ flex: '1 1 200px' }}>
                            <input type="text" value={field.label} onChange={(e) => handleUpdateBlockField(bIndex, fIndex, 'label', e.target.value)} placeholder="ชื่อป้ายกำกับ" className="glass-input" style={{ padding: '10px', fontSize: '0.85rem', marginBottom: '8px' }} />
                            <input type="text" value={field.variableName} onChange={(e) => handleUpdateBlockField(bIndex, fIndex, 'variableName', e.target.value)} placeholder="ตัวแปร (เช่น TEXT_1)" className="glass-input" style={{ padding: '10px', fontSize: '0.85rem', fontFamily: 'monospace' }} />
                          </div>
                          <div style={{ flex: '0 0 160px' }}>
                            <select value={field.type} onChange={(e) => handleUpdateBlockField(bIndex, fIndex, 'type', e.target.value)} className="glass-input" style={{ padding: '10px', fontSize: '0.85rem', width: '100%', fontWeight: 'bold' }}>
                              <option value="text">ข้อความสั้น</option>
                              <option value="richtext">กล่องข้อความ</option>
                              <option value="roleplay">โรลเพลย์</option>
                              <option value="image">รูปภาพ</option>
                              <option value="color">เลือกสี</option>
                              <option value="gradient">ไล่สี</option>
                              <option value="dropdown">ตัวเลือก</option>
                            </select>
                            {field.type === 'dropdown' && (
                              <input type="text" value={field.options || ""} onChange={(e) => handleUpdateBlockField(bIndex, fIndex, 'options', e.target.value)} placeholder="คั่นด้วยลูกน้ำ (,)" className="glass-input" style={{ padding: '10px', fontSize: '0.85rem', marginTop: '8px', width: '100%' }} />
                            )}
                          </div>
                          <button type="button" onClick={() => handleRemoveBlockField(bIndex, fIndex)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '4px', fontWeight: 'bold' }} title="ลบ Field">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={isSaving}>
            {isSaving ? "กำลังบันทึก..." : (selectedId === "new" ? "✨ บันทึกเทมเพลตใหม่" : "💾 อัปเดตข้อมูล")}
          </button>
        </form>
      </div>
    </div>
  );
}