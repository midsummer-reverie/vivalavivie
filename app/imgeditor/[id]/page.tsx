"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import * as htmlToImage from 'html-to-image';

export default function TemplateDetail() {
  const params = useParams<{ id: string }>();
  const templateId = params?.id || '';

  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isUnlocked, setIsUnlocked] = useState(false); 
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{mode: 'original'|'customize', vMode: 'preview'|'code'} | null>(null);

  const [editMode, setEditMode] = useState<'original' | 'customize'>('original');
  const [activeVariation, setActiveVariation] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const [fieldValues, setFieldValues] = useState<{ [key: string]: any }>({});
  const [base64Images, setBase64Images] = useState<{ [url: string]: string }>({});
  
  const [drafts, setDrafts] = useState<{ name: string; values: any }[]>([]);
  const [draftName, setDraftName] = useState("");
  const [selectedDraftIndex, setSelectedDraftIndex] = useState<number>(-1);

  const [customDropdowns, setCustomDropdowns] = useState<{ [key: string]: boolean }>({});
  const previewRef = useRef<HTMLDivElement>(null);
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});
  const [selections, setSelections] = useState<{ [key: string]: { start: number, end: number } }>({});

  useEffect(() => {
    if (!templateId) return;
    const fetchTemplate = async () => {
      try {
        const res = await fetch('/api/templates');
        if (res.ok) {
          const data = await res.json();
          const foundTemplate = data.find((c: any) => c.id === templateId);
          
          if (foundTemplate) {
            ['variations', 'customFields', 'blocks'].forEach(key => {
              if (typeof foundTemplate[key] === 'string') {
                try { foundTemplate[key] = JSON.parse(foundTemplate[key]); } 
                catch { foundTemplate[key] = []; }
              }
              if (!Array.isArray(foundTemplate[key])) foundTemplate[key] = [];
            });

            setTemplate(foundTemplate);
            setIsUnlocked(!foundTemplate.isLocked);
            initFieldValues(foundTemplate);
            loadDraftsFromStorage(templateId);
          }
        }
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchTemplate();
  }, [templateId]);

  const initFieldValues = (tplData: any, forceReset: boolean = false) => {
    const initial: { [key: string]: any } = {};
    if (tplData.customFields && Array.isArray(tplData.customFields)) {
      tplData.customFields.forEach((field: any) => {
        if (field.type === 'image') initial[field.variableName] = { url: "", x: 50, y: 50, zoom: 100 };
        else initial[field.variableName] = ""; 
      });
    }

    if (!forceReset) {
      try {
        const autosave = localStorage.getItem(`template_autosave_${tplData.id}`);
        if (autosave) {
          const parsed = JSON.parse(autosave);
          setFieldValues({ ...initial, ...(parsed.values || {}) });
          setTimeout(() => {
            Object.values(textareaRefs.current).forEach(el => autoResize(el));
          }, 100);
          return;
        }
      } catch (e) { console.error("Autosave load error:", e); }
    }
    setFieldValues(initial);
  };

  useEffect(() => {
    if (!template || !templateId) return;
    const timer = setTimeout(() => {
      try { localStorage.setItem(`template_autosave_${templateId}`, JSON.stringify({ values: fieldValues })); } 
      catch (e) { console.warn("Autosave skipped", e); }
    }, 1000); 
    return () => clearTimeout(timer);
  }, [fieldValues, templateId, template]);

  useEffect(() => {
    const convertUrlToBase64 = async (url: string) => {
      if (!url || url.startsWith('data:')) return;
      try {
        const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(url)}`);
        
        if (!response.ok) {
          throw new Error('ไม่สามารถดึงรูปภาพจาก API ได้');
        }

        const data = await response.json();
        
        if (data.base64) {
          setBase64Images(prev => ({ ...prev, [url]: data.base64 }));
        }
      } catch (error) {
        console.error("แปลงภาพเป็น Base64 ไม่สำเร็จ:", error);
      }
    };

    if (template?.customFields) {
      template.customFields.forEach((field: any) => {
        if (field.type === 'image') {
          const imgData = fieldValues[field.variableName];
          if (imgData && imgData.url && !base64Images[imgData.url]) {
            convertUrlToBase64(imgData.url);
          }
        }
      });
    }
  }, [fieldValues, template, base64Images]);

  const loadDraftsFromStorage = (id: string) => {
    try {
      const saved = localStorage.getItem(`template_drafts_${id}`);
      if (saved) setDrafts(JSON.parse(saved));
    } catch (e) { console.error(e); }
  };

  const saveDraftToStorage = (newDrafts: any[]) => {
    try {
      localStorage.setItem(`template_drafts_${templateId}`, JSON.stringify(newDrafts));
      setDrafts(newDrafts);
    } catch (e) { console.error(e); }
  };

  const handleSaveDraft = () => {
    if (!draftName.trim()) return alert("กรุณาตั้งชื่อดราฟต์");
    const newDrafts = [{ name: draftName, values: { ...fieldValues } }, ...drafts];
    if (newDrafts.length > 10) newDrafts.pop();
    saveDraftToStorage(newDrafts);
    setDraftName("");
    alert("✨ บันทึกดราฟต์สำเร็จ!");
  };

  const handleUpdateDraft = () => {
    if (selectedDraftIndex >= 0 && drafts[selectedDraftIndex]) {
      const updatedDrafts = [...drafts];
      updatedDrafts[selectedDraftIndex] = { ...updatedDrafts[selectedDraftIndex], values: { ...fieldValues } };
      saveDraftToStorage(updatedDrafts);
      alert("✨ อัปเดตดราฟต์สำเร็จ!");
    }
  };

  const handleLoadDraft = () => {
    if (selectedDraftIndex >= 0 && drafts[selectedDraftIndex]) {
      setFieldValues(drafts[selectedDraftIndex].values || {});
      setTimeout(() => { Object.values(textareaRefs.current).forEach(el => autoResize(el)); }, 100);
    }
  };

  const handleDeleteDraft = () => {
    if (selectedDraftIndex >= 0) {
      if (confirm("⚠️ แน่ใจหรือไม่ว่าต้องการลบดราฟต์นี้?")) {
        const newDrafts = drafts.filter((_, i) => i !== selectedDraftIndex);
        saveDraftToStorage(newDrafts);
        setSelectedDraftIndex(-1);
      }
    }
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === template?.lockPassword) {
      setIsUnlocked(true);
      setShowUnlockModal(false);
      setPasswordError(false);
      if (pendingAction) {
        setEditMode(pendingAction.mode);
        setViewMode(pendingAction.vMode);
        setPendingAction(null);
      }
    } else { setPasswordError(true); }
  };

  const handleModeSwitch = (mode: 'original' | 'customize', vMode: 'preview' | 'code') => {
    if (template?.isLocked && !isUnlocked && (mode === 'customize' || vMode === 'code')) {
      setPendingAction({ mode, vMode });
      setShowUnlockModal(true);
    } else {
      setEditMode(mode);
      setViewMode(vMode);
    }
  };

  const getFallbackColor = (varName: string) => {
    const variation = template?.variations?.[activeVariation];
    if (!variation || !variation.replacements) return '#f472b6';
    const lines = variation.replacements.split('\n');
    const found = lines.find((l: string) => l.split('=')[0].trim() === varName);
    if (found) return found.substring(found.indexOf('=') + 1).trim();
    return '#f472b6';
  };

  const safeHex = (colorStr: string, defaultHex: string = '#000000') => {
    if (!colorStr) return defaultHex;
    const match = colorStr.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/i);
    if (match) {
      let hex = match[0];
      if (hex.length === 4) hex = '#' + hex[1]+hex[1] + hex[2]+hex[2] + hex[3]+hex[3];
      return hex;
    }
    return defaultHex;
  };

  const updateSelection = (refKey: string) => {
    const el = textareaRefs.current[refKey];
    if (el && document.activeElement === el) setSelections(prev => ({ ...prev, [refKey]: { start: el.selectionStart, end: el.selectionEnd } }));
  };

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  const insertTag = (refKey: string, currentValue: string, onUpdate: (val: string) => void, openTag: string, closeTag: string = '') => {
    const el = textareaRefs.current[refKey];
    if (!el) return;
    const sel = selections[refKey] || { start: el.selectionStart, end: el.selectionEnd };
    const start = sel.start; const end = sel.end;
    const before = currentValue.substring(0, start); const selected = currentValue.substring(start, end); const after = currentValue.substring(end);
    onUpdate(before + openTag + selected + closeTag + after);
    setTimeout(() => {
      el.focus();
      const newCursorStart = start + openTag.length; const newCursorEnd = newCursorStart + selected.length;
      el.setSelectionRange(newCursorStart, newCursorEnd);
      setSelections(prev => ({ ...prev, [refKey]: { start: newCursorStart, end: newCursorEnd } }));
      autoResize(el);
    }, 0);
  };

  const parseContent = (text: string, isForPreview: boolean) => {
    if (!text) return "";
    let parsed = text
      .replace(/\[b\]([\s\S]*?)\[\/b\]/gi, '<strong>$1</strong>')
      .replace(/\[i\]([\s\S]*?)\[\/i\]/gi, '<em>$1</em>')
      .replace(/\[u\]([\s\S]*?)\[\/u\]/gi, '<u>$1</u>')
      .replace(/\[align=(left|center|right|justify)\]([\s\S]*?)\[\/align\]/gi, '<div style="text-align: $1;">$2</div>')
      .replace(/\[size=(.*?)\]([\s\S]*?)\[\/size\]/gi, '<span style="font-size: $1;">$2</span>')
      .replace(/\[color=(.*?)\]([\s\S]*?)\[\/color\]/gi, '<span style="color: $1;">$2</span>')
      .replace(/\[bg=(.*?)\]([\s\S]*?)\[\/bg\]/gi, '<span style="background-color: $1;">$2</span>')
      .replace(/\[url=(.*?)\]([\s\S]*?)\[\/url\]/gi, '<a href="$1" target="_blank" style="color: #f472b6; text-decoration: underline;">$2</a>')
      .replace(/\[img\](.*?)\[\/img\]/gi, '<img src="$1" style="max-width: 100%; height: auto; border-radius: 8px;" crossorigin="anonymous" />')
      .replace(/\[img=(.*?)\][\s\S]*?\[\/img\]/gi, '<img src="$1" style="max-width: 100%; height: auto; border-radius: 8px;" crossorigin="anonymous" />')
      .replace(/\[hr\]/gi, '<hr style="border: 0; border-top: 1px solid currentColor; opacity: 0.3; margin: 16px 0;" />');
      
    if (isForPreview) parsed = parsed.replace(/\n/g, '<br/>');
    return parsed;
  };

  const getCssVariables = () => {
    const vars: any = {};
    if (editMode === 'customize') {
      if (template?.customFields) {
        template.customFields.forEach((field: any) => {
          const cleanVarName = field.variableName.replace(/\*/g, ''); 
          const val = fieldValues[field.variableName];
          
          if (field.conditionVar && field.conditionVar.trim() !== "") {
             const parentVal = fieldValues[field.conditionVar] || "";
             if (parentVal !== field.conditionVal) return;
          }

          if (field.type === 'image') {
            const imgData = val || { url: "", x: 50, y: 50, zoom: 100 };

            let finalUrl = 'none';
            if (imgData.url) {
                if (imgData.url.startsWith('data:')) {
                    finalUrl = `url('${imgData.url}')`;
                } else if (base64Images[imgData.url]) {
                    finalUrl = `url('${base64Images[imgData.url]}')`;
                }
            }

            vars[`--${cleanVarName}`] = finalUrl;
            vars[`--${cleanVarName}-x`] = `${imgData.x}%`;
            vars[`--${cleanVarName}-y`] = `${imgData.y}%`;
            vars[`--${cleanVarName}-zoom`] = `${imgData.zoom}%`;
            
          } else if (field.type === 'color' || field.type === 'gradient') {
            vars[`--${cleanVarName}`] = val || getFallbackColor(field.variableName) || '';
          }
        });
      }
    } else {
      const variation = template?.variations?.[activeVariation];
      if (variation && variation.replacements) {
        const lines = variation.replacements.split('\n');
        lines.forEach((line: string) => {
          const [k, v] = line.split('=');
          if (k && v) vars[`--${k.trim().replace(/\*/g, '')}`] = v.trim();
        });
      }
    }
    return vars;
  };

  const getRenderedHtml = (isForPreview: boolean = false) => {
    if (!template || !template.htmlCode) return "";
    let finalHtml = template.htmlCode;
    
    if (editMode === 'customize') {
      if (template.customFields && Array.isArray(template.customFields)) {
        template.customFields.forEach((field: any) => {
          const val = fieldValues[field.variableName] || "";
          if (field.conditionVar && field.conditionVar.trim() !== "") {
             const parentVal = fieldValues[field.conditionVar] || "";
             if (parentVal !== field.conditionVal) return;
          }
          if (field.type === 'richtext' || field.type === 'roleplay') {
            if (val !== "") finalHtml = finalHtml.split(field.variableName).join(parseContent(val, isForPreview));
          } else if (field.type === 'text' || field.type === 'dropdown') {
            if (val !== "") finalHtml = finalHtml.split(field.variableName).join(val);
          } else if (field.type === 'image') {
            finalHtml = finalHtml.split(field.variableName).join("");
          }
        });
      }
    } else {
      const variation = template.variations?.[activeVariation];
      if (variation) {
        if (variation.type === 'full_html' && variation.fullHtml) {
          finalHtml = variation.fullHtml;
        } else if (variation.replacements) {
          const lines = variation.replacements.split('\n');
          lines.forEach((line: string) => {
            const idx = line.indexOf('=');
            if (idx !== -1) finalHtml = finalHtml.split(line.substring(0, idx).trim()).join(line.substring(idx + 1).trim());
          });
        }
      }
    }

    if (isForPreview) {
      finalHtml = finalHtml.replace(/\n/g, '<br/>');
      finalHtml = finalHtml.replace(/>\s*<br\/>\s*</g, '>\n<');
    }
    return finalHtml;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getRenderedHtml(false));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportImage = async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, { 
        quality: 1, 
        pixelRatio: 2,
        useCORS: true,
        cacheBust: true,
        backgroundColor: 'transparent',
        // เพิ่ม imagePlaceholder เผื่อรูปโหลดไม่สมบูรณ์จะได้ไม่แครช
        imagePlaceholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
      });
      const link = document.createElement('a');
      link.download = `${template.name || 'image'}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export Error:', err);
      alert('เกิดข้อผิดพลาดในการ Export ภาพครับ โปรดตรวจสอบรูปภาพหรือส่วนประกอบที่โหลดไม่สมบูรณ์');
    }
  };

  const renderFieldUI = (field: any, val: any, onChange: (v: any) => void, refKey: string, allValues: any) => {
    if (field.conditionVar && field.conditionVar.trim() !== "") {
      const parentVal = allValues[field.conditionVar] || "";
      if (parentVal !== field.conditionVal) return null;
    }

    if (field.type === 'dropdown') {
      const optionsArray = field.options ? field.options.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
      const isValueCustom = val && val !== "" && !optionsArray.includes(val);
      const isCustom = customDropdowns[refKey] || isValueCustom;

      return (
        <div key={refKey} className="field-group">
          <label className="field-label">{field.label}</label>
          {isCustom ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" className="glass-input" placeholder={`พิมพ์${field.label}ด้วยตัวเอง...`} value={val || ""} onChange={e => onChange(e.target.value)} />
              <button type="button" className="tool-btn" style={{ padding: '0 12px' }} onClick={() => {
                setCustomDropdowns(prev => ({ ...prev, [refKey]: false }));
                onChange(optionsArray[0] || "");
              }}>↩️</button>
            </div>
          ) : (
            <select className="glass-input" value={val || ""} onChange={e => {
              if (e.target.value === '__CUSTOM__') {
                setCustomDropdowns(prev => ({ ...prev, [refKey]: true }));
                onChange("");
              } else {
                onChange(e.target.value);
              }
            }}>
              <option value="" disabled>-- เลือก{field.label} --</option>
              {optionsArray.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
              <option value="__CUSTOM__">✨ พิมพ์กำหนดค่าเอง...</option>
            </select>
          )}
        </div>
      );
    }

    if (field.type === 'gradient') {
      const fallbackCol = getFallbackColor(field.variableName);
      const currentVal = val || fallbackCol || 'linear-gradient(90deg, #fbcfe8, #fef08a)';
      
      const getC1 = () => safeHex(currentVal.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/gi)?.[0] || '#fbcfe8');
      const getC2 = () => {
        const matches = currentVal.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/gi);
        return safeHex(matches && matches.length > 1 ? matches[1] : (matches ? matches[0] : '#fef08a'));
      }
      const getAngle = () => currentVal.match(/(\d+)deg/)?.[1] || '90';

      return (
        <div key={refKey} className="field-group">
          <label className="field-label">{field.label}</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '36px', borderRadius: '6px', background: currentVal.includes('gradient') ? currentVal : safeHex(currentVal), border: '2px solid var(--color-accent-light)', flexShrink: 0 }} />
            <input type="text" className="glass-input" placeholder={`เช่น linear-gradient(90deg, #000, #fff)`} value={val || ''} onChange={e => onChange(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px', background: 'rgba(255,255,255,0.6)', padding: '8px 12px', borderRadius: '12px', border: '1px solid var(--color-accent-light)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>ปรับสี:</span>
            <input type="color" value={getC1()} onChange={e => onChange(`linear-gradient(${getAngle()}deg, ${e.target.value}, ${getC2()})`)} style={{ width: '28px', height: '28px', border: 'none', cursor: 'pointer', padding: 0, background: 'transparent' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary)' }}>→</span>
            <input type="color" value={getC2()} onChange={e => onChange(`linear-gradient(${getAngle()}deg, ${getC1()}, ${e.target.value})`)} style={{ width: '28px', height: '28px', border: 'none', cursor: 'pointer', padding: 0, background: 'transparent' }} />
            <div style={{ width: '1px', height: '16px', background: 'var(--color-accent-light)', margin: '0 4px' }} />
            <input type="number" min="0" max="360" value={getAngle()} onChange={e => onChange(`linear-gradient(${e.target.value}deg, ${getC1()}, ${getC2()})`)} className="glass-input" style={{ width: '60px', padding: '4px 8px', height: '28px', fontSize: '0.85rem' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', fontWeight: 'bold' }}>deg</span>
          </div>
        </div>
      );
    }

    if (field.type === 'color') {
      const fallbackCol = getFallbackColor(field.variableName);
      const currentVal = val || fallbackCol;
      const pickerVal = safeHex(currentVal, '#f472b6');

      return (
        <div key={refKey} className="field-group">
          <label className="field-label">{field.label}</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="color" style={{ width: '45px', height: '40px', border: 'none', cursor: 'pointer', borderRadius: '8px' }} value={pickerVal} onChange={e => onChange(e.target.value)} />
            <input type="text" className="glass-input" placeholder={`เช่น ${fallbackCol}`} value={val || ''} onChange={e => onChange(e.target.value)} />
          </div>
        </div>
      );
    }
    
    if (field.type === 'image') {
      const imgData = val || { url: "", x: 50, y: 50, zoom: 100 };
      const isBase64Ready = base64Images[imgData.url];
      
      return (
        <div key={refKey} className="field-group" style={{ background: 'rgba(255,255,255,0.6)', padding: '16px', borderRadius: '12px', border: '1px dashed var(--color-accent)' }}>
          <label className="field-label" style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>{field.label}</span>
            {imgData.url && (isBase64Ready ? <span style={{fontSize:'0.75rem', color: '#16a34a'}}>✅ โหลดภาพสำเร็จ</span> : <span style={{fontSize:'0.75rem', color: '#d97706'}}>⏳ กำลังดึงภาพ...</span>)}
          </label>
          <input type="url" className="glass-input" placeholder={`วางลิงก์รูปภาพ...`} value={imgData.url} onChange={e => onChange({ ...imgData, url: e.target.value })} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <div><span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>แกน X ({imgData.x}%)</span><input type="range" min="0" max="100" value={imgData.x} onChange={e => onChange({ ...imgData, x: Number(e.target.value) })} style={{ width: '100%', accentColor: 'var(--color-accent)' }} /></div>
            <div><span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>แกน Y ({imgData.y}%)</span><input type="range" min="0" max="100" value={imgData.y} onChange={e => onChange({ ...imgData, y: Number(e.target.value) })} style={{ width: '100%', accentColor: 'var(--color-accent)' }} /></div>
            <div style={{ gridColumn: 'span 2' }}><span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>ขนาดซูม ({imgData.zoom}%)</span><input type="range" min="10" max="300" value={imgData.zoom} onChange={e => onChange({ ...imgData, zoom: Number(e.target.value) })} style={{ width: '100%', accentColor: 'var(--color-accent)' }} /></div>
          </div>
        </div>
      );
    }

    if (field.type === 'richtext' || field.type === 'roleplay') {
      const textVal = val || "";
      return (
        <div key={refKey} className="field-group">
          <label className="field-label">{field.label}</label>
          <div className="editor-container">
            <div className="editor-toolbar">
              <div className="tb-group">
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => insertTag(refKey, textVal, onChange, '[b]', '[/b]')} title="ตัวหนา"><b>B</b></button>
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => insertTag(refKey, textVal, onChange, '[i]', '[/i]')} title="ตัวเอียง"><i>I</i></button>
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => insertTag(refKey, textVal, onChange, '[u]', '[/u]')} title="ขีดเส้นใต้"><u>U</u></button>
              </div>
              <div className="tb-divider"></div>
              <div className="tb-group">
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => insertTag(refKey, textVal, onChange, '[align=left]', '[/align]')}> <svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 4h12v2H2zm0 4h8v2H2zm0 4h12v2H2z"/></svg> </button>
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => insertTag(refKey, textVal, onChange, '[align=center]', '[/align]')}> <svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 4h12v2H2zm2 4h8v2H4zm-2 4h12v2H2z"/></svg> </button>
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => insertTag(refKey, textVal, onChange, '[align=right]', '[/align]')}> <svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 4h12v2H2zm4 4h8v2H6zm-4 4h12v2H2z"/></svg> </button>
              </div>
              <div className="tb-divider"></div>
              <div className="tb-group">
                <select id={`size_${refKey}`} className="tb-select">
                  <option value="12px">12px</option><option value="14px">14px</option><option value="16px">16px</option><option value="18px">18px</option><option value="20px">20px</option><option value="24px">24px</option>
                </select>
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => { const size = (document.getElementById(`size_${refKey}`) as HTMLSelectElement).value; insertTag(refKey, textVal, onChange, `[size=${size}]`, '[/size]'); }} style={{ padding: '4px' }}>A📏</button>
              </div>
              <div className="tb-divider"></div>
              <div className="tb-group">
                <div className="color-picker-group">
                  <input type="color" id={`color_${refKey}`} defaultValue="#831843" className="cp-input" title="สีข้อความ" />
                  <button className="tool-btn cp-btn" onMouseDown={e => e.preventDefault()} onClick={() => { const color = (document.getElementById(`color_${refKey}`) as HTMLInputElement).value; insertTag(refKey, textVal, onChange, `[color=${color}]`, '[/color]'); }}>🎨</button>
                </div>
              </div>
            </div>
            <textarea 
              ref={el => { textareaRefs.current[refKey] = el; }} 
              className="editor-textarea custom-scrollbar" 
              placeholder={`พิมพ์${field.label}ที่นี่...`} 
              value={textVal} 
              onChange={e => { onChange(e.target.value); autoResize(e.target); }} 
              onSelect={() => updateSelection(refKey)} 
              onKeyUp={() => updateSelection(refKey)} 
              onMouseUp={() => updateSelection(refKey)} 
            />
          </div>
        </div>
      );
    }

    return (
      <div key={refKey} className="field-group">
        <label className="field-label">{field.label}</label>
        <input type="text" className="glass-input" placeholder={`ระบุ${field.label}...`} value={val || ""} onChange={e => onChange(e.target.value)} />
      </div>
    );
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#be123c', fontWeight: 'bold', fontFamily: '"Google Sans", sans-serif', fontSize: '1.2rem' }}>Loading. . . 🌸</div>;
  if (!template) return <div style={{ textAlign: 'center', padding: '50px', color: '#be123c', fontFamily: '"Google Sans", sans-serif', fontSize: '1.2rem'}}><h2>ไม่พบข้อมูลเทมเพลตนี้ 😥</h2><Link href="/imgeditor">กลับไปหน้าหลัก</Link></div>;

  const previewHtml = getRenderedHtml(true);
  const codeHtml = getRenderedHtml(false);
  const inlineCssVars = getCssVariables();

  const themeVars = {
    '--color-text-main': '#831843', '--color-primary': '#be123c', '--color-secondary': '#db2777', '--color-accent': '#f472b6',
    '--color-accent-light': '#fbcfe8', '--bg-grad-1': '#fce7f3', '--bg-grad-2': '#fef08a', '--bg-grad-3': '#fff1f2',
    '--bg-grad-4': '#ffedd5', '--glass-border': 'rgba(255, 255, 255, 0.8)', '--glass-bg': 'rgba(255, 255, 255, 0.7)',
    '--glass-input': 'rgba(255, 255, 255, 0.95)', '--danger': '#e11d48', '--danger-border': '#fecdd3'
  } as React.CSSProperties;

  return (
    <div className="template-detail-wrapper" style={themeVars}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;600;700;800&display=swap');
        .template-detail-wrapper { min-height: 100vh; margin: 0; padding: 2vw 4vw; font-family: 'Google Sans', sans-serif; color: var(--color-text-main); background: radial-gradient(circle at 15% 20%, var(--bg-grad-1) 0%, transparent 50%), radial-gradient(circle at 85% 80%, var(--bg-grad-2) 0%, transparent 50%), linear-gradient(135deg, var(--bg-grad-3) 0%, var(--bg-grad-4) 100%); background-attachment: fixed; overflow-x: hidden; }
        .template-detail-wrapper * { box-sizing: border-box; }
        button, input, textarea, select { font-family: 'Google Sans', sans-serif !important; }
        
        .wide-w { max-width: 1600px; margin: 0 auto; position: relative; z-index: 10; width: 100%; }
        .split-layout { display: grid; grid-template-columns: 500px 1fr; gap: 24px; align-items: start; }
        
        .back-btn { display: inline-flex; align-items: center; margin-bottom: 24px; text-decoration: none; color: var(--color-primary); font-weight: 700; background: rgba(255,255,255,0.7); border: 2px solid var(--glass-border); padding: 10px 20px; border-radius: 20px; backdrop-filter: blur(8px); box-shadow: 0 4px 10px rgba(244, 114, 182, 0.1); transition: 0.3s; }
        .back-btn:hover { background: #fff; transform: translateX(-5px); border-color: var(--color-accent-light); }
        
        .glass-panel { background: var(--glass-bg); border: 2px solid var(--glass-border); border-radius: 24px; padding: 24px; backdrop-filter: blur(16px); box-shadow: 0 10px 40px rgba(244, 114, 182, 0.15); }
        .left-panel { position: sticky; top: 20px; max-height: calc(100vh - 40px); overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }
        .right-panel { display: flex; flex-direction: column; gap: 20px; min-width: 0; }

        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.4); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--color-accent); border-radius: 10px; }
        
        .header-box { border-bottom: 2px dashed var(--color-accent-light); padding-bottom: 20px; }
        .template-title { font-size: 2rem; font-weight: 800; margin: 0 0 12px 0; color: var(--color-primary); line-height: 1.2; }
        .tag-type { background: var(--color-accent-light); color: var(--color-primary); font-size: 0.85rem; font-weight: 800; padding: 6px 14px; border-radius: 12px; display: inline-block; }
        
        .customizer-box { background: rgba(255,255,255,0.8); border: 2px solid var(--color-accent-light); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 16px; animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        
        .field-group { display: flex; flex-direction: column; gap: 8px; }
        .field-label { font-weight: 800; color: var(--color-secondary); font-size: 1rem; }
        .glass-input { width: 100%; padding: 12px 16px; border-radius: 12px; border: 2px solid var(--color-accent-light); background: var(--glass-input); outline: none; font-size: 0.95rem; color: var(--color-text-main); font-weight: 600; transition: 0.3s; }
        .glass-input:focus { border-color: var(--color-accent); box-shadow: 0 0 0 4px rgba(244, 114, 182, 0.2); }
        
        .editor-container { border: 2px solid var(--color-accent-light); border-radius: 12px; background: var(--glass-input); display: flex; flex-direction: column; overflow: hidden; }
        .editor-toolbar { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px; background: rgba(252, 231, 243, 0.8); border-bottom: 1px solid var(--color-accent-light); align-items: center; }
        .tb-group { display: flex; gap: 4px; align-items: center; }
        .tb-divider { width: 1px; background: var(--color-accent); height: 18px; margin: 0 4px; opacity: 0.3; }
        .editor-textarea { width: 100%; border: none; padding: 12px; font-size: 0.95rem; outline: none; background: transparent; resize: none; overflow-y: hidden; min-height: 120px; line-height: 1.6; transition: height 0.1s; }
        .tool-btn { background: #fff; border: 1px solid var(--color-accent-light); border-radius: 8px; padding: 4px 6px; font-size: 0.85rem; font-weight: 700; color: var(--color-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; min-width: 30px; transition: 0.2s; }
        .tool-btn:hover { background: var(--color-accent-light); color: var(--color-primary); }
        .tb-select { border: 1px solid var(--color-accent-light); border-radius: 8px; padding: 2px 6px; font-size: 0.8rem; color: var(--color-secondary); background: #fff; outline: none; cursor: pointer; height: 28px; font-weight: 600; }
        .color-picker-group { display: flex; align-items: center; gap: 2px; background: #fff; padding: 2px; border-radius: 8px; border: 1px solid var(--color-accent-light); height: 30px; }
        .cp-input { width: 24px; height: 24px; padding: 0; border: none; cursor: pointer; background: transparent; border-radius: 4px; }
        .cp-btn { border: none !important; background: transparent !important; padding: 0 6px !important; min-width: auto !important; height: auto !important; box-shadow: none !important; font-size: 0.8rem !important; }

        .variations-list { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
        .var-btn { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.8); border: 2px solid var(--glass-border); padding: 8px 16px; border-radius: 20px; cursor: pointer; font-weight: 700; color: var(--color-primary); font-size: 0.9rem; transition: 0.2s; }
        .var-btn.active { background: #fff; border-color: var(--color-accent); box-shadow: 0 4px 15px rgba(244, 114, 182, 0.3); }
        .color-dot { width: 14px; height: 14px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 0 1px rgba(0,0,0,0.1); }

        .draft-row { background: rgba(255,255,255,0.8); padding: 16px; border-radius: 16px; display: flex; flex-direction: column; gap: 12px; border: 2px dashed var(--color-accent-light); margin-bottom: 16px; }

        .mode-toggles { display: flex; background: rgba(255,255,255,0.7); border-radius: 16px; padding: 6px; border: 2px solid var(--glass-border); margin-bottom: 16px; }
        .m-toggle-btn { flex: 1; background: transparent; border: none; padding: 10px 12px; border-radius: 12px; font-weight: 800; color: var(--color-secondary); cursor: pointer; font-size: 1rem; transition: 0.3s; }
        .m-toggle-btn.active { background: #fff; color: var(--color-primary); box-shadow: 0 4px 15px rgba(244, 114, 182, 0.2); }

        .controls-row-right { display: flex; justify-content: space-between; align-items: center; }
        
        .display-area { background: #fff; border-radius: 20px; border: 2px solid var(--glass-border); min-height: 500px; position: relative; display: flex; flex-direction: column; overflow-x: hidden; box-shadow: inset 0 0 50px rgba(244, 114, 182, 0.1); }
        .preview-container { padding: 40px; display: flex; justify-content: center; align-items: center; background: url('https://transparenttextures.com/patterns/cubes.png') #fdf2f8; flex: 1; overflow: auto; }
        .preview-inner { box-shadow: 0 20px 50px rgba(225, 29, 72, 0.2); border-radius: 16px; background: transparent; display: inline-block; }
        
        .code-container { padding: 30px; background: #282c34; color: #fbcfe8; font-family: monospace !important; font-size: 0.95rem; line-height: 1.6; flex: 1; white-space: pre-wrap; margin: 0; }
        
        .btn-export { background: linear-gradient(135deg, #f472b6, #fbbf24); border: none; padding: 12px 24px; border-radius: 16px; font-weight: 800; color: #fff; cursor: pointer; box-shadow: 0 6px 20px rgba(244, 114, 182, 0.4); transition: 0.3s; font-size: 1.05rem; display: flex; align-items: center; gap: 8px; }
        .btn-export:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 10px 25px rgba(244, 114, 182, 0.6); }

        .modal-overlay { position: fixed; inset: 0; background: rgba(131, 24, 67, 0.3); backdrop-filter: blur(10px); display: flex; justify-content: center; align-items: center; z-index: 999; }
        .modal-content { background: rgba(255,255,255,0.95); padding: 40px; border-radius: 24px; border: 2px solid var(--color-accent-light); box-shadow: 0 20px 50px rgba(190, 18, 60, 0.2); text-align: center; max-width: 400px; width: 90%; }
        
        @media (max-width: 1024px) {
          .split-layout { grid-template-columns: 1fr; }
          .left-panel { position: static; max-height: none; overflow-y: visible; }
          .display-area { min-height: 400px; height: 60vh; }
        }
      `}} />

      {showUnlockModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginTop: 0, color: 'var(--color-primary)', fontWeight: 800 }}>🔒 เทมเพลตส่วนตัว</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-secondary)', marginBottom: '20px', fontWeight: 600 }}>ต้องใส่รหัสผ่านเพื่อเข้าใช้งาน</p>
            <form onSubmit={handleUnlockSubmit}>
              <input type="password" className="glass-input" style={{ textAlign: 'center', marginBottom: '16px' }} placeholder="ใส่รหัสผ่านที่นี่..." value={passwordInput} onChange={e => setPasswordInput(e.target.value)} autoFocus />
              {passwordError && <div style={{ color: 'var(--danger)', marginBottom: '16px', fontWeight: 700 }}>รหัสผ่านไม่ถูกต้อง ❌</div>}
              <button type="submit" className="btn-export" style={{ width: '100%', justifyContent: 'center' }}>ปลดล็อกเลย ✨</button>
            </form>
          </div>
        </div>
      )}

      <div className="wide-w">
        <Link className="back-btn" href="/imgeditor">← กลับไปคลังเทมเพลต</Link>

        {template.isLocked && !isUnlocked ? (
          <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '20px' }}>🔒</h2>
            <h2 style={{ color: 'var(--color-primary)', fontWeight: 800 }}>เทมเพลตนี้ถูกตั้งรหัสผ่านไว้</h2>
            <form onSubmit={handleUnlockSubmit} style={{ marginTop: '30px' }}>
              <input type="password" className="glass-input" style={{ maxWidth: '300px', textAlign: 'center', margin: '0 auto 16px auto', display: 'block' }} placeholder="ใส่รหัสผ่าน..." value={passwordInput} onChange={e => setPasswordInput(e.target.value)} autoFocus />
              {passwordError && <div style={{ color: 'var(--danger)', marginBottom: '16px', fontWeight: 700 }}>รหัสผ่านไม่ถูกต้อง ❌</div>}
              <div><button type="submit" className="btn-export" style={{ margin: '0 auto' }}>ปลดล็อกเพื่อใช้งาน ✨</button></div>
            </form>
          </div>
        ) : (
          <div className="split-layout">
            
            <div className="glass-panel left-panel custom-scrollbar">
              <div className="header-box">
                <h1 className="template-title">{template.name}</h1>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="tag-type">{template.category}</span>
                  {template.eventTags?.map((tag: string) => <span key={tag} style={{ background: '#fef08a', color: '#9a3412', padding: '6px 14px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800 }}>🎯 {tag}</span>)}
                  {template.tags?.map((tag: string) => <span key={tag} style={{ background: '#fff1f2', color: '#db2777', border: '1px solid #fbcfe8', padding: '5px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700 }}>🏷️ {tag}</span>)}
                </div>
                {template.description && (
                  <p style={{ marginTop: '16px', color: 'var(--color-secondary)', fontWeight: 600, fontSize: '0.95rem' }}>{template.description}</p>
                )}
              </div>

              <div className="mode-toggles">
                <button className={`m-toggle-btn ${editMode === 'original' ? 'active' : ''}`} onClick={() => handleModeSwitch('original', viewMode)}>
                  🌸 เลือกธีมสำเร็จรูป
                </button>
                <button className={`m-toggle-btn ${editMode === 'customize' ? 'active' : ''}`} onClick={() => handleModeSwitch('customize', viewMode)}>
                  ✍️ พิมพ์ข้อความ/ใส่รูป
                </button>
              </div>

              {editMode === 'customize' && isUnlocked && (
                <div className="draft-row">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary)' }}>💾 ระบบ Draft & Auto-save</span>
                    <button className="tool-btn" onClick={() => {
                      if(confirm("ล้างข้อมูลที่พิมพ์ค้างไว้ทั้งหมดและกลับไปเริ่มใหม่?")) {
                         localStorage.removeItem(`template_autosave_${templateId}`);
                         initFieldValues(template, true);
                      }
                    }} style={{ padding: '4px 10px', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'var(--danger-border)' }}>
                      🔄 เริ่มใหม่ทั้งหมด
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input type="text" className="glass-input" style={{ padding: '8px 12px', fontSize: '0.9rem' }} placeholder="ตั้งชื่อดราฟต์เพื่อเซฟถาวร..." value={draftName} onChange={e => setDraftName(e.target.value)} />
                    <button className="tool-btn" onClick={handleSaveDraft} style={{ minWidth: '70px', padding: '0 12px', fontWeight: 'bold' }}>บันทึก</button>
                  </div>
                  {drafts.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginTop: '6px' }}>
                      <select className="glass-input tb-select" style={{ flex: 1, minWidth: '150px', height: '36px', padding: '0 10px', fontSize: '0.9rem' }} value={selectedDraftIndex} onChange={e => setSelectedDraftIndex(Number(e.target.value))}>
                        <option value={-1}>-- เลือกดราฟต์ที่เซฟไว้ --</option>
                        {drafts.map((d, i) => <option key={i} value={i}>📁 {d.name}</option>)}
                      </select>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="tool-btn" onClick={handleLoadDraft} disabled={selectedDraftIndex === -1} style={{ height: '36px', padding: '0 12px' }}>โหลด</button>
                        <button className="tool-btn" onClick={handleUpdateDraft} disabled={selectedDraftIndex === -1} style={{ height: '36px', padding: '0 12px', background: '#dcfce7', borderColor: '#86efac', color: '#166534' }}>อัปเดต</button>
                        <button className="tool-btn" onClick={handleDeleteDraft} disabled={selectedDraftIndex === -1} style={{ height: '36px', padding: '0 12px', color: 'var(--danger)', borderColor: 'var(--danger-border)' }}>ลบ</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {editMode === 'original' && template.variations?.length > 0 && (
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary)' }}>เลือกรูปแบบที่ต้องการ:</div>
                  <div className="variations-list">
                    {template.variations.map((v: any, index: number) => (
                      <button key={v.id || index} className={`var-btn ${activeVariation === index ? 'active' : ''}`} onClick={() => setActiveVariation(index)}>
                        <div className="color-dot" style={{ backgroundColor: v.color || '#f472b6' }}></div>{v.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {editMode === 'customize' && (
                <div className="customizer-box">
                  <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.2rem', fontWeight: 800 }}>✨ ใส่ข้อมูลของคุณ</h3>
                  {template.customFields && template.customFields.map((field: any, index: number) => 
                    renderFieldUI(field, fieldValues[field.variableName], (newVal) => setFieldValues({ ...fieldValues, [field.variableName]: newVal }), `cf_${index}`, fieldValues)
                  )}
                  {(!template.customFields || template.customFields.length === 0) && (
                    <p style={{ color: 'var(--color-secondary)', textAlign: 'center', fontWeight: 600 }}>เทมเพลตนี้ไม่มีช่องให้กรอกข้อมูลครับ</p>
                  )}
                </div>
              )}
            </div>

            <div className="glass-panel right-panel">
              <div className="controls-row-right">
                <div className="mode-toggles" style={{ margin: 0, padding: '4px' }}>
                  <button className={`m-toggle-btn ${viewMode === 'preview' ? 'active' : ''}`} style={{ padding: '6px 16px' }} onClick={() => handleModeSwitch(editMode, 'preview')}>👁️ Live Preview</button>
                  <button className={`m-toggle-btn ${viewMode === 'code' ? 'active' : ''}`} style={{ padding: '6px 16px' }} onClick={() => handleModeSwitch(editMode, 'code')}>💻 Source Code</button>
                </div>
                
                {viewMode === 'preview' && (
                  <button className="btn-export" onClick={handleExportImage}>
                    📸 เซฟเป็นรูปภาพ
                  </button>
                )}
                
                {viewMode === 'code' && (
                  <button className="btn-export" style={{ background: '#db2777' }} onClick={handleCopy}>
                    {copied ? "✅ ก๊อปปี้แล้ว!" : "📋 ก๊อปปี้ HTML"}
                  </button>
                )}
              </div>

              <div className="display-area">
                {viewMode === 'preview' ? (
                  <div className="preview-container custom-scrollbar">
                    <div ref={previewRef} className="preview-inner relative bg-transparent" style={inlineCssVars}>
                      {template.cssCode && <style dangerouslySetInnerHTML={{ __html: template.cssCode }} />}
                      <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                    </div>
                  </div>
                ) : (
                  <pre className="code-container custom-scrollbar"><code>{codeHtml}</code></pre>
                )}
              </div>
              <p style={{ textAlign: 'center', color: 'var(--color-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>
                💡 ทิปส์: ภาพจะถูกเซฟเฉพาะส่วนที่อยู่ในกรอบผลลัพธ์เท่านั้น
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}