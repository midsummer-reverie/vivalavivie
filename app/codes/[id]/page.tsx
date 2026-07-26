"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function CodeDetail() {
  const params = useParams<{ id: string }>();
  const codeId = params?.id || '';

  const [code, setCode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [editMode, setEditMode] = useState<'original' | 'customize'>('original');
  const [activeVariation, setActiveVariation] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const [fieldValues, setFieldValues] = useState<{ [key: string]: any }>({});
  const [activeBlocks, setActiveBlocks] = useState<any[]>([]);
  
  const [drafts, setDrafts] = useState<{ name: string; values: any; blocks: any[] }[]>([]);
  const [draftName, setDraftName] = useState("");
  const [selectedDraftIndex, setSelectedDraftIndex] = useState<number>(-1);

  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});
  const [selections, setSelections] = useState<{ [key: string]: { start: number, end: number } }>({});

  useEffect(() => {
    if (!codeId) return;
    const fetchCode = async () => {
      try {
        const res = await fetch('/api/codes');
        if (res.ok) {
          const data = await res.json();
          const foundCode = data.find((c: any) => c.id === codeId);
          if (foundCode) {
            if (typeof foundCode.variations === 'string') {
              try { foundCode.variations = JSON.parse(foundCode.variations); } catch { foundCode.variations = []; }
            }
            if (typeof foundCode.customFields === 'string') {
              try { foundCode.customFields = JSON.parse(foundCode.customFields); } catch { foundCode.customFields = []; }
            }
            if (typeof foundCode.blocks === 'string') {
              try { foundCode.blocks = JSON.parse(foundCode.blocks); } catch { foundCode.blocks = []; }
            }
            
            if (!Array.isArray(foundCode.variations)) foundCode.variations = [];
            if (!Array.isArray(foundCode.customFields)) foundCode.customFields = [];
            if (!Array.isArray(foundCode.blocks)) foundCode.blocks = [];

            setCode(foundCode);
            if (!foundCode.isLocked) setIsUnlocked(true);

            initFieldValues(foundCode);
            loadDraftsFromStorage(codeId);
          }
        }
      } catch (error) { 
        console.error(error); 
      } 
      finally { 
        setLoading(false); 
      }
    };
    fetchCode();
  }, [codeId]);

  const initFieldValues = (codeData: any) => {
    const initial: { [key: string]: any } = {};
    if (codeData.customFields && Array.isArray(codeData.customFields)) {
      codeData.customFields.forEach((field: any) => {
        if (field.type === 'image') initial[field.variableName] = { url: "", x: 50, y: 50, zoom: 100 };
        else initial[field.variableName] = ""; 
      });
    }
    setFieldValues(initial);
    setActiveBlocks([]);
  };

  const loadDraftsFromStorage = (id: string) => {
    try {
      const saved = localStorage.getItem(`code_drafts_${id}`);
      if (saved) setDrafts(JSON.parse(saved));
    } catch (e) { console.error(e); }
  };

  const saveDraftToStorage = (newDrafts: any[]) => {
    try {
      localStorage.setItem(`code_drafts_${codeId}`, JSON.stringify(newDrafts));
      setDrafts(newDrafts);
    } catch (e) { console.error(e); }
  };

  const handleSaveDraft = () => {
    if (!draftName.trim()) return alert("กรุณาตั้งชื่อดราฟต์");
    const newDrafts = [{ name: draftName, values: { ...fieldValues }, blocks: [...activeBlocks] }, ...drafts];
    if (newDrafts.length > 5) newDrafts.pop();
    saveDraftToStorage(newDrafts);
    setDraftName("");
    alert("✨ บันทึกดราฟต์สำเร็จ!");
  };

  const handleUpdateDraft = () => {
    if (selectedDraftIndex >= 0 && drafts[selectedDraftIndex]) {
      const updatedDrafts = [...drafts];
      updatedDrafts[selectedDraftIndex] = {
        ...updatedDrafts[selectedDraftIndex],
        values: { ...fieldValues },
        blocks: [...activeBlocks]
      };
      saveDraftToStorage(updatedDrafts);
      alert("✨ อัปเดตดราฟต์สำเร็จ!");
    }
  };

  const handleLoadDraft = () => {
    if (selectedDraftIndex >= 0 && drafts[selectedDraftIndex]) {
      setFieldValues(drafts[selectedDraftIndex].values || {});
      setActiveBlocks(drafts[selectedDraftIndex].blocks || []);
      setTimeout(() => {
        Object.values(textareaRefs.current).forEach(el => autoResize(el));
      }, 100);
    }
  };

  const handleDeleteDraft = () => {
    if (selectedDraftIndex >= 0) {
      if (confirm("⚠️ แน่ใจหรือไม่ว่าต้องการลบดราฟต์นี้? (ลบแล้วกู้คืนไม่ได้นะ)")) {
        const newDrafts = drafts.filter((_, i) => i !== selectedDraftIndex);
        saveDraftToStorage(newDrafts);
        setSelectedDraftIndex(-1);
      }
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === code.lockPassword) {
      setIsUnlocked(true);
      setPasswordError(false);
    } else setPasswordError(true);
  };

  const addBlock = (blockDef: any) => {
    const newBlock = {
      instanceId: `block_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      blockId: blockDef.id,
      placeholder: blockDef.placeholder,
      htmlTemplate: blockDef.html,
      fields: blockDef.fields,
      values: {} as any
    };
    
    if (blockDef.fields && Array.isArray(blockDef.fields)) {
      blockDef.fields.forEach((f: any) => {
        if (f.type === 'image') newBlock.values[f.variableName] = { url: "", x: 50, y: 50, zoom: 100 };
        else newBlock.values[f.variableName] = "";
      });
    }
    
    setActiveBlocks([...activeBlocks, newBlock]);
  };

  const removeBlock = (instanceId: string) => {
    if(confirm("ลบส่วนเสริมนี้ทิ้งใช่หรือไม่?")) {
      setActiveBlocks(activeBlocks.filter(b => b.instanceId !== instanceId));
    }
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newArr = [...activeBlocks];
    if (direction === 'up' && index > 0) {
      [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
    } else if (direction === 'down' && index < newArr.length - 1) {
      [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
    }
    setActiveBlocks(newArr);
  };

  const updateBlockValue = (instanceId: string, varName: string, val: any) => {
    setActiveBlocks(activeBlocks.map(b => 
      b.instanceId === instanceId ? { ...b, values: { ...b.values, [varName]: val } } : b
    ));
  };

  const updateSelection = (refKey: string) => {
    const el = textareaRefs.current[refKey];
    if (el && document.activeElement === el) {
      setSelections(prev => ({ ...prev, [refKey]: { start: el.selectionStart, end: el.selectionEnd } }));
    }
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
    const start = sel.start;
    const end = sel.end;
    
    const before = currentValue.substring(0, start);
    const selected = currentValue.substring(start, end);
    const after = currentValue.substring(end);

    const updated = before + openTag + selected + closeTag + after;
    onUpdate(updated);

    setTimeout(() => {
      el.focus();
      const newCursorStart = start + openTag.length;
      const newCursorEnd = newCursorStart + selected.length;
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
      .replace(/\[url=(.*?)\]([\s\S]*?)\[\/url\]/gi, '<a href="$1" target="_blank" style="color: #a855f7; text-decoration: underline;">$2</a>')
      .replace(/\[hr\]/gi, '<hr style="border: 0; border-top: 1px solid currentColor; opacity: 0.3; margin: 16px 0;" />');
      
    if (isForPreview) {
      parsed = parsed.replace(/\n/g, '<br/>');
    }
    
    return parsed;
  };

  const countWords = (text: string) => {
    if (!text || text.trim() === '') return 0;
    const clean = text.replace(/<[^>]*>?/gm, '').replace(/\[.*?\]/g, '').trim();
    if (!clean) return 0;

    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
      const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
      let count = 0;
      for (const segment of segmenter.segment(clean)) {
        if (segment.isWordLike) count++;
      }
      return count;
    }
    return clean.split(/\s+/).filter(Boolean).length;
  };

  const getFallbackColor = (varName: string) => {
    const variation = code?.variations?.[activeVariation];
    if (!variation || !variation.replacements) return '#8b5cf6';
    const lines = variation.replacements.split('\n');
    const found = lines.find((l: string) => l.split('=')[0].trim() === varName);
    if (found) return found.substring(found.indexOf('=') + 1).trim();
    return '#8b5cf6';
  };

  const getRenderedHtml = (isForPreview: boolean = false) => {
    if (!code || !code.htmlCode) return "";
    let finalHtml = code.htmlCode;
    
    if (editMode === 'customize') {
      if (code.customFields && Array.isArray(code.customFields)) {
        code.customFields.forEach((field: any) => {
          const val = fieldValues[field.variableName] || "";
          
          if (field.type === 'image') {
            const imgData = fieldValues[field.variableName] || { url: "", x: 50, y: 50, zoom: 100 };
            if (imgData.url && imgData.url.trim() !== '') {
              const escapedVar = field.variableName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
              const legacyRegex = new RegExp(escapedVar + '\\)\\s*center\\s*\\/?\\s*cover', 'gi');

              if (legacyRegex.test(finalHtml)) {
                finalHtml = finalHtml.replace(legacyRegex, `${imgData.url}) ${imgData.x}% ${imgData.y}% / ${imgData.zoom}%`);
              } else {
                finalHtml = finalHtml.split(field.variableName).join(imgData.url);
                finalHtml = finalHtml.split(`${field.variableName}_URL`).join(imgData.url);
                finalHtml = finalHtml.split(`${field.variableName}_X`).join(imgData.x);
                finalHtml = finalHtml.split(`${field.variableName}_Y`).join(imgData.y);
                finalHtml = finalHtml.split(`${field.variableName}_ZOOM`).join(imgData.zoom);
              }
            }
          } else if (field.type === 'color') {
            const colorVal = val !== "" ? val : getFallbackColor(field.variableName);
            finalHtml = finalHtml.split(field.variableName).join(colorVal);
          } else if (field.type === 'richtext' || field.type === 'roleplay') {
            if (val !== "") {
              finalHtml = finalHtml.split(field.variableName).join(parseContent(val, isForPreview));
            }
          } else {
            if (val !== "") {
              finalHtml = finalHtml.split(field.variableName).join(val);
            }
          }
        });
      }

      if (activeBlocks.length > 0) {
        const blocksByPlaceholder: { [key: string]: string[] } = {};
        
        activeBlocks.forEach(block => {
          let blockHtml = block.htmlTemplate;
          
          if (block.fields && Array.isArray(block.fields)) {
            block.fields.forEach((field: any) => {
              const val = block.values[field.variableName] || "";
              if (field.type === 'image') {
                const imgData = val || { url: "", x: 50, y: 50, zoom: 100 };
                if (imgData.url && imgData.url.trim() !== '') {
                  const escapedVar = field.variableName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
                  const legacyRegex = new RegExp(escapedVar + '\\)\\s*center\\s*\\/?\\s*cover', 'gi');
                  if (legacyRegex.test(blockHtml)) {
                    blockHtml = blockHtml.replace(legacyRegex, `${imgData.url}) ${imgData.x}% ${imgData.y}% / ${imgData.zoom}%`);
                  } else {
                    blockHtml = blockHtml.split(field.variableName).join(imgData.url);
                    blockHtml = blockHtml.split(`${field.variableName}_URL`).join(imgData.url);
                    blockHtml = blockHtml.split(`${field.variableName}_X`).join(imgData.x);
                    blockHtml = blockHtml.split(`${field.variableName}_Y`).join(imgData.y);
                    blockHtml = blockHtml.split(`${field.variableName}_ZOOM`).join(imgData.zoom);
                  }
                }
              } else if (field.type === 'color') {
                const colorVal = val !== "" ? val : getFallbackColor(field.variableName);
                blockHtml = blockHtml.split(field.variableName).join(colorVal);
              } else if (field.type === 'richtext' || field.type === 'roleplay') {
                if (val !== "") blockHtml = blockHtml.split(field.variableName).join(parseContent(val, isForPreview));
              } else {
                if (val !== "") blockHtml = blockHtml.split(field.variableName).join(val);
              }
            });
          }
          
          if (!blocksByPlaceholder[block.placeholder]) blocksByPlaceholder[block.placeholder] = [];
          blocksByPlaceholder[block.placeholder].push(blockHtml);
        });

        Object.keys(blocksByPlaceholder).forEach(ph => {
          finalHtml = finalHtml.split(ph).join(blocksByPlaceholder[ph].join('\n'));
        });
      }

      if (code.blocks && Array.isArray(code.blocks)) {
        code.blocks.forEach((b: any) => {
          if (b.placeholder) finalHtml = finalHtml.split(b.placeholder).join("");
        });
      }

    } else {
      // 🌟 โหมดดูตัวอย่างต้นฉบับ (Original)
      const variation = code.variations?.[activeVariation];
      if (variation) {
        // หากตั้งค่าพรีเซ็ตเป็น "full_html" ให้ใช้โค้ดเต็มแทนที่ไปเลย
        if (variation.type === 'full_html' && variation.fullHtml) {
          finalHtml = variation.fullHtml;
        } 
        // ถ้าเป็นแบบ "replace" ก็ใช้โค้ดหลักมาไล่แทนที่ตามเดิม
        else if (variation.replacements) {
          const lines = variation.replacements.split('\n');
          lines.forEach((line: string) => {
            const idx = line.indexOf('=');
            if (idx !== -1) {
              const k = line.substring(0, idx).trim();
              const v = line.substring(idx + 1).trim();
              if (k) finalHtml = finalHtml.split(k).join(v);
            }
          });
        }
      }
      
      if (code.blocks && Array.isArray(code.blocks)) {
        code.blocks.forEach((b: any) => {
          if (b.placeholder) finalHtml = finalHtml.split(b.placeholder).join("");
        });
      }
    }

    if (isForPreview) {
      finalHtml = finalHtml
        .replace(/\[b\]([\s\S]*?)\[\/b\]/gi, '<strong>$1</strong>')
        .replace(/\[i\]([\s\S]*?)\[\/i\]/gi, '<em>$1</em>')
        .replace(/\[u\]([\s\S]*?)\[\/u\]/gi, '<u>$1</u>')
        .replace(/\[align=(left|center|right|justify)\]([\s\S]*?)\[\/align\]/gi, '<div style="text-align: $1;">$2</div>')
        .replace(/\[size=(.*?)\]([\s\S]*?)\[\/size\]/gi, '<span style="font-size: $1;">$2</span>')
        .replace(/\[color=(.*?)\]([\s\S]*?)\[\/color\]/gi, '<span style="color: $1;">$2</span>')
        .replace(/\[bg=(.*?)\]([\s\S]*?)\[\/bg\]/gi, '<span style="background-color: $1;">$2</span>')
        .replace(/\[url=(.*?)\]([\s\S]*?)\[\/url\]/gi, '<a href="$1" target="_blank" style="color: #a855f7; text-decoration: underline;">$2</a>')
        .replace(/\[hr\]/gi, '<hr style="border: 0; border-top: 1px solid currentColor; opacity: 0.3; margin: 16px 0;" />');

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

  const renderFieldUI = (field: any, val: any, onChange: (v: any) => void, refKey: string) => {
    if (field.type === 'color') {
      const fallbackCol = getFallbackColor(field.variableName);
      return (
        <div key={refKey} className="field-group">
          <label className="field-label">{field.label}</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="color" style={{ width: '40px', height: '36px', border: 'none', cursor: 'pointer', borderRadius: '6px' }} value={val || fallbackCol} onChange={e => onChange(e.target.value)} />
            <input type="text" className="glass-input" placeholder={`เช่น ${fallbackCol}`} value={val || ''} onChange={e => onChange(e.target.value)} />
          </div>
        </div>
      );
    }
    if (field.type === 'image') {
      const imgData = val || { url: "", x: 50, y: 50, zoom: 100 };
      return (
        <div key={refKey} className="field-group" style={{ background: 'rgba(255,255,255,0.4)', padding: '16px', borderRadius: '12px', border: '1px dashed var(--color-accent-light)' }}>
          <label className="field-label" style={{ marginBottom: '8px', display: 'block' }}>{field.label}</label>
          <input type="url" className="glass-input" placeholder={`วางลิงก์รูปภาพ ${field.label}...`} value={imgData.url} onChange={e => onChange({ ...imgData, url: e.target.value })} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>แกน X ({imgData.x}%)</span>
              <input type="range" min="0" max="100" value={imgData.x} onChange={e => onChange({ ...imgData, x: Number(e.target.value) })} style={{ width: '100%' }} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>แกน Y ({imgData.y}%)</span>
              <input type="range" min="0" max="100" value={imgData.y} onChange={e => onChange({ ...imgData, y: Number(e.target.value) })} style={{ width: '100%' }} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>ขนาดซูม ({imgData.zoom}%)</span>
              <input type="range" min="50" max="300" value={imgData.zoom} onChange={e => onChange({ ...imgData, zoom: Number(e.target.value) })} style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      );
    }
    if (field.type === 'richtext' || field.type === 'roleplay') {
      const isRp = field.type === 'roleplay';
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
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => {
                  const url = prompt("ระบุลิงก์ (URL):", "https://");
                  if(url) insertTag(refKey, textVal, onChange, `[url=${url}]`, '[/url]');
                }} title="แทรกลิงก์">🔗</button>
              </div>
              <div className="tb-divider"></div>
              <div className="tb-group">
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => insertTag(refKey, textVal, onChange, '[align=left]', '[/align]')} title="ชิดซ้าย">
                  <svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 4h12v2H2zm0 4h8v2H2zm0 4h12v2H2z"/></svg>
                </button>
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => insertTag(refKey, textVal, onChange, '[align=center]', '[/align]')} title="กึ่งกลาง">
                  <svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 4h12v2H2zm2 4h8v2H4zm-2 4h12v2H2z"/></svg>
                </button>
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => insertTag(refKey, textVal, onChange, '[align=right]', '[/align]')} title="ชิดขวา">
                  <svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 4h12v2H2zm4 4h8v2H6zm-4 4h12v2H2z"/></svg>
                </button>
              </div>
              <div className="tb-divider"></div>
              <div className="tb-group">
                <select id={`size_${refKey}`} className="tb-select">
                  <option value="12px">12px</option>
                  <option value="14px">14px</option>
                  <option value="16px">16px</option>
                  <option value="18px">18px</option>
                  <option value="20px">20px</option>
                  <option value="24px">24px</option>
                </select>
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => {
                  const size = (document.getElementById(`size_${refKey}`) as HTMLSelectElement).value;
                  insertTag(refKey, textVal, onChange, `[size=${size}]`, '[/size]');
                }} style={{ padding: '4px' }}>A📏</button>
              </div>
              <div className="tb-divider"></div>
              <div className="tb-group">
                <div className="color-picker-group">
                  <input type="color" id={`bg_${refKey}`} defaultValue="#fef08a" className="cp-input" title="สีไฮไลต์" />
                  <button className="tool-btn cp-btn" onMouseDown={e => e.preventDefault()} onClick={() => {
                    const bg = (document.getElementById(`bg_${refKey}`) as HTMLInputElement).value;
                    insertTag(refKey, textVal, onChange, `[bg=${bg}]`, '[/bg]');
                  }}>🖍️</button>
                </div>
                <div className="color-picker-group">
                  <input type="color" id={`color_${refKey}`} defaultValue="#4c1d95" className="cp-input" title="สีข้อความ" />
                  <button className="tool-btn cp-btn" onMouseDown={e => e.preventDefault()} onClick={() => {
                    const color = (document.getElementById(`color_${refKey}`) as HTMLInputElement).value;
                    insertTag(refKey, textVal, onChange, `[color=${color}]`, '[/color]');
                  }}>🎨</button>
                </div>
              </div>
              <div className="tb-divider"></div>
              <div className="tb-group">
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => insertTag(refKey, textVal, onChange, '<p>', '</p>')} style={{ fontSize: '0.75rem', padding: '4px' }}>&lt;p&gt;</button>
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => insertTag(refKey, textVal, onChange, '\n[hr]\n')} style={{ fontSize: '0.75rem', padding: '4px' }}>HR</button>
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => insertTag(refKey, textVal, onChange, '[spoiler]', '[/spoiler]')} style={{ fontSize: '0.75rem', padding: '4px' }}>SP</button>
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => insertTag(refKey, textVal, onChange, '[hide]', '[/hide]')} style={{ fontSize: '0.75rem', padding: '4px' }}>Hide</button>
              </div>
            </div>
            
            <textarea 
              ref={el => { textareaRefs.current[refKey] = el; }}
              className="editor-textarea custom-scrollbar"
              placeholder={`พิมพ์${field.label}ที่นี่...`}
              value={textVal} 
              onChange={e => {
                onChange(e.target.value);
                autoResize(e.target);
              }}
              onSelect={() => updateSelection(refKey)}
              onKeyUp={() => updateSelection(refKey)}
              onMouseUp={() => updateSelection(refKey)}
            />
          </div>
          {isRp && <div className="word-count">📊 จำนวนคำ: {countWords(textVal)} คำ</div>}
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

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  if (!code) return <div style={{ textAlign: 'center', padding: '50px' }}><h2>ไม่พบข้อมูลโค้ดนี้ 😥</h2><Link href="/codes">กลับไปหน้าหลัก</Link></div>;

  const previewHtml = getRenderedHtml(true);
  const codeHtml = getRenderedHtml(false);

  const themeVars = {
    '--color-text-main': '#2e1065',
    '--color-primary': '#4c1d95',
    '--color-secondary': '#6b21a8',
    '--color-accent': '#a855f7',
    '--color-accent-light': '#d8b4fe',
    '--color-accent-lighter': '#e9d5ff',
    '--color-accent-mute': 'rgba(216, 180, 254, 0.8)',
    '--bg-grad-1': '#e9d5ff',
    '--bg-grad-2': '#bae6fd',
    '--bg-grad-3': '#f3e8ff',
    '--bg-grad-4': '#e0f2fe',
    '--glass-border': 'rgba(255, 255, 255, 0.6)',
    '--glass-bg': 'rgba(255, 255, 255, 0.55)',
    '--glass-input': 'rgba(255, 255, 255, 0.9)',
    '--danger': '#ef4444',
    '--danger-border': '#fca5a5'
  } as React.CSSProperties;

  return (
    <div className="code-detail-wrapper" style={themeVars}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;600;700&display=swap');
        .code-detail-wrapper { min-height: 100vh; margin: 0; padding: 2vw 4vw; font-family: 'Google Sans', sans-serif; color: var(--color-text-main); background: radial-gradient(circle at 15% 20%, var(--bg-grad-1) 0%, transparent 50%), radial-gradient(circle at 85% 80%, var(--bg-grad-2) 0%, transparent 50%), linear-gradient(135deg, var(--bg-grad-3) 0%, var(--bg-grad-4) 100%); background-attachment: fixed; overflow-x: hidden; }
        .code-detail-wrapper * { box-sizing: border-box; }
        button, input, textarea, select { font-family: 'Google Sans', sans-serif !important; }
        
        .wide-w { max-width: 1600px; margin: 0 auto; position: relative; z-index: 10; width: 100%; }
        .split-layout { display: grid; grid-template-columns: 500px 1fr; gap: 24px; align-items: start; }
        
        .back-btn { display: inline-flex; align-items: center; margin-bottom: 20px; text-decoration: none; color: var(--color-text-main); font-weight: 600; background: rgba(255,255,255,0.45); border: 1px solid var(--glass-border); padding: 8px 16px; border-radius: 12px; backdrop-filter: blur(8px); }
        
        .glass-panel { background: var(--glass-bg); border: 1px solid rgba(255,255,255,0.7); border-radius: 20px; padding: 24px; backdrop-filter: blur(16px); box-shadow: 0 10px 40px rgba(139, 92, 246, 0.08); }
        .left-panel { position: sticky; top: 20px; max-height: calc(100vh - 40px); overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }
        .right-panel { display: flex; flex-direction: column; gap: 20px; }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.5); }

        .header-box { border-bottom: 2px solid rgba(139, 92, 246, 0.15); padding-bottom: 16px; }
        .code-title { font-size: 1.8rem; font-weight: 700; margin: 0 0 10px 0; color: var(--color-text-main); line-height: 1.2; }
        .tag-type { background: rgba(216, 180, 254, 0.6); color: var(--color-primary); font-size: 0.8rem; font-weight: 700; padding: 4px 10px; border-radius: 8px; display: inline-block; }
        
        .customizer-box { background: rgba(255,255,255,0.6); border: 1px solid var(--color-accent-light); border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 16px; animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        
        .field-group { display: flex; flex-direction: column; gap: 6px; }
        .field-label { font-weight: 700; color: var(--color-primary); font-size: 0.95rem; }
        .glass-input { width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--color-accent-light); background: var(--glass-input); outline: none; font-size: 0.95rem; color: var(--color-text-main); transition: 0.2s; }
        .glass-input:focus { border-color: var(--color-accent); box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2); }
        .glass-input::placeholder { color: var(--color-accent); font-weight: 400; opacity: 0.8; }
        
        .editor-container { border: 1px solid var(--color-accent-light); border-radius: 10px; background: var(--glass-input); display: flex; flex-direction: column; overflow: hidden; }
        .editor-toolbar { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px; background: rgba(243, 232, 255, 0.8); border-bottom: 1px solid var(--color-accent-lighter); align-items: center; }
        .tb-group { display: flex; gap: 4px; align-items: center; }
        .tb-divider { width: 1px; background: var(--color-accent-light); height: 18px; margin: 0 2px; opacity: 0.5; }
        
        .editor-textarea { width: 100%; border: none; padding: 12px; font-size: 0.95rem; outline: none; background: transparent; resize: none; overflow-y: hidden; min-height: 180px; line-height: 1.6; transition: height 0.1s; }
        
        .tool-btn { background: #fff; border: 1px solid var(--color-accent-mute); border-radius: 6px; padding: 4px; font-size: 0.85rem; font-weight: 600; color: var(--color-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; min-width: 28px; transition: 0.15s; }
        .tool-btn:hover { background: var(--color-accent-lighter); border-color: var(--color-accent); }
        .tool-btn svg { width: 16px; height: 16px; }
        .tool-btn:disabled { opacity: 0.5; cursor: not-allowed; background: #f3f4f6; }
        .tb-select { border: 1px solid var(--color-accent-mute); border-radius: 6px; padding: 2px 4px; font-size: 0.8rem; color: var(--color-secondary); background: #fff; outline: none; cursor: pointer; height: 26px; }
        
        .color-picker-group { display: flex; align-items: center; gap: 2px; background: #fff; padding: 2px; border-radius: 6px; border: 1px solid var(--color-accent-mute); height: 28px; }
        .cp-input { width: 22px; height: 22px; padding: 0; border: none; cursor: pointer; background: transparent; }
        .cp-btn { border: none !important; background: transparent !important; padding: 0 6px !important; min-width: auto !important; height: auto !important; box-shadow: none !important; font-size: 0.8rem !important; }

        .word-count { font-size: 0.85rem; color: var(--color-secondary); font-weight: 600; text-align: right; margin-top: 4px; }

        .draft-row { background: rgba(216, 180, 254, 0.2); padding: 16px; border-radius: 12px; display: flex; flex-direction: column; gap: 12px; border: 1px solid rgba(216, 180, 254, 0.5); }
        .variations-list { display: flex; gap: 8px; flex-wrap: wrap; }
        .var-btn { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.8); padding: 6px 12px; border-radius: 20px; cursor: pointer; font-weight: 600; color: var(--color-primary); font-size: 0.85rem; }
        .var-btn.active { background: #fff; border-color: var(--color-accent); box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2); }
        .color-dot { width: 12px; height: 12px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); }

        .mode-toggles { display: flex; background: rgba(255,255,255,0.4); border-radius: 12px; padding: 4px; border: 1px solid var(--glass-border); margin-bottom: 16px; }
        .m-toggle-btn { flex: 1; background: transparent; border: none; padding: 8px 10px; border-radius: 8px; font-weight: 700; color: var(--color-secondary); cursor: pointer; font-size: 0.9rem; transition: 0.2s; }
        .m-toggle-btn.active { background: #fff; color: var(--color-text-main); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

        .controls-row-right { display: flex; justify-content: space-between; align-items: center; }
        .view-toggles { display: flex; background: rgba(255,255,255,0.4); border-radius: 16px; padding: 4px; border: 1px solid var(--glass-border); }
        .toggle-btn { background: transparent; border: none; padding: 6px 16px; border-radius: 12px; font-weight: 600; color: var(--color-secondary); cursor: pointer; font-size: 0.9rem; }
        .toggle-btn.active { background: #fff; color: var(--color-text-main); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

        .display-area { background: #131313; border-radius: 12px; border: 1px solid var(--glass-border); min-height: 500px; height: 100%; overflow: hidden; position: relative; display: flex; flex-direction: column; }
        .preview-container { padding: 40px; display: flex; justify-content: center; align-items: flex-start; background: #131313; flex: 1; overflow-y: auto; }
        .preview-inner { box-shadow: 0 20px 40px rgba(0,0,0,0.5); border-radius: 8px; overflow: hidden; width: 100%; max-width: 100%; background: transparent; }
        
        .code-container { padding: 24px; background: #131313; color: #e2e8f0; font-family: monospace !important; font-size: 0.95rem; line-height: 1.6; overflow: auto; margin: 0; flex: 1; white-space: pre-wrap; }
        
        .btn-copy { position: absolute; top: 16px; right: 16px; background: var(--glass-input); border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; color: var(--color-text-main); cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 10; transition: 0.2s; }
        .btn-copy:hover { transform: scale(1.05); }

        .block-card { background: rgba(255,255,255,0.7); border: 2px dashed var(--color-accent-light); border-radius: 12px; padding: 16px; margin-bottom: 16px; position: relative; transition: 0.2s; }
        .block-card:hover { border-color: var(--color-accent); background: rgba(255,255,255,0.9); }
        .block-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(216,180,254,0.4); padding-bottom: 8px; }
        .block-title { font-weight: 700; color: var(--color-secondary); font-size: 1.05rem; display: flex; align-items: center; gap: 8px; }
        .block-actions { display: flex; gap: 6px; }
        .add-block-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; padding-top: 16px; border-top: 2px solid rgba(216,180,254,0.4); }
        .btn-add-block { background: var(--color-accent); color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 6px; }
        .btn-add-block:hover { background: #9333ea; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4); }

        @media (max-width: 1024px) {
          .split-layout { grid-template-columns: 1fr; }
          .left-panel { position: static; max-height: none; overflow-y: visible; }
          .display-area { min-height: 400px; height: 60vh; }
        }
      `}} />

      <div className="wide-w">
        <Link className="back-btn" href="/codes">← กลับไปหน้าหลัก</Link>

        {!isUnlocked ? (
          <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '60px' }}>
            <h2>🔒 โค้ดนี้ถูกล็อก</h2>
            <form onSubmit={handleUnlock} style={{ marginTop: '20px' }}>
              <input type="password" className="glass-input" style={{ maxWidth: '300px', textAlign: 'center', marginBottom: '16px' }} placeholder="ใส่รหัสผ่าน..." value={passwordInput} onChange={e => setPasswordInput(e.target.value)} autoFocus />
              {passwordError && <div style={{ color: 'var(--danger)', marginBottom: '10px' }}>รหัสผ่านไม่ถูกต้อง</div>}
              <div><button type="submit" className="tool-btn" style={{ padding: '10px 24px', margin: '0 auto' }}>ปลดล็อก</button></div>
            </form>
          </div>
        ) : (
          <div className="split-layout">
            
            <div className="glass-panel left-panel custom-scrollbar">
              <div className="header-box">
                <h1 className="code-title">{code.name}</h1>
                <span className="tag-type">{code.codeType}</span>
              </div>

              <div className="mode-toggles">
                <button className={`m-toggle-btn ${editMode === 'original' ? 'active' : ''}`} onClick={() => setEditMode('original')}>
                  👀 ดูตัวอย่างต้นฉบับ
                </button>
                <button className={`m-toggle-btn ${editMode === 'customize' ? 'active' : ''}`} onClick={() => setEditMode('customize')}>
                  ✍️ ปรับแต่งเอง
                </button>
              </div>

              {editMode === 'customize' && (
                <div className="draft-row">
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)' }}>💾 ระบบ Draft (เซฟงานในเครื่อง)</span>
                  
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input type="text" className="glass-input" style={{ padding: '6px 10px', fontSize: '0.9rem' }} placeholder="ตั้งชื่อดราฟต์ใหม่..." value={draftName} onChange={e => setDraftName(e.target.value)} />
                    <button className="tool-btn" onClick={handleSaveDraft} style={{ minWidth: '70px', padding: '0 12px' }}>บันทึก</button>
                  </div>

                  {drafts.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <select 
                        className="glass-input tb-select" 
                        style={{ flex: 1, minWidth: '150px', height: '32px', padding: '0 10px', fontSize: '0.9rem' }} 
                        value={selectedDraftIndex} 
                        onChange={e => setSelectedDraftIndex(Number(e.target.value))}
                      >
                        <option value={-1}>-- เลือกดราฟต์ที่เซฟไว้ --</option>
                        {drafts.map((d, i) => <option key={i} value={i}>📁 {d.name}</option>)}
                      </select>
                      
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="tool-btn" onClick={handleLoadDraft} disabled={selectedDraftIndex === -1} style={{ height: '32px', padding: '0 12px' }}>โหลด</button>
                        <button className="tool-btn" onClick={handleUpdateDraft} disabled={selectedDraftIndex === -1} style={{ height: '32px', padding: '0 12px', background: '#dcfce7', borderColor: '#86efac', color: '#166534' }}>อัปเดต</button>
                        <button className="tool-btn" onClick={handleDeleteDraft} disabled={selectedDraftIndex === -1} style={{ height: '32px', padding: '0 12px', color: 'var(--danger)', borderColor: 'var(--danger-border)' }}>ลบ</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {editMode === 'original' && code.variations && code.variations.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>🎨 เลือกพรีเซ็ตตั้งต้น:</div>
                  <div className="variations-list">
                    {code.variations.map((v: any, index: number) => (
                      <button key={v.id || index} className={`var-btn ${activeVariation === index ? 'active' : ''}`} onClick={() => setActiveVariation(index)}>
                        <div className="color-dot" style={{ backgroundColor: v.color || '#ccc' }}></div>{v.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {editMode === 'customize' && (
                <div className="customizer-box">
                  <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.1rem' }}>✨ ปรับแต่งฟิลด์หลัก</h3>
                  
                  {code.customFields && code.customFields.map((field: any) => 
                    renderFieldUI(
                      field, 
                      fieldValues[field.variableName], 
                      (newVal) => setFieldValues({ ...fieldValues, [field.variableName]: newVal }), 
                      field.variableName
                    )
                  )}

                  {(code.blocks?.length > 0 || activeBlocks.length > 0) && (
                    <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px dashed var(--color-accent-light)' }}>
                      <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-primary)', fontSize: '1.1rem' }}>🧱 เพิ่มส่วนเสริม (Blocks)</h3>
                      
                      {activeBlocks.map((block, index) => {
                        const blockDef = code.blocks?.find((b: any) => b.id === block.blockId);
                        return (
                          <div key={block.instanceId} className="block-card">
                            <div className="block-header">
                              <div className="block-title">
                                <span style={{ background: 'var(--color-accent-light)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>#{index + 1}</span>
                                {blockDef?.name || "ส่วนเสริม"}
                              </div>
                              <div className="block-actions">
                                <button className="tool-btn" onClick={() => moveBlock(index, 'up')} disabled={index === 0} title="เลื่อนขึ้น">⬆️</button>
                                <button className="tool-btn" onClick={() => moveBlock(index, 'down')} disabled={index === activeBlocks.length - 1} title="เลื่อนลง">⬇️</button>
                                <button className="tool-btn" onClick={() => removeBlock(block.instanceId)} style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }} title="ลบส่วนนี้">🗑️</button>
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {block.fields && Array.isArray(block.fields) && block.fields.map((field: any) => 
                                renderFieldUI(
                                  field, 
                                  block.values[field.variableName], 
                                  (newVal) => updateBlockValue(block.instanceId, field.variableName, newVal), 
                                  `${block.instanceId}_${field.variableName}`
                                )
                              )}
                            </div>
                          </div>
                        )
                      })}

                      {code.blocks && code.blocks.length > 0 && (
                        <div className="add-block-row">
                          {code.blocks.map((blockDef: any) => (
                            <button key={blockDef.id} className="btn-add-block" onClick={() => addBlock(blockDef)}>
                              <span>➕ เพิ่ม {blockDef.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>

            <div className="glass-panel right-panel">
              <div className="controls-row-right">
                <div className="view-toggles">
                  <button className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`} onClick={() => setViewMode('preview')}>✨ Live Preview</button>
                  <button className={`toggle-btn ${viewMode === 'code' ? 'active' : ''}`} onClick={() => setViewMode('code')}>💻 HTML Code</button>
                </div>
              </div>

              <div className="display-area">
                <button className="btn-copy" onClick={handleCopy}>{copied ? "✅ Copied!" : "📋 Copy HTML"}</button>
                {viewMode === 'preview' ? (
                  <div className="preview-container custom-scrollbar">
                    <div className="preview-inner" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                  </div>
                ) : (
                  <pre className="code-container custom-scrollbar"><code>{codeHtml}</code></pre>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}