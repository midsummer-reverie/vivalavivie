"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type CodeType = {
  id: string;
  name: string;
  codeType: string;
  activityTags?: string[];
  eventTags?: string[];
  previewUrl?: string;
  htmlCode?: string;
  customFields?: any[];
  blocks?: any[];
  isLocked: boolean;
  isCommission?: boolean; 
  likes?: number; 
};

type CloudDraftPreview = {
  id: string;
  code_id: string;
  name: string;
  values_json: Record<string, any> | string;
  blocks_json: any[] | string;
  created_at: string;
};

const parseJsonField = <T,>(value: T | string | null | undefined, fallback: T): T => {
  if (typeof value !== 'string') return (value ?? fallback) as T;
  try { return JSON.parse(value) as T; } catch { return fallback; }
};

const replaceTemplateValue = (html: string, key: string, value: unknown) =>
  key ? html.split(key).join(String(value ?? '')) : html;

function renderDraftTemplate(code: CodeType, draft: CloudDraftPreview) {
  let html = code.htmlCode || '';
  const values = parseJsonField<Record<string, any>>(draft.values_json, {});
  const parsedBlocks = parseJsonField<any[]>(draft.blocks_json, []);
  const blocks = Array.isArray(parsedBlocks) ? parsedBlocks : [];
  const applyFields = (source: string, fields: any[], fieldValues: Record<string, any>, fallbackValues: Record<string, any> = {}) => {
    let result = source;
    const sortedFields = (Array.isArray(fields) ? fields : [])
      .filter(field => typeof field?.variableName === 'string')
      .sort((a, b) => b.variableName.length - a.variableName.length);

    for (const field of sortedFields) {
      const key = field.variableName;
      const rawValue = fieldValues?.[key];
      const parentValue = fieldValues?.[field.conditionVar] === undefined
        ? fallbackValues?.[field.conditionVar] ?? ''
        : fieldValues?.[field.conditionVar];
      const isVisible = !field.conditionVar || parentValue === field.conditionVal;
      if (field.type === 'image' || field.type === 'image_url') {
        const image = rawValue && typeof rawValue === 'object' ? rawValue : {};
        const url = typeof rawValue === 'string' ? rawValue : typeof image.url === 'string' ? image.url : '';
        const cssUrl = url ? `url('${url.trim().replace(/'/g, '%27').replace(/\\/g, '%5C')}')` : '';
        const position = image.posMode === 'keyword'
          ? `${image.kx || 'center'} ${image.ky || 'center'}`
          : image.posMode === 'px' ? `${image.x ?? 50}px ${image.y ?? 50}px` : `${image.x ?? 50}% ${image.y ?? 50}%`;
        const size = image.sizeMode === 'percent_both'
          ? `${image.zoom ?? 100}% ${image.zoomH ?? image.zoom ?? 100}%`
          : ['cover', 'contain', 'auto'].includes(image.sizeMode) ? image.sizeMode : image.sizeMode === 'px' ? `${image.zoom ?? 100}px` : `${image.zoom ?? 100}%`;
        const backgroundCss = isVisible && url ? `${cssUrl} ${position} / ${size}${image.repeat ? ` ${image.repeat}` : ''}` : '';
        result = replaceTemplateValue(result, `${key}_CSS`, backgroundCss);
        result = replaceTemplateValue(result, `${key}_URL`, isVisible ? url : '');
        result = replaceTemplateValue(result, `${key}_POS`, isVisible && url ? position : '');
        result = replaceTemplateValue(result, `${key}_X`, isVisible && url ? image.posMode === 'keyword' ? image.kx : image.x ?? 50 : '');
        result = replaceTemplateValue(result, `${key}_Y`, isVisible && url ? image.posMode === 'keyword' ? image.ky : image.y ?? 50 : '');
        result = replaceTemplateValue(result, `${key}_ZOOM`, isVisible && url ? image.zoom ?? 100 : '');
        result = replaceTemplateValue(result, `${key}_SIZE`, isVisible && url ? size : '');
        result = replaceTemplateValue(result, `${key}_REPEAT`, isVisible && url ? image.repeat || 'no-repeat' : '');
        result = replaceTemplateValue(result, key, isVisible ? url : '');
        continue;
      }
      let value = rawValue && typeof rawValue === 'object'
        ? (typeof rawValue.url === 'string' ? rawValue.url : '')
        : rawValue === undefined || rawValue === null || rawValue === '' ? key : String(rawValue);
      if (!isVisible) value = '';
      if ((field.type === 'richtext' || field.type === 'roleplay') && typeof value === 'string') {
        value = value
          .replace(/\[b\]([\s\S]*?)\[\/b\]/gi, '<strong>$1</strong>')
          .replace(/\[i\]([\s\S]*?)\[\/i\]/gi, '<em>$1</em>')
          .replace(/\[u\]([\s\S]*?)\[\/u\]/gi, '<u>$1</u>')
          .replace(/\[color=(.*?)\]([\s\S]*?)\[\/color\]/gi, '<span style="color:$1">$2</span>')
          .replace(/\n/g, '<br/>');
      }
      result = replaceTemplateValue(result, key, value);
    }
    return result;
  };

  html = applyFields(html, parseJsonField<any[]>(code.customFields, []), values, values);
  const renderedBlocks = new Map<string, string[]>();
  for (const block of blocks) {
    if (!block?.placeholder || typeof block.htmlTemplate !== 'string') continue;
    const blockHtml = applyFields(block.htmlTemplate, block.fields, block.values || {}, values);
    renderedBlocks.set(block.placeholder, [...(renderedBlocks.get(block.placeholder) || []), blockHtml]);
  }
  for (const [placeholder, parts] of renderedBlocks) {
    html = replaceTemplateValue(html, placeholder, parts.join('\n'));
  }
  const templateBlocks = parseJsonField<any[]>(code.blocks, []);
  for (const block of Array.isArray(templateBlocks) ? templateBlocks : []) {
    if (block?.placeholder && !renderedBlocks.has(block.placeholder)) {
      html = replaceTemplateValue(html, block.placeholder, '');
    }
  }

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=900, initial-scale=1"><style>html,body{margin:0;min-height:100%;background:#131313}body{width:900px;overflow:hidden}#draft-preview{width:900px;min-height:540px;padding:12px;box-sizing:border-box;background:#131313}#draft-preview img,#draft-preview video{max-width:100%;height:auto}</style></head><body><div id="draft-preview">${html}</div></body></html>`;
}

type FilterState = {
  sort: "Newest" | "Popular";
  liked: "All" | "LikedOnly";
  visibility: "Default" | "PublicOnly" | "CommissionOnly" | "PrivateOnly";
  type: string;
  event: string;
  activity: string;
};

const DEFAULT_FILTERS: FilterState = {
  sort: "Newest",
  liked: "All",
  visibility: "Default",
  type: "All",
  event: "All",
  activity: "All"
};

export default function CodesShowcase() {
  const [codes, setCodes] = useState<CodeType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 🌟 State สำหรับระบบตัวกรองขั้นสูง
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  const [likedCodes, setLikedCodes] = useState<string[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [personalKeyConnected, setPersonalKeyConnected] = useState(false);
  const [personalKeyInput, setPersonalKeyInput] = useState("");
  const [personalKeyAction, setPersonalKeyAction] = useState<'register' | 'connect'>('connect');
  const [personalKeyBusy, setPersonalKeyBusy] = useState(false);
  const [personalKeyMessage, setPersonalKeyMessage] = useState("");
  const [personalKeyMessageIsError, setPersonalKeyMessageIsError] = useState(false);
  const [showChangeKeyForm, setShowChangeKeyForm] = useState(false);
  const [newPersonalKey, setNewPersonalKey] = useState("");
  const [confirmPersonalKey, setConfirmPersonalKey] = useState("");
  const [cloudDrafts, setCloudDrafts] = useState<CloudDraftPreview[]>([]);
  const [cloudDraftSearch, setCloudDraftSearch] = useState("");
  const [cloudDraftsLoading, setCloudDraftsLoading] = useState(false);
  const [cloudDraftsError, setCloudDraftsError] = useState("");
  const [showCloudDrafts, setShowCloudDrafts] = useState(false);
  const router = useRouter();

  const refreshCloudDrafts = useCallback(async () => {
    setCloudDraftsLoading(true);
    setCloudDraftsError("");
    try {
      const response = await fetch('/api/drafts?includeContent=1', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'โหลด Cloud Drafts ไม่สำเร็จ');
      setCloudDrafts(Array.isArray(data.drafts) ? data.drafts : []);
    } catch (error) {
      setCloudDraftsError(error instanceof Error ? error.message : 'โหลด Cloud Drafts ไม่สำเร็จ');
    } finally {
      setCloudDraftsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const res = await fetch('/api/codes');
        if (res.ok) {
          const rows = await res.json();
          setCodes((Array.isArray(rows) ? rows : []).map((code: CodeType) => ({
            ...code,
            customFields: parseJsonField<any[]>(code.customFields, []),
            blocks: parseJsonField<any[]>(code.blocks, []),
          })));
        }
      } catch (error) { console.error("Error fetching data:", error); }
    };
    fetchCodes();

    fetch('/api/personal-key')
      .then(async response => response.ok ? response.json() : null)
      .then(data => {
        const connected = Boolean(data?.connected);
        setPersonalKeyConnected(connected);
        if (connected) void refreshCloudDrafts();
      })
      .catch(error => console.error('Personal Key session check failed:', error));
    
    const savedLikes = localStorage.getItem('user_liked_codes');
    if (savedLikes) setLikedCodes(JSON.parse(savedLikes));
  }, [refreshCloudDrafts]);

  // ดึงตัวเลือกสำหรับ Dropdown
  const nonPrivateCodes = codes.filter(c => !c.isLocked || c.isCommission);
  const uniqueTypes = Array.from(new Set(nonPrivateCodes.map(c => c.codeType))).sort();
  const uniqueActivities = Array.from(new Set(nonPrivateCodes.flatMap(c => c.activityTags || []))).sort();
  const uniqueEvents = Array.from(new Set(nonPrivateCodes.flatMap(c => c.eventTags || []))).sort(); 

  // นับว่ามีการเปิดใช้งานตัวกรองกี่อัน (เพื่อโชว์จุดแจ้งเตือนบนปุ่ม)
  const activeFiltersCount = Object.keys(filters).filter(k => {
    const key = k as keyof FilterState;
    return filters[key] !== DEFAULT_FILTERS[key];
  }).length;

  // 🌟 ตรรกะการกรองข้อมูลแบบละเอียด
  let filteredCodes = codes.filter((code) => {
    const isPrivate = code.isLocked && !code.isCommission;
    const isCommission = code.isLocked && code.isCommission;
    const isPublic = !code.isLocked;

    // 1. กรองจากคำค้นหา (Search)
    if (searchTerm && !code.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;

    // 2. กรองจากสถานะโค้ด (Visibility)
    if (filters.visibility === "PublicOnly" && !isPublic) return false;
    if (filters.visibility === "CommissionOnly" && !isCommission) return false;
    if (filters.visibility === "PrivateOnly" && !isPrivate) return false;
    if (filters.visibility === "Default" && isPrivate) {
      // ถ้าเป็นโหมด Default (ปกติ): โค้ดส่วนตัวจะโชว์ก็ต่อเมื่อ "ไม่ได้พิมพ์ค้นหา หรือเลือกตัวกรองใดๆ เลย"
      if (searchTerm !== "" || filters.type !== "All" || filters.event !== "All" || filters.activity !== "All" || filters.liked === "LikedOnly") {
        return false;
      }
    }

    // 3. กรองจากประเภทและแท็ก
    if (filters.type !== "All" && code.codeType !== filters.type) return false;
    if (filters.activity !== "All" && !(code.activityTags && code.activityTags.includes(filters.activity))) return false;
    if (filters.event !== "All" && !(code.eventTags && code.eventTags.includes(filters.event))) return false;

    // 4. กรองจากรายการที่ถูกใจ
    if (filters.liked === "LikedOnly" && !likedCodes.includes(code.id)) return false;

    return true;
  });

  // 🌟 การเรียงลำดับ
  if (filters.sort === "Popular") {
    filteredCodes.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else {
    // Newest คือลำดับเดิมที่ fetch มา (สมมติว่า backend เรียงมาให้แล้ว)
  }

  const normalizedDraftSearch = cloudDraftSearch.trim().toLocaleLowerCase();
  const visibleCloudDrafts = cloudDrafts.filter(draft => {
    const code = codes.find(item => item.id === draft.code_id);
    const codeName = code?.name || draft.code_id;
    return !normalizedDraftSearch || `${draft.name} ${codeName} ${draft.code_id}`.toLocaleLowerCase().includes(normalizedDraftSearch);
  });

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "712069") {
      setShowAuthModal(false); setPassword(""); setAuthError(false);
      router.push('/codes/manage'); 
    } else { setAuthError(true); }
  };

  const handlePersonalKeySubmit = async () => {
    setPersonalKeyBusy(true);
    setPersonalKeyMessage("");
    setPersonalKeyMessageIsError(false);
    try {
      const response = await fetch('/api/personal-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: personalKeyAction, key: personalKeyInput }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'ดำเนินการ Personal Key ไม่สำเร็จ');
      setPersonalKeyConnected(true);
      setPersonalKeyInput("");
      setPersonalKeyMessage(personalKeyAction === 'register' ? 'สร้างและเชื่อมต่อ Personal Key แล้ว' : 'เชื่อมต่อ Personal Key แล้ว');
      await refreshCloudDrafts();
    } catch (error) {
      setPersonalKeyMessage(error instanceof Error ? error.message : 'ดำเนินการ Personal Key ไม่สำเร็จ');
      setPersonalKeyMessageIsError(true);
    } finally {
      setPersonalKeyBusy(false);
    }
  };

  const handlePersonalKeyDisconnect = async () => {
    setPersonalKeyBusy(true);
    setPersonalKeyMessage("");
    setPersonalKeyMessageIsError(false);
    try {
      const response = await fetch('/api/personal-key', { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'ยกเลิกการเชื่อมต่อไม่สำเร็จ');
      setPersonalKeyConnected(false);
      setCloudDrafts([]);
      setShowChangeKeyForm(false);
      setPersonalKeyMessage('ยกเลิกการเชื่อมต่อแล้ว');
    } catch (error) {
      setPersonalKeyMessage(error instanceof Error ? error.message : 'ยกเลิกการเชื่อมต่อไม่สำเร็จ');
      setPersonalKeyMessageIsError(true);
    } finally {
      setPersonalKeyBusy(false);
    }
  };

  const handlePersonalKeyChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPersonalKey.trim() !== confirmPersonalKey.trim()) {
      setPersonalKeyMessage('Key ใหม่ที่กรอกทั้งสองช่องไม่ตรงกัน');
      setPersonalKeyMessageIsError(true);
      return;
    }

    setPersonalKeyBusy(true);
    setPersonalKeyMessage("");
    setPersonalKeyMessageIsError(false);
    try {
      const response = await fetch('/api/personal-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change', newKey: newPersonalKey.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'เปลี่ยน Personal Key ไม่สำเร็จ');

      setPersonalKeyConnected(true);
      setShowChangeKeyForm(false);
      setNewPersonalKey('');
      setConfirmPersonalKey('');
      setPersonalKeyMessage('เปลี่ยน Key แล้ว อุปกรณ์อื่นต้องเชื่อมต่อด้วย Key ใหม่');
    } catch (error) {
      setPersonalKeyMessage(error instanceof Error ? error.message : 'เปลี่ยน Personal Key ไม่สำเร็จ');
      setPersonalKeyMessageIsError(true);
    } finally {
      setPersonalKeyBusy(false);
    }
  };

  const handleLike = async (e: React.MouseEvent, codeId: string) => {
    e.preventDefault(); 
    e.stopPropagation();

    // เช็กว่าตอนนี้เคยกดไลก์ไว้หรือยัง
    const isLiked = likedCodes.includes(codeId);
    const action = isLiked ? 'unlike' : 'like';

    // 1. อัปเดต LocalStorage ว่าไลก์หรือถอนไลก์
    let newLikedCodes;
    if (isLiked) {
      newLikedCodes = likedCodes.filter(id => id !== codeId); // ถอนไลก์ (เอา id ออก)
    } else {
      newLikedCodes = [...likedCodes, codeId]; // กดไลก์ (เพิ่ม id เข้าไป)
    }
    setLikedCodes(newLikedCodes);
    localStorage.setItem('user_liked_codes', JSON.stringify(newLikedCodes));

    // 2. อัปเดต UI ตัวเลขโชว์ให้ผู้ใช้เห็นทันที (Optimistic UI)
    setCodes(prev => prev.map(c => {
      if (c.id === codeId) {
        const currentLikes = c.likes || 0;
        // ถ้าถอนไลก์ให้ลบ 1 (โดยไม่ต่ำกว่า 0) ถ้ากดไลก์ให้บวก 1
        return { ...c, likes: isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1 };
      }
      return c;
    }));

    // 3. ยิงไปบอก API ว่าให้ +1 หรือ -1
    try {
      await fetch(`/api/codes/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: codeId, action }) // ส่ง action ไปบอก Backend ด้วย
      });
    } catch (err) {
      console.error("Failed to update like in DB", err);
    }
  };

  return (
    <div 
      className="code-page-wrapper"
      style={{
        '--glass-bg': 'rgba(255, 255, 255, 0.35)',
        '--glass-border': 'rgba(255, 255, 255, 0.5)',
        '--text-dark': '#2e1065',
        '--theme-primary': '#d8b4fe',
        '--theme-secondary': '#bae6fd',
        '--radius-lg': '20px',
        '--radius-md': '12px',
      } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;600;700&display=swap');

        .code-page-wrapper { min-height: 100vh; margin: 0; padding: 4vw; font-family: 'Google Sans', sans-serif; color: var(--text-dark); background: radial-gradient(circle at 15% 20%, #e9d5ff 0%, transparent 50%), radial-gradient(circle at 85% 80%, #bae6fd 0%, transparent 50%), linear-gradient(135deg, #f3e8ff 0%, #e0f2fe 100%); background-attachment: fixed; overflow-x: hidden; }
        .code-page-wrapper * { box-sizing: border-box; }
        input, select, textarea, button { font-family: 'Google Sans', sans-serif !important; }

        .page-transition { animation: pageFadeIn 0.8s ease-out forwards; opacity: 0; max-width: 1200px; margin: 0 auto; }
        @keyframes pageFadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

        .header-section { position: relative; text-align: center; margin-bottom: 40px; padding-top: 20px; }
        .main-title { font-size: 2.5rem; font-weight: 700; margin: 0; letter-spacing: -0.02em; position: relative; z-index: 10; }
        .ios-highlight { background-color: var(--theme-primary); color: #2e1065; padding: 0 6px; display: inline-block; line-height: 1.1; border-radius: 4px; }
        
        .img-float { position: absolute; background-size: contain; background-repeat: no-repeat; background-position: center; pointer-events: none; z-index: 1; }
        .img-1 { width: 50px; height: 50px; top: -20px; left: 22%; background-image: url('https://iili.io/COFNW1p.md.png'); animation: floatFade 5s ease-in-out infinite; }
        .img-2 { width: 60px; height: 60px; bottom: -30px; left: 28%; background-image: url('https://iili.io/COFNj2I.md.png'); animation: floatFade 6s ease-in-out infinite 1s; }
        .img-3 { width: 45px; height: 45px; top: -10px; right: 22%; background-image: url('https://iili.io/COFNw7t.md.png'); animation: floatFade 4.5s ease-in-out infinite 0.5s; }
        .img-4 { width: 40px; height: 40px; bottom: -15px; right: 26%; background-image: url('https://iili.io/COFNXrN.md.png'); animation: floatFade 7s ease-in-out infinite; }

        @keyframes floatFade { 0% { transform: translateY(0) rotate(0deg); opacity: 0.85; filter: drop-shadow(0 0 0px rgba(216, 180, 254, 0)); } 50% { transform: translateY(-12px) rotate(6deg); opacity: 1; filter: drop-shadow(0 0 10px rgba(216, 180, 254, 0.7)); } 100% { transform: translateY(0) rotate(0deg); opacity: 0.85; filter: drop-shadow(0 0 0px rgba(216, 180, 254, 0)); } }
        @media (max-width: 768px) { .main-title { font-size: 2rem; } .img-1 { left: 5%; } .img-2 { left: 15%; } .img-3 { right: 5%; } .img-4 { right: 12%; } }

        /* 🌟 Toolbar ฉบับคลีน */
        .toolbar { display: flex; gap: 12px; margin-bottom: 30px; background: rgba(255,255,255,0.4); padding: 12px; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); backdrop-filter: blur(12px); box-shadow: 0 4px 16px rgba(139, 92, 246, 0.05); align-items: center; }
        .personal-key-panel { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin: -18px 0 18px; padding: 10px 14px; border: 1px solid rgba(216, 180, 254, 0.75); border-radius: 14px; background: rgba(255,255,255,0.55); box-shadow: 0 4px 14px rgba(139, 92, 246, 0.05); }
        .personal-key-controls { display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 6px; }
        .personal-key-action { border: 1px solid #d8b4fe; border-radius: 9px; padding: 7px 10px; color: #5b21b6; background: rgba(255,255,255,0.75); font-weight: 700; cursor: pointer; }
        .personal-key-action.selected { color: white; background: #7c3aed; border-color: #7c3aed; box-shadow: 0 0 0 2px rgba(124,58,237,0.18); }
        .personal-key-input { width: 210px; max-width: 42vw; border: 1px solid #d8b4fe; border-radius: 9px; padding: 7px 9px; background: rgba(255,255,255,0.85); color: #2e1065; }
        .personal-key-submit { border: 1px solid #7c3aed; border-radius: 9px; padding: 7px 11px; background: #7c3aed; color: white; font-weight: 700; cursor: pointer; }
        .personal-key-submit:disabled, .personal-key-action:disabled { opacity: 0.55; cursor: not-allowed; }
        .personal-key-connected { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
        .personal-key-change-form { display: grid; grid-template-columns: repeat(2, minmax(140px, 1fr)); gap: 8px; width: min(100%, 520px); padding: 10px; border: 1px solid #d8b4fe; border-radius: 12px; background: rgba(255,255,255,0.75); }
        .personal-key-change-form label { display: flex; flex-direction: column; gap: 4px; color: #5b21b6; font-size: .75rem; font-weight: 700; }
        .personal-key-change-form input { width: 100%; min-width: 0; border: 1px solid #d8b4fe; border-radius: 8px; padding: 7px 8px; background: white; color: #2e1065; }
        .personal-key-change-note, .personal-key-change-actions { grid-column: 1 / -1; }
        .personal-key-change-note { margin: 0; color: #6b21a8; font-size: .75rem; }
        .personal-key-change-actions { display: flex; justify-content: flex-end; gap: 7px; }
        .personal-key-cancel { border: 1px solid #d1d5db; border-radius: 9px; padding: 7px 10px; color: #4b5563; background: white; font-weight: 700; cursor: pointer; }
        .cloud-drafts-overlay { position: fixed; inset: 0; z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(24, 16, 36, 0.64); backdrop-filter: blur(5px); }
        .cloud-drafts-panel { width: min(100%, 1000px); max-height: 88vh; overflow: auto; margin: 0; padding: 14px; border: 1px solid rgba(216, 180, 254, 0.75); border-radius: 18px; background: #faf7ff; box-shadow: 0 18px 50px rgba(0, 0, 0, 0.3); }
        .cloud-drafts-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
        .cloud-drafts-search { width: min(100%, 340px); border: 1px solid #d8b4fe; border-radius: 10px; padding: 8px 11px; color: #2e1065; background: rgba(255,255,255,0.85); outline: none; }
        .cloud-drafts-search:focus { border-color: #a855f7; box-shadow: 0 0 0 3px rgba(216,180,254,0.25); }
        .cloud-drafts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 12px; }
        .cloud-draft-card { overflow: hidden; color: inherit; text-decoration: none; border: 1px solid rgba(216,180,254,0.75); border-radius: 13px; background: rgba(255,255,255,0.78); transition: transform .18s, box-shadow .18s; }
        .cloud-draft-card:hover { transform: translateY(-2px); box-shadow: 0 7px 16px rgba(91,33,182,0.12); }
        .cloud-draft-preview { height: 108px; position: relative; overflow: hidden; background: #131313; border-bottom: 1px solid rgba(216,180,254,0.55); pointer-events: none; }
        .cloud-draft-preview iframe { position: absolute; top: 0; left: calc(50% - 81px); width: 900px; height: 600px; border: 0; transform: scale(.18); transform-origin: top left; background: #131313; }
        .cloud-draft-info { padding: 8px 10px 9px; }
        .cloud-draft-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0 0 3px; font-size: .88rem; font-weight: 700; color: #4c1d95; }
        .cloud-draft-code { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0; font-size: .74rem; color: #6b7280; }
        .search-wrapper { flex: 1; position: relative; }
        .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 1.2rem; opacity: 0.5; }
        .glass-input-search { width: 100%; background: rgba(255,255,255,0.6); border: 1px solid var(--glass-border); border-radius: 14px; padding: 12px 14px 12px 42px; font-size: 1rem; outline: none; transition: 0.2s; color: var(--text-dark); }
        .glass-input-search:focus { border-color: var(--theme-primary); background: rgba(255,255,255,0.9); box-shadow: 0 0 0 3px rgba(216, 180, 254, 0.3); }

        .filter-btn { position: relative; background: #fff; border: 1px solid var(--theme-primary); border-radius: 14px; padding: 12px 20px; font-weight: 700; color: #4c1d95; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 8px; font-size: 1rem; }
        .filter-btn:hover { background: #f3e8ff; box-shadow: 0 4px 12px rgba(216, 180, 254, 0.4); transform: translateY(-2px); }
        .filter-badge { position: absolute; top: -6px; right: -6px; background: #ef4444; color: white; font-size: 0.75rem; font-weight: bold; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        
        .manage-btn { background: linear-gradient(135deg, #e9d5ff, #bae6fd); border: 1px solid rgba(255,255,255,0.8); border-radius: 14px; padding: 12px; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 12px rgba(216, 180, 254, 0.3); font-size: 1.2rem; display: flex; align-items: center; justify-content: center; }
        .manage-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(216, 180, 254, 0.5); filter: brightness(1.05); }

        @media (max-width: 600px) {
          .cloud-drafts-overlay { padding: 10px; }
          .personal-key-panel { align-items: flex-start; flex-direction: column; margin-top: -18px; }
          .personal-key-controls { justify-content: flex-start; width: 100%; }
          .personal-key-connected { align-items: stretch; width: 100%; }
          .personal-key-change-form { grid-template-columns: 1fr; width: 100%; }
          .personal-key-change-note, .personal-key-change-actions { grid-column: auto; }
          .personal-key-change-actions > button { flex: 1; }
          .personal-key-input { flex: 1; min-width: 150px; max-width: none; }
          .cloud-drafts-header { align-items: stretch; flex-direction: column; }
          .cloud-drafts-search { width: 100%; }
          .cloud-drafts-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
          .toolbar { flex-wrap: wrap; }
          .search-wrapper { min-width: 100%; }
          .filter-btn { flex: 1; justify-content: center; }
          .manage-btn { flex: 0 0 auto; }
        }

        /* 🌟 ระบบตัวกรองแบบ Modal (AO3 Style) */
        .filter-modal-overlay { position: fixed; inset: 0; background: rgba(46, 16, 101, 0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 200; animation: fadeIn 0.2s; padding: 20px; }
        .filter-modal-content { background: #faf5ff; width: 100%; max-width: 500px; max-height: 90vh; border-radius: 24px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 24px 48px rgba(46, 16, 101, 0.2); border: 1px solid rgba(216, 180, 254, 0.8); }
        .filter-modal-header { padding: 20px 24px; border-bottom: 1px solid rgba(216, 180, 254, 0.5); display: flex; justify-content: space-between; align-items: center; background: #fff; }
        .filter-modal-title { font-size: 1.25rem; font-weight: 700; color: #4c1d95; margin: 0; display: flex; align-items: center; gap: 8px; }
        .filter-close-btn { background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: #9ca3af; transition: 0.2s; }
        .filter-close-btn:hover { color: #ef4444; }
        
        .filter-modal-body { padding: 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 20px; }
        .filter-group { display: flex; flex-direction: column; gap: 8px; }
        .filter-label { font-size: 0.9rem; font-weight: 700; color: #6b21a8; }
        .filter-select { background: #fff; border: 1px solid #d8b4fe; border-radius: 10px; padding: 10px 14px; font-size: 0.95rem; color: #2e1065; outline: none; cursor: pointer; transition: 0.2s; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); }
        .filter-select:focus { border-color: #a855f7; box-shadow: 0 0 0 3px rgba(216, 180, 254, 0.3); }

        .filter-modal-footer { padding: 16px 24px; background: #fff; border-top: 1px solid rgba(216, 180, 254, 0.5); display: flex; gap: 12px; }
        .btn-reset { flex: 1; background: #f3f4f6; border: 1px solid #d1d5db; color: #4b5563; padding: 12px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .btn-reset:hover { background: #e5e7eb; }
        .btn-apply { flex: 2; background: #a855f7; border: none; color: #fff; padding: 12px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3); }
        .btn-apply:hover { background: #9333ea; box-shadow: 0 6px 16px rgba(168, 85, 247, 0.4); }

        /* การ์ดและอื่นๆ */
        .code-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; padding-bottom: 40px; }
        @keyframes cardEnter { 0% { opacity: 0; transform: translateY(25px); } 100% { opacity: 1; transform: translateY(0); } }

        .code-card { border-radius: var(--radius-md); border: 1px solid var(--glass-border); box-shadow: 0 4px 20px rgba(139, 92, 246, 0.08); overflow: hidden; transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1); display: flex; flex-direction: column; cursor: pointer; text-decoration: none; background: rgba(255,255,255,0.5); backdrop-filter: blur(8px); opacity: 0; animation: cardEnter 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; position: relative; }
        .code-card:hover { transform: translateY(-6px); box-shadow: 0 16px 32px rgba(139, 92, 246, 0.15); background: rgba(255,255,255,0.7); }

        .card-preview { width: 100%; aspect-ratio: 4/3; background: #e2e8f0; position: relative; overflow: hidden; }
        .card-preview img { width: 100%; height: 100%; object-fit: cover; transition: 0.4s; }
        .code-card:hover .card-preview img { transform: scale(1.05); }
        .is-private .card-preview img { filter: blur(12px) brightness(0.7); transform: scale(1.1); }
        .is-private:hover .card-preview img { transform: scale(1.1); }
        .lock-icon-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: rgba(255,255,255,0.9); text-shadow: 0 4px 12px rgba(0,0,0,0.5); z-index: 2; }

        .like-btn { position: absolute; top: 12px; right: 12px; z-index: 3; background: rgba(255,255,255,0.85); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.5); border-radius: 20px; padding: 6px 12px; font-weight: 700; font-size: 0.85rem; color: #4c1d95; display: flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.05); transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .like-btn:hover { background: #fff; transform: scale(1.05); }
        .like-btn.liked { color: #e11d48; }
        .like-btn.liked .heart-icon { animation: heartPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes heartPop { 0% { transform: scale(1); } 50% { transform: scale(1.4); } 100% { transform: scale(1); } }

        .card-info { padding: 16px; flex: 1; display: flex; flex-direction: column; }
        .code-name { font-size: 1.2rem; font-weight: 700; margin: 0 0 10px 0; color: var(--text-dark); line-height: 1.3; }
        .censored-name { color: #6b21a8; font-family: monospace; letter-spacing: 2px; }
        .tags-container { display: flex; flex-wrap: wrap; gap: 6px; align-items: flex-start; }
        .tag-type { background: rgba(216, 180, 254, 0.5); color: #4c1d95; font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 12px; }
        .tag-activity { background: rgba(255, 255, 255, 0.6); color: #4c1d95; font-size: 0.7rem; font-weight: 600; padding: 4px 10px; border-radius: 12px; border: 1px solid rgba(216, 180, 254, 0.4); }
        .tag-event { background: #f59e0b; color: #fff; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 12px; box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3); } 
        .tag-commission { background: #fef08a; color: #854d0e; font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 12px; }

        .back-btn { display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; text-decoration: none; color: var(--text-dark); font-weight: 600; font-size: 0.95rem; background: var(--glass-bg); border: 1px solid var(--glass-border); padding: 8px 16px; border-radius: var(--radius-md); backdrop-filter: blur(8px); transition: 0.2s; }
        .back-btn:hover { background: rgba(255,255,255,0.8); transform: translateX(-4px); }
        .empty-state { text-align: center; padding: 40px; color: #6b21a8; font-weight: 500; grid-column: 1 / -1; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(46, 16, 101, 0.3); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 100; animation: fadeIn 0.3s; padding: 20px; }
        .modal-content { background: rgba(255, 255, 255, 0.85); padding: 32px; border-radius: var(--radius-lg); width: 100%; max-width: 400px; text-align: center; border: 1px solid var(--glass-border); box-shadow: 0 20px 40px rgba(46, 16, 101, 0.2); }
        .modal-title { margin: 0 0 16px; font-weight: 700; font-size: 1.5rem; color: var(--text-dark); }
        .modal-input { width: 100%; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--theme-primary); margin-bottom: 16px; text-align: center; font-size: 1rem; outline: none; background: rgba(255,255,255,0.9); }
        .modal-input:focus { box-shadow: 0 0 0 3px rgba(216, 180, 254, 0.4); }
        .btn-cancel { background: rgba(255,255,255,0.5); border: 1px solid var(--theme-primary); padding: 10px 20px; border-radius: var(--radius-md); cursor: pointer; font-weight: 600; color: var(--text-dark); }
        .error-msg { color: #e11d48; font-size: 0.85rem; margin-top: -10px; margin-bottom: 16px; font-weight: 600; }
        @keyframes fadeIn { to { opacity: 1; } }
      `}} />

      {/* 🔒 Admin Login Modal */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">🔒 Admin Login</h2>
            <p style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#6b21a8' }}>กรุณาใส่รหัสผ่านเพื่อจัดการโค้ด</p>
            <form onSubmit={handleAuthSubmit}>
              <input type="password" className="modal-input" placeholder="Enter password..." value={password} onChange={(e) => { setPassword(e.target.value); setAuthError(false); }} autoFocus />
              {authError && <div className="error-msg">❌ รหัสผ่านไม่ถูกต้อง</div>}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button type="button" className="btn-cancel" onClick={() => setShowAuthModal(false)}>Cancel</button>
                <button type="submit" className="manage-btn" style={{ padding: '10px 20px', fontSize: '1rem' }}>Unlock</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🎛️ Advanced Filter Modal (AO3 Style) */}
      {showFilterModal && (
        <div className="filter-modal-overlay" onClick={() => setShowFilterModal(false)}>
          <div className="filter-modal-content" onClick={e => e.stopPropagation()}>
            <div className="filter-modal-header">
              <h2 className="filter-modal-title">🎛️ ตัวกรองข้อมูล</h2>
              <button className="filter-close-btn" onClick={() => setShowFilterModal(false)}>✕</button>
            </div>
            
            <div className="filter-modal-body custom-scrollbar">
              
              <div className="filter-group">
                <label className="filter-label">📌 การเรียงลำดับ</label>
                <select className="filter-select" value={filters.sort} onChange={(e) => setFilters({...filters, sort: e.target.value as "Newest"|"Popular"})}>
                  <option value="Newest">✨ อัปเดตล่าสุด (Newest)</option>
                  <option value="Popular">🔥 โค้ดยอดฮิต (Most Liked)</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">💖 รายการที่ถูกใจ</label>
                <select className="filter-select" value={filters.liked} onChange={(e) => setFilters({...filters, liked: e.target.value as "All"|"LikedOnly"})}>
                  <option value="All">โชว์ทั้งหมด (All)</option>
                  <option value="LikedOnly">❤️ เฉพาะที่ฉันถูกใจ (My Likes)</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">🔒 การแสดงผล / สถานะ</label>
                <select className="filter-select" value={filters.visibility} onChange={(e) => setFilters({...filters, visibility: e.target.value as FilterState['visibility']})}>
                  <option value="Default">🌍 โชว์ตามปกติ (ซ่อนโค้ดที่ล็อกไว้เป็น Private)</option>
                  <option value="PublicOnly">🔓 เฉพาะโค้ดสาธารณะ (Public Only)</option>
                  <option value="CommissionOnly">💎 เฉพาะโค้ดใสรหัส (Personal Only)</option>
                  <option value="PrivateOnly">🔒 เฉพาะโค้ดส่วนตัว (Private Only)</option>
                </select>
              </div>

              <hr style={{ border: 'none', borderTop: '1px dashed #d8b4fe', margin: '10px 0' }} />

              <div className="filter-group">
                <label className="filter-label">🏷️ ประเภทโค้ด</label>
                <select className="filter-select" value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
                  <option value="All">ทุกประเภท (All Types)</option>
                  {uniqueTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">🌻 กิจกรรม</label>
                <select className="filter-select" value={filters.event} onChange={(e) => setFilters({...filters, event: e.target.value})}>
                  <option value="All">ทุกกิจกรรม (All Events)</option>
                  {uniqueEvents.map(evt => <option key={evt} value={evt}>{evt}</option>)}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">🏷️ แท็กทั่วไป</label>
                <select className="filter-select" value={filters.activity} onChange={(e) => setFilters({...filters, activity: e.target.value})}>
                  <option value="All">ทุกแท็ก (All Tags)</option>
                  {uniqueActivities.map(act => <option key={act} value={act}>{act}</option>)}
                </select>
              </div>
              
            </div>

            <div className="filter-modal-footer">
              <button className="btn-reset" onClick={() => setFilters(DEFAULT_FILTERS)}>ล้างตัวกรอง</button>
              <button className="btn-apply" onClick={() => setShowFilterModal(false)}>ใช้ตัวกรอง ({filteredCodes.length} รายการ)</button>
            </div>
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
            code <span className="ios-highlight">showcase</span>
          </h1>
          <p style={{ color: '#6b21a8', marginTop: '10px', position: 'relative', zIndex: 10, fontWeight: 500 }}>คลังรวบรวมผลงานโค้ด</p>
        </div>

        <section className="personal-key-panel" aria-label="Personal Key">
          <div>
            <strong style={{ color: '#4c1d95', fontSize: '0.95rem' }}>🔑 Personal Key</strong>
            <div style={{ color: personalKeyMessageIsError ? '#b91c1c' : personalKeyConnected ? '#166534' : '#6b21a8', fontSize: '0.78rem', marginTop: '2px' }}>
              {personalKeyMessage || (personalKeyConnected ? 'เชื่อมต่อแล้ว ใช้ Cloud Drafts ได้' : 'เชื่อมต่อหรือสร้าง Key เพื่อใช้ Cloud Drafts')}
            </div>
          </div>
          {personalKeyConnected ? (
            <div className="personal-key-connected">
              <div className="personal-key-controls">
                <button type="button" className="personal-key-submit" onClick={() => { setShowCloudDrafts(true); void refreshCloudDrafts(); }}>
                  ☁️ ดู Cloud Drafts ({cloudDrafts.length})
                </button>
                <button type="button" className="personal-key-action" onClick={() => { setShowChangeKeyForm(value => !value); setPersonalKeyMessage(''); setPersonalKeyMessageIsError(false); }} disabled={personalKeyBusy}>
                  เปลี่ยน Personal Key
                </button>
                <button type="button" className="personal-key-action" onClick={() => void handlePersonalKeyDisconnect()} disabled={personalKeyBusy}>
                  {personalKeyBusy ? 'กำลังทำรายการ...' : 'ยกเลิกการเชื่อมต่อ'}
                </button>
              </div>
              {showChangeKeyForm && (
                <form className="personal-key-change-form" onSubmit={handlePersonalKeyChange}>
                  <p className="personal-key-change-note">กำลังเปลี่ยน Key ของบัญชีที่เชื่อมต่ออยู่ Draft เดิมจะยังอยู่ และ Session อุปกรณ์อื่นจะถูกยกเลิก</p>
                  <label>Key ใหม่<input type="text" autoComplete="off" minLength={8} maxLength={128} value={newPersonalKey} onChange={event => setNewPersonalKey(event.target.value.toLowerCase())} /></label>
                  <label>ยืนยัน Key ใหม่<input type="text" autoComplete="off" minLength={8} maxLength={128} value={confirmPersonalKey} onChange={event => setConfirmPersonalKey(event.target.value.toLowerCase())} /></label>
                  <div className="personal-key-change-actions">
                    <button type="button" className="personal-key-cancel" onClick={() => { setShowChangeKeyForm(false); setNewPersonalKey(''); setConfirmPersonalKey(''); }}>ยกเลิก</button>
                    <button type="submit" className="personal-key-submit" disabled={personalKeyBusy || newPersonalKey.trim().length < 8 || confirmPersonalKey.trim().length < 8 || newPersonalKey.trim() !== confirmPersonalKey.trim()}>{personalKeyBusy ? 'กำลังเปลี่ยน...' : 'ยืนยันการเปลี่ยน Key'}</button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="personal-key-controls">
              <button type="button" className={`personal-key-action ${personalKeyAction === 'connect' ? 'selected' : ''}`} aria-pressed={personalKeyAction === 'connect'} onClick={() => setPersonalKeyAction('connect')} disabled={personalKeyBusy}>เชื่อม Key</button>
              <button type="button" className={`personal-key-action ${personalKeyAction === 'register' ? 'selected' : ''}`} aria-pressed={personalKeyAction === 'register'} onClick={() => setPersonalKeyAction('register')} disabled={personalKeyBusy}>สร้าง Key</button>
              <input type="text" className="personal-key-input" autoComplete="off" minLength={8} maxLength={128} placeholder="Personal Key (8+ ตัวอักษร)" value={personalKeyInput} onChange={event => setPersonalKeyInput(personalKeyAction === 'register' ? event.target.value.toLowerCase() : event.target.value)} />
              <button type="button" className="personal-key-submit" disabled={personalKeyBusy || personalKeyInput.trim().length < 8} onClick={() => void handlePersonalKeySubmit()}>
                {personalKeyBusy ? 'กำลังทำรายการ...' : 'ยืนยัน'}
              </button>
            </div>
          )}
        </section>

        {/* 🌟 Toolbar โฉมใหม่: Search Bar แถวยาวๆ + ปุ่มตัวกรอง + ปุ่ม Manage */}
        <div className="toolbar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="ค้นหาชื่อโค้ด..." 
              className="glass-input-search"
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="filter-btn" onClick={() => setShowFilterModal(true)}>
            🎛️ ตัวกรอง
            {activeFiltersCount > 0 && <span className="filter-badge">{activeFiltersCount}</span>}
          </button>
          
          <button onClick={() => setShowAuthModal(true)} className="manage-btn" title="จัดการโค้ด">⚙️</button>
        </div>

        <div className="code-grid">
          {filteredCodes.length > 0 ? (
            filteredCodes.map((code, index) => {
              const bgImageUrl = code.previewUrl || "https://iili.io/CNQcH1j.md.png";
              
              const isPrivate = code.isLocked && !code.isCommission;
              const isCommission = code.isLocked && code.isCommission;
              const isLiked = likedCodes.includes(code.id);

              return (
                <Link 
                  href={`/codes/${code.id}`}
                  className={`code-card ${isPrivate ? 'is-private' : ''}`} 
                  key={code.id}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {/* ปุ่มกดไลก์บนการ์ด (ยังอยู่) */}
                  {!isPrivate && (
                    <button 
                      className={`like-btn ${isLiked ? 'liked' : ''}`} 
                      onClick={(e) => handleLike(e, code.id)}
                    >
                      <span className="heart-icon">{isLiked ? '❤️' : '🤍'}</span> 
                      {code.likes || 0}
                    </button>
                  )}

                  <div className="card-preview">
                    {isPrivate && <div className="lock-icon-overlay">🔒</div>}
                    <img 
                      src={bgImageUrl} 
                      alt={isPrivate ? 'Private Preview' : code.name} 
                      loading="lazy" 
                      onError={(e) => { e.currentTarget.src = "https://i.pinimg.com/1200x/1d/e5/78/1de578351b09df48023a06e33341fd77.jpg"; }}
                    />
                  </div>
                  
                  <div className="card-info">
                    {isPrivate ? (
                      <h3 className="code-name censored-name">████████</h3>
                    ) : (
                      <h3 className="code-name">{code.name}</h3>
                    )}
                    
                    {!isPrivate && (
                      <div className="tags-container">
                        <span className="tag-type">{code.codeType}</span>
                        {isCommission && <span className="tag-commission">💎 Private</span>}
                        {code.eventTags && code.eventTags.map((tag, i) => (
                          <span key={`evt_${i}`} className="tag-event">🌻 {tag}</span>
                        ))}
                        {code.activityTags && code.activityTags.map((tag, i) => (
                          <span key={`act_${i}`} className="tag-activity">🏷️ {tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="empty-state">ไม่พบโค้ดที่ตรงกับการค้นหา 😥</div>
          )}
        </div>
      </div>
      {personalKeyConnected && showCloudDrafts && (
        <div className="cloud-drafts-overlay" onClick={() => setShowCloudDrafts(false)}>
          <section className="cloud-drafts-panel" role="dialog" aria-modal="true" aria-label="Cloud Drafts" onClick={event => event.stopPropagation()}>
            <div className="cloud-drafts-header">
              <div>
                <strong style={{ color: '#4c1d95', fontSize: '1rem' }}>☁️ Cloud Drafts</strong>
                <div style={{ fontSize: '0.76rem', color: '#6b21a8', marginTop: '2px' }}>ค้นหาตามชื่อ Draft หรือชื่อโค้ด · {cloudDrafts.length} รายการ</div>
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input className="cloud-drafts-search" type="search" placeholder="ค้นหา Draft หรือโค้ด..." value={cloudDraftSearch} onChange={event => setCloudDraftSearch(event.target.value)} />
                <button type="button" className="personal-key-action" onClick={() => void refreshCloudDrafts()} disabled={cloudDraftsLoading} title="โหลดรายการใหม่" aria-label="โหลด Cloud Drafts ใหม่">{cloudDraftsLoading ? '…' : '↻'}</button>
                <button type="button" className="personal-key-action" onClick={() => setShowCloudDrafts(false)} title="ปิดหน้าต่าง" aria-label="ปิด Cloud Drafts">✕</button>
              </div>
            </div>
            {cloudDraftsError ? (
              <div role="alert" style={{ color: '#b91c1c', fontSize: '0.85rem', padding: '10px 2px' }}>{cloudDraftsError}</div>
            ) : cloudDraftsLoading && cloudDrafts.length === 0 ? (
              <div style={{ color: '#6b21a8', fontSize: '0.85rem', padding: '10px 2px' }}>กำลังโหลด Drafts...</div>
            ) : visibleCloudDrafts.length > 0 ? (
              <div className="cloud-drafts-grid">
                {visibleCloudDrafts.map(draft => {
                  const code = codes.find(item => item.id === draft.code_id);
                  const codeName = code?.name || 'ไม่พบโค้ดต้นทาง';
                  const preview = code ? renderDraftTemplate(code, draft) : '<!doctype html><html><body style="margin:0;background:#131313;color:#aaa;font:24px sans-serif;padding:30px">Template unavailable</body></html>';
                  return (
                    <Link className="cloud-draft-card" href={`/codes/${encodeURIComponent(draft.code_id)}?draft=${encodeURIComponent(draft.id)}`} key={draft.id} title={`เปิด ${draft.name}`}>
                      <div className="cloud-draft-preview">
                        <iframe title={`พรีวิว ${draft.name}`} srcDoc={preview} sandbox="" loading="lazy" />
                      </div>
                      <div className="cloud-draft-info">
                        <p className="cloud-draft-name">{draft.name}</p>
                        <p className="cloud-draft-code">โค้ด: {codeName}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div style={{ color: '#6b21a8', fontSize: '0.85rem', padding: '10px 2px' }}>{cloudDrafts.length ? 'ไม่พบ Draft ที่ตรงกับคำค้นหา' : 'ยังไม่มี Cloud Draft ที่บันทึกไว้'}</div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
