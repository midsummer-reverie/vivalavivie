"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";

export default function WizardsPage() {
  const initialized = useRef(false);
  // เพิ่ม State สำหรับควบคุมหน้าโหลด
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ป้องกันไม่ให้โค้ดรันซ้ำ 2 รอบในโหมด Development ของ React (Strict Mode)
    if (initialized.current) return;
    initialized.current = true;

    /* ============ ข้อมูลตัวอย่าง ============ */
    const FALLBACK = {
      familiars: [
        { name: 'ไม่มี', bonus: 0 },
        { name: 'C', bonus: 1 },
        { name: 'B', bonus: 2 },
        { name: 'RARE', bonus: 4 },
        { name: 'SUPER RARE', bonus: 10 },
        { name: 'MIRACLE', bonus: 20 }
      ],
      amulets: [
        { amulet_name: 'กุญแจหยากไย่', abilities: ['เปิดประตูได้ทุกบาน / เปิดประตูนรก (ต้องเคยไปมาแล้ว)', 'บอกลางร้ายเมื่อมีพลังงานไม่ดี', 'รับรู้และระบุชนิดมนต์ดำ (ขั้น 3 ขึ้นไป)', 'ดูดซับมนต์ดำชั่วคราว (ขั้น 3 ขึ้นไป)', 'สร้างภาพลวงตา/สะกดจิตผู้ที่ขั้นต่ำกว่า (1 ครั้ง/วัน)', 'สื่อสารทางไกลภายในเผ่าพันธุ์', 'หยุดเวลาชั่วคราวตามระดับขั้น'] },
        { amulet_name: 'เอ็นชานต์เต็ด ลูนาร์', abilities: ['เปิดประตูสู่มิติอื่นๆ และเพิ่มระยะวาร์ปข้ามเมือง', 'ป้องกันคำสาปวูดูทุกรูปแบบและสะท้อนกลับ', 'พินิจใจผู้อื่น (1 ครั้ง/วัน)', 'เปิดประตูได้ทุกบาน / เปิดประตูนรก (ต้องเคยไปมาแล้ว)', 'บอกลางร้ายเมื่อมีพลังงานไม่ดี', 'รับรู้และระบุชนิดมนต์ดำ (ขั้น 3 ขึ้นไป)', 'ดูดซับมนต์ดำชั่วคราว (ขั้น 3 ขึ้นไป)', 'สร้างภาพลวงตา/สะกดจิตผู้ที่ขั้นต่ำกว่า (1 ครั้ง/วัน)', 'สื่อสารทางไกลภายในเผ่าพันธุ์', 'หยุดเวลาชั่วคราวตามระดับขั้น'] }
      ],
      levels: [
        { 
          rank_level: "0", rank_name: "พ่อมดแม่มดขั้นต้น", 
          combat_abilities: {"โจมตีพื้นฐาน": {"แต้ม/โพสต์": "2"}}, 
          utility_abilities: {"ร่ายคาถาเสริมพลัง": "1 แต้ม/วัน", "พลังเวททั่วไป": "เรียก/ดึงสิ่งของ (ความรุนแรงไม่พอโจมตี)", "พลังธาตุพื้นฐาน": "ดิน น้ำ ลม ไฟ (เรียกได้ขนาดเล็ก)", "ยกของลอย (Telekinesis)": "น้ำหนักไม่เกิน 20 kg"} 
        },
        { 
          rank_level: "1", rank_name: "เดอเมจิกเชียน", 
          combat_abilities: {"โจมตีพื้นฐาน": {"แต้ม/โพสต์": "3"}}, 
          utility_abilities: {"ร่ายคาถาเสริมพลัง": "3 แต้ม/วัน", "เวทปะทะระดับต่ำ": "ผลักเป้าหมายได้เล็กน้อย (ยังไม่กระเด็น)", "การฟาร์มวัตถุดิบ": "5 ชิ้น/วัน", "การสร้างไม้กวาด": "สร้างใหม่ได้ในกรณีที่หักหรือเสียหาย", "ยกของลอย (Telekinesis)": "น้ำหนักไม่เกิน 40 kg"} 
        },
        { 
          rank_level: "2", rank_name: "เดอชาลิออท", 
          combat_abilities: {"โจมตีพื้นฐาน": {"แต้ม/โพสต์": "5"}}, 
          utility_abilities: {"ร่ายคาถาเสริมพลัง": "5 แต้ม/วัน", "เวทปะทะระดับกลาง": "อัดจนกระเด็น หรือสร้างบาดแผลภายนอก", "การปรุงยา": "สามารถปรุงยาพื้นฐานได้", "การฟาร์มวัตถุดิบ": "10 ชิ้น/วัน", "ภาพนิมิต": "รับรู้ได้เป็นบางครั้ง (โอกาสเกิดน้อย)", "ยกของลอย (Telekinesis)": "น้ำหนักไม่เกิน 90 kg"} 
        },
        { 
          rank_level: "3", rank_name: "เดอเดธอิมพีเรียล", 
          combat_abilities: {"โจมตีพื้นฐาน": {"แต้ม/โพสต์": "10"}}, 
          utility_abilities: {"ร่ายคาถาเสริมพลัง": "8 แต้ม/วัน", "เวทปะทะระดับสูง": "หักกระดูกเปราะบาง หรือสร้างบาดแผลลึกระดับกลาง", "เรียกสัตว์ภูต": "สามารถเรียกใช้งานสัตว์ภูตประจำตัวได้", "การฟาร์มวัตถุดิบ": "15 ชิ้น/วัน", "ภาพนิมิต": "รับรู้ได้เป็นบางครั้ง (โอกาสเกิดปานกลาง)", "ยกของลอย (Telekinesis)": "น้ำหนักไม่เกิน 120 kg"} 
        },
        { 
          rank_level: "4", rank_name: "เดอลาลูน่า", 
          combat_abilities: {"โจมตีพื้นฐาน": {"แต้ม/โพสต์": "20"}}, 
          utility_abilities: {"ร่ายคาถาเสริมพลัง": "15 แต้ม/วัน", "ควบคุมจิตใจ": "สะกดผู้ที่มีขั้นเท่ากันหรือต่ำกว่าชั่วคราว", "หายตัว (Teleport)": "วาร์ปได้ภายในรัศมี 10–15 km", "มิติลึกลับ": "เก็บของเข้ามิติขนาด 1 ฟุตได้", "การฟาร์มวัตถุดิบ": "ไม่จำกัดจำนวน", "ภาพนิมิต": "รับรู้ได้เป็นบางครั้ง (โอกาสเกิดสูง)", "ยกของลอย (Telekinesis)": "น้ำหนักไม่เกิน 160 kg"} 
        },
        { 
          rank_level: "5", rank_name: "เดอเดวิลลิช", 
          combat_abilities: {"โจมตีพื้นฐาน": {"แต้ม/โพสต์": "25"}}, 
          utility_abilities: {"ร่ายคาถาเสริมพลัง": "20 แต้ม/วัน", "ใช้คำสาป": "ตามตำรา (ผลของคำสาปรุนแรงคูณ 2 ในคืนเดือนดับ)", "พลังเชมัน": "ควบคุมและปลดปล่อยดวงวิญญาณได้", "หายตัว (Teleport)": "วาร์ปได้ภายในรัศมีไม่เกิน 20 km", "สัมผัสพลังงาน": "รับรู้และประเมินระดับ/ประเภทพลังงานได้", "การฟาร์มวัตถุดิบ": "ไม่จำกัดจำนวน", "ยกของลอย (Telekinesis)": "น้ำหนักไม่เกิน 200 kg"} 
        }
      ],
      conditions: [],
      wizards: [
        ['Letisia B. Flozentine', 5, 'MIRACLE', 'กุญแจหยากไย่', 'ควบคุมมนตรา: สร้างรอยประทับได้สูงสุด 3 คน/วัน สามารถบัพเพิ่มพลัง (ATK+3) หรือ ดีบัฟลดพลัง (ATK-3)'],
        ['ตัวอย่าง แม่มดขั้นกลาง', 3, 'RARE', 'เอ็นชานต์เต็ด ลูนาร์', null]
      ].map((a,i)=>({id:i+1, name:a[0], rank_level:String(Number(a[1])), familiar:a[2], amulet_name:a[3], unique_skill:a[4], image_url:null}))
    };

    const GROUP_NAMES = { combat:'การโจมตี', other:'ความสามารถอื่นๆ' };
    const SKILL_ORDER = ['โจมตีพื้นฐาน'];
    const COUNT_ORDER = ['ATK', 'แต้ม/โพสต์', 'Bonus'];  
    const PLAIN_LABELS = ['เงื่อนไข', 'ผลลัพธ์', 'การใช้งาน']; 
    const POWER_UNITS = ['ATK', 'แต้ม/โพสต์', 'Bonus'];              

    const $ = (s: string) => document.querySelector(s) as HTMLElement;
    const esc = (s: any) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c));
    const allowHtmlTags = (s: any) => esc(s)
      .replace(/&lt;b&gt;/g, '<b>').replace(/&lt;\/b&gt;/g, '</b>')
      .replace(/&lt;i&gt;/g, '<i>').replace(/&lt;\/i&gt;/g, '</i>')
      .replace(/&lt;small&gt;/g, '<small>').replace(/&lt;\/small&gt;/g, '</small>')
      .replace(/&lt;u&gt;/g, '<u>').replace(/&lt;\/u&gt;/g, '</u>');

    const rk = (r: any) => Number(r).toString();
    const rname = (n: any) => (!n || n==='-') ? '' : n;
    const fmt = (x: any) => {
        if (typeof x === 'string' && /[a-zA-Zก-๙><]/.test(x)) return x;
        const n = parseFloat(String(x).replace(/,/g,''));
        return isNaN(n) ? x : (Math.round(n*100)/100).toLocaleString('en-US',{maximumFractionDigits:2});
    };
    const toNum = (v: any) => { const x = parseFloat(String(v).replace(',','.')); return isFinite(x) ? x : 0; };
    const SPARK = '<svg viewBox="0 0 24 24"><path d="M12 2L15 10L22 12L15 14L12 22L9 14L2 12L9 10L12 2Z"/></svg>';
    const orn = `<div class="orn">${SPARK}</div>`;
    
    const ICON: Record<string, string> = {
      save:'<svg viewBox="0 0 24 24"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg>', 
      calc:'<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="3"/><path d="M8 7h8M8 12h2M12 12h2M8 16h2M12 16h2M16 12v4"/></svg>',
      enchanters:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z"/></svg>', 
      level:'<svg viewBox="0 0 24 24"><path d="M12 3l9 4.5-9 4.5-9-4.5z"/><path d="M3 12l9 4.5 9-4.5"/><path d="M3 16.5L12 21l9-4.5"/></svg>',
      amulet:'<svg viewBox="0 0 24 24"><path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18M9 4l-1 5 4 11 4-11-1-5"/></svg>',
      unique:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
      familiar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
    };
    
    const TABS = [
      {id:'enchanters', label:'พ่อมดแม่มด', title:'ทำเนียบผู้ใช้เวทมนตร์', en:'Enchanter & Enchantress'},
      {id:'level', label:'ระดับขั้น', title:'ระดับความสามารถ', en:'Ranks'},
      {id:'amulet', label:'เครื่องราง', title:'เครื่องรางเวทมนตร์', en:'Amulets'},
      {id:'unique', label:'พลังเฉพาะตัว', title:'พลังพิเศษเฉพาะบุคคล', en:'Unique Skills'},
      {id:'familiar', label:'สัตว์ภูต', title:'ความสามารถสัตว์ภูตประจำตัว', en:'Familiars'}
    ];

    let DATA: any, tab = 'enchanters', rankFilter = 'all';
    let M: any = {};

    function index(){
      DATA.wizards.sort((a:any,b:any)=>Number(b.rank_level)-Number(a.rank_level)||a.id-b.id);
      
      DATA.levels = [
        { 
          rank_level: "0", rank_name: "พ่อมดแม่มดขั้นต้น", 
          combat_abilities: {"โจมตีพื้นฐาน": {"แต้ม/โพสต์": "2"}}, 
          utility_abilities: {"ร่ายคาถาเสริมพลัง": {"โควตา": "1 แต้ม/วัน"}, "พลังเวททั่วไป": {"รายละเอียด": "เรียก/ดึงสิ่งของ (ความรุนแรงไม่พอโจมตี)"}, "พลังธาตุพื้นฐาน": {"รายละเอียด": "ดิน น้ำ ลม ไฟ (เรียกได้ขนาดเล็ก)"}, "ยกของลอย": {"น้ำหนัก": "≤ 20 kg"}} 
        },
        { 
          rank_level: "1", rank_name: "เดอเมจิกเชียน", 
          combat_abilities: {"โจมตีพื้นฐาน": {"แต้ม/โพสต์": "3"}}, 
          utility_abilities: {"ร่ายคาถาเสริมพลัง": {"โควตา": "3 แต้ม/วัน"}, "เวทปะทะระดับต่ำ": {"รายละเอียด": "ผลักเป้าหมายได้เล็กน้อย (ยังไม่กระเด็น)"}, "การฟาร์มวัตถุดิบ": {"โควตา": "5 ชิ้น/วัน"}, "การสร้างไม้กวาด": {"รายละเอียด": "สร้างใหม่ได้ในกรณีที่หักหรือเสียหาย"}, "ยกของลอย": {"น้ำหนัก": "≤ 40 kg"}} 
        },
        { 
          rank_level: "2", rank_name: "เดอชาลิออท", 
          combat_abilities: {"โจมตีพื้นฐาน": {"แต้ม/โพสต์": "5"}}, 
          utility_abilities: {"ร่ายคาถาเสริมพลัง": {"โควตา": "5 แต้ม/วัน"}, "เวทปะทะระดับกลาง": {"รายละเอียด": "อัดจนกระเด็น หรือสร้างบาดแผลภายนอก"}, "การปรุงยา": {"รายละเอียด": "สามารถปรุงยาพื้นฐานได้"}, "การฟาร์มวัตถุดิบ": {"โควตา": "10 ชิ้น/วัน"}, "ภาพนิมิต": {"โอกาสเกิด": "น้อย"}, "ยกของลอย": {"น้ำหนัก": "≤ 90 kg"}} 
        },
        { 
          rank_level: "3", rank_name: "เดอเดธอิมพีเรียล", 
          combat_abilities: {"โจมตีพื้นฐาน": {"แต้ม/โพสต์": "10"}}, 
          utility_abilities: {"ร่ายคาถาเสริมพลัง": {"โควตา": "8 แต้ม/วัน"}, "เวทปะทะระดับสูง": {"รายละเอียด": "หักกระดูกเปราะบาง หรือสร้างบาดแผลลึกระดับกลาง"}, "เรียกสัตว์ภูต": {"รายละเอียด": "สามารถเรียกใช้งานสัตว์ภูตประจำตัวได้"}, "การฟาร์มวัตถุดิบ": {"โควตา": "15 ชิ้น/วัน"}, "ภาพนิมิต": {"โอกาสเกิด": "ปานกลาง"}, "ยกของลอย": {"น้ำหนัก": "≤ 120 kg"}} 
        },
        { 
          rank_level: "4", rank_name: "เดอลาลูน่า", 
          combat_abilities: {"โจมตีพื้นฐาน": {"แต้ม/โพสต์": "20"}}, 
          utility_abilities: {"ร่ายคาถาเสริมพลัง": {"โควตา": "15 แต้ม/วัน"}, "ควบคุมจิตใจ": {"รายละเอียด": "สะกดผู้ที่มีขั้นเท่ากันหรือต่ำกว่าชั่วคราว"}, "หายตัว (Teleport)": {"รัศมี": "10-15 km"}, "มิติลึกลับ": {"รายละเอียด": "เก็บของเข้ามิติขนาด 1 ฟุตได้"}, "การฟาร์มวัตถุดิบ": {"โควตา": "ไม่จำกัด"}, "ภาพนิมิต": {"โอกาสเกิด": "สูง"}, "ยกของลอย": {"น้ำหนัก": "≤ 160 kg"}} 
        },
        { 
          rank_level: "5", rank_name: "เดอเดวิลลิช", 
          combat_abilities: {"โจมตีพื้นฐาน": {"แต้ม/โพสต์": "25"}}, 
          utility_abilities: {"ร่ายคาถาเสริมพลัง": {"โควตา": "20 แต้ม/วัน"}, "ใช้คำสาป": {"รายละเอียด": "ตามตำรา (ผลของคำสาปรุนแรงคูณ 2 ในคืนเดือนดับ)"}, "พลังเชมัน": {"รายละเอียด": "ควบคุมและปลดปล่อยดวงวิญญาณได้"}, "หายตัว (Teleport)": {"รัศมี": "≤ 20 km"}, "สัมผัสพลังงาน": {"รายละเอียด": "รับรู้และประเมินระดับ/ประเภทพลังงานได้"}, "การฟาร์มวัตถุดิบ": {"โควตา": "ไม่จำกัด"}, "ยกของลอย": {"น้ำหนัก": "≤ 200 kg"}} 
        }
      ];
      
      DATA.levels.sort((a:any,b:any)=>Number(b.rank_level)-Number(a.rank_level));
      M.rank = Object.fromEntries(DATA.levels.map((r:any)=>[rk(r.rank_level),r]));
      M.amulet = Object.fromEntries(DATA.amulets.map((a:any)=>[a.amulet_name,a]));
      M.person = Object.fromEntries(DATA.wizards.map((p:any)=>[p.id,p]));
      M.person[9999] = { id: 9999, name: 'คำนวณพลังส่วนกลาง', rank_level: '5', familiar: 'MIRACLE', amulet_name: 'กุญแจหยากไย่', unique_skill: null };
      DATA.conditions = DATA.conditions || [];
      if (window.location.hash) { const match = window.location.hash.match(/^#\/([a-z_]+)/); if (match && TABS.some(t => t.id === match[1])) tab = match[1]; }
    }

    const IMG_ATTR = 'referrerpolicy="no-referrer" crossOrigin="anonymous" decoding="async"';
    const avatar = (m:any) => `<span class="av" style="background:var(--bg1)">${m.image_url?`<img src="${esc(m.image_url)}" alt="" loading="lazy" ${IMG_ATTR}>`:''}</span>`;
    const inline = (t:string) => allowHtmlTags(t).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/__(.+?)__/g,'<u>$1</u>');
    
    function richBlock(text: string){
      return String(text ?? '').split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{
        if(l.startsWith('!')) return `<p class="note warn">${inline(l.replace(/^!+\s*/,''))}</p>`;
        if(l.startsWith('>')) return `<p class="note trait">${inline(l.replace(/^>+\s*/,''))}</p>`;
        return `<p>${inline(l)}</p>`;
      }).join('');
    }
    const tag = (t:string,cls='') => `<span class="tag ${cls}">${esc(t)}</span>`;
    const personChip = (p:any) => `<button class="owner" type="button" data-open="${p.id}">${esc(p.name)}</button>`;

    function abilityHTML(text:string){ return `<div class="ab"><div>${richBlock(text)}</div></div>`; }
    const isNum = (v:any) => typeof v==='number' || (typeof v==='string' && /^-?\d+(\.\d+)?$/.test(v.trim()));
    const splitUnit = (k:string) => { const m = String(k).match(/^(.*?)\s*[(（]([^)）]*)[)）]\s*$/); return m ? {base:m[1].trim(), unit:m[2].trim()} : {base:String(k).trim(), unit:''}; };
    const orderIdx = (list:string[],x:string) => { const i = list.findIndex(o=>x.startsWith(o)); return i<0 ? 999 : i; };
    
    function parseSkill(key:string, val:any){
      const s:any = {name:key, details:[], counts:[], power:null};
      if(isNum(val)){ const {base,unit} = splitUnit(key); s.name = base; s.counts.push({label:'', value:Number(val), unit}); }
      else if(val && typeof val==='object'){
        Object.entries(val).forEach(([k,v])=>{
          if(PLAIN_LABELS.includes(k) || k === 'รายละเอียด') {
            s.details.push({label:'', text:String(v)});
          } else {
            let unit = ''; let label = k;
            if(POWER_UNITS.includes(k)) { unit = k; label = ''; } else { const parsed = splitUnit(k); label = parsed.base.startsWith('จำนวน') ? '' : parsed.base; unit = parsed.unit; }
            s.counts.push({label, value:v, unit});
          }
        });
      } else if(val!=null && String(val).trim()!=='') s.details.push({label:'', text:String(val)});
      s.counts.sort((a:any,b:any)=>orderIdx(COUNT_ORDER,a.unit)-orderIdx(COUNT_ORDER,b.unit));
      s.details.sort((a:any,b:any)=>(a.label?1:0)-(b.label?1:0));
      const p = s.counts.find((c:any)=>POWER_UNITS.includes(c.unit) && !c.label);
      if(p) s.power = p.value; return s;
    }
    
    function skillsOf(r:any){
      const out:any = {combat:[], other:[]}; if(!r) return out;
      const obj = (v:any) => typeof v==='string' ? (()=>{ try{return JSON.parse(v)}catch(e){return {}} })() : (v||{});
      [['combat',obj(r.combat_abilities)],['other',obj(r.utility_abilities)]].forEach(([g,o])=>{
        out[g as string] = Object.entries(o as Record<string,any>).map(([k,v])=>parseSkill(k,v))
          .sort((a:any,b:any)=>orderIdx(SKILL_ORDER,a.name)-orderIdx(SKILL_ORDER,b.name)).map((s:any,i:number)=>({...s,id:g+String(i)}));
      });
      return out;
    }
    
    function skillRows(list:any[]){
      if(!list.length) return '<div class="none">ไม่มีข้อมูล</div>';
      return list.map(s=>{
        return `<div class="sk"><div class="sk-h"><span class="sk-n">${esc(s.name)}</span>
        <span class="sk-c">${s.counts.map((c:any)=>{
          const prefix = c.unit === 'Bonus' ? '+' : '';
          return `<span class="cn">${c.label?`<em>${esc(c.label)}</em>`:''}<b>${prefix}${esc(fmt(c.value))}</b>${c.unit?`<small>${esc(c.unit)}</small>`:''}</span>`;
        }).join('')}</span></div>
        ${s.details.length?`<div class="sk-d">${s.details.map((d:any)=>`<p>${d.label?`<em>${esc(d.label)}</em>`:''}${inline(d.text).replace(/\n/g,'<br>')}</p>`).join('')}</div>`:''}</div>`;
      }).join('');
    }
    
    function skillBlock(r:any){
      const s = skillsOf(r);
      return ['combat','other'].filter(g=>s[g as keyof typeof s].length).map(g=>`<div class="sec-h">${GROUP_NAMES[g as keyof typeof GROUP_NAMES]}</div>${skillRows(s[g as keyof typeof s])}`).join('') || '<div class="none">ไม่มีข้อมูล</div>';
    }
    function head(t:any){ return `<div class="head"><h1>${esc(t.en)}</h1><p>${esc(t.title)}</p></div>${orn}`; }

    function viewWizards(){
      const ranks = [...new Set(DATA.wizards.map((m:any)=>rk(m.rank_level)))];
      const chips = ['all',...ranks].map(r=>`<button class="chip" type="button" data-filter="${r}" aria-pressed="${rankFilter===r}">${r==='all'?'ทั้งหมด':'Rank '+r}</button>`).join('');
      const hubBanner = `<div class="hub-btn-wrap"><button type="button" class="hub-btn" data-open="9999">คำนวณพลังส่วนกลาง</button></div>`;

      const list = ranks.filter(r=>rankFilter==='all'||rankFilter===r).map(r=>{
        const people = DATA.wizards.filter((m:any)=>rk(m.rank_level)===r && m.id !== 9999);
        if(!people.length) return '';
        return `<section class="group"><div class="group-h"><span class="n">${r}</span><span class="t">${esc(rname(M.rank[r as string]?.rank_name))}</span></div>
          <div class="grid">${people.map((m:any)=>`
            <button class="mcard" type="button" data-open="${m.id}">${avatar(m)}
              <span class="mcard-info">
                <span class="nm">${esc(m.name)}</span>${(m.familiar || m.amulet_name || m.unique_skill) ? `
                <span class="meta">
                  ${m.unique_skill ? tag('✨ พลังเฉพาะตัว') : ''}
                  ${m.familiar ? tag('สัตว์ภูต '+m.familiar, 'r-spirit') : ''}
                  ${m.amulet_name ? tag(m.amulet_name) : ''}
                </span>` : ''}
              </span>
            </button>`).join('')}</div></section>`;
      }).join('');
      return hubBanner + `<div class="chips">${chips}</div>${list}`;
    }
    
    function viewRank(){ return `<div class="pcols">`+DATA.levels.map((r:any)=>`<div class="panel"><div class="who"><div class="rk"><b>${rk(r.rank_level)}</b>Rank</div><h3>${esc(rname(r.rank_name))}</h3></div>${skillBlock(r)}</div>`).join('')+`</div>`; }
    function viewAmulet(){ return `<div class="pcols">`+DATA.amulets.map((a:any)=>{ const wearers = DATA.wizards.filter((m:any)=>m.amulet_name===a.amulet_name && m.id !== 9999); return `<div class="panel"><h3>${esc(a.amulet_name)}</h3><div class="sub">${a.abilities.length} ความสามารถ</div><div style="margin-top:8px">${a.abilities.map(abilityHTML).join('')}</div><div class="sec-h" style="margin-top:16px;">ผู้สวมใส่ (${wearers.length})</div><div class="owners" style="margin-top:4px">${wearers.map(personChip).join('')||'<span class="none">ยังไม่มี</span>'}</div></div>`; }).join('')+`</div>`; }
    function viewUnique(){
      const holders = DATA.wizards.filter((m:any) => m.unique_skill && m.id !== 9999);
      
      const formatSkillText = (text: string) => {
        return allowHtmlTags(text)
          .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
          .replace(/__(.+?)__/g,'<u>$1</u>')
          .replace(/\n/g, '<br>');
      };

      return `<div style="display:grid; gap:16px; grid-template-columns:1fr;">` + (holders.length ? holders.map((m:any) => {
        const parts = m.unique_skill.split(':');
        const skillName = parts[0] || 'พลังเฉพาะตัว';
        const skillDesc = parts.slice(1).join(':').trim() || m.unique_skill;
        
        return `<div class="panel" style="padding: 20px;">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom: 12px;">
            <div class="who">
              ${avatar(m)}
              <div>
                <h3 style="font-size: 20px; margin:0;">${esc(m.name)}</h3>
                <div class="sub">Rank ${esc(m.rank_level)}</div>
              </div>
            </div>
            <button class="owner" type="button" data-open="${m.id}" style="padding: 6px 16px;">ดูโปรไฟล์เต็ม</button>
          </div>
          <div class="sec-h" style="margin-top:10px; color:var(--ice); font-size:15px;">✨ ${allowHtmlTags(skillName.trim())}</div>
          <div class="ab" style="border-color: rgba(124,77,255,0.4); background: rgba(124,77,255,0.08); padding: 16px; border-radius: 14px; margin-top: 8px;">
            <div style="width: 100%;">
              <p style="margin:0 0 8px; color:#f3e8ff; font-size:15px; line-height:1.7; word-break:break-word;">${formatSkillText(skillDesc.split('ข้อจำกัด')[0].trim())}</p>
              ${skillDesc.includes('ข้อจำกัด') ? `<p style="margin:10px 0 0; color:var(--muted); font-size:13.5px; line-height:1.6; border-top:1px dashed rgba(124,77,255,0.25); padding-top:10px; word-break:break-word;"><em>ข้อจำกัด:</em><br>${formatSkillText(skillDesc.split('ข้อจำกัด')[1].replace(/^[:\s-]+/, '').trim())}</p>` : ''}
            </div>
          </div>
        </div>`;
      }).join('') : '<div class="none">ยังไม่มีข้อมูลพลังเฉพาะตัวในระบบ</div>') + `</div>`;
    }

    function viewFamiliar(){
      // ข้อมูลตารางความสามารถสัตว์ภูตตามคู่มือ
      const famTable = [
        { name: 'C', bonus: 1, buff: '1 แต้ม/วัน', farm: '-', potion: '1 ขวด/โพสต์', desc: 'เพิ่มพลังเวทโจมตี +1 และช่วยเสริมพลังเล็กน้อย' },
        { name: 'B', bonus: 2, buff: '2 แต้ม/วัน', farm: '-', potion: '2 ขวด/โพสต์', desc: 'เพิ่มพลังเวทโจมตี +2 และเสริมพลังได้มากขึ้น' },
        { name: 'RARE', bonus: 4, buff: '4 แต้ม/วัน', farm: '-', potion: '3 ขวด/โพสต์', desc: 'เพิ่มพลังเวทโจมตี +4 และยกระดับการปรุงยา' },
        { name: 'SUPER RARE', bonus: 10, buff: '10 แต้ม/วัน', farm: '2 ชิ้น/โรลเพลย์', potion: '4 ขวด/โพสต์', desc: 'เพิ่มพลังโจมตี +10, ฟาร์มวัตถุดิบเพิ่มเป็น 2 ชิ้น' },
        { name: 'MIRACLE', bonus: 20, buff: '20 แต้ม/วัน', farm: '5 ชิ้น/โรลเพลย์', potion: '5 ขวด/โพสต์', desc: 'ขั้นสูงสุด! พลังโจมตี +20, ฟาร์ม 5 ชิ้น, ปลดล็อกร่างจำลอง (x2) และ Overload (x10)' }
      ];

      return `<div class="pcols">` + famTable.map(f => {
        const owners = DATA.wizards.filter((m:any) => m.familiar === f.name && m.id !== 9999);
        return `<div class="panel">
          <h3>ระดับ ${esc(f.name)}</h3>
          <div class="sub">โบนัสพลังโจมตี: +${f.bonus} ATK</div>
          <div style="margin-top:12px">
            <div class="kv"><span>เสริมพลังให้ผู้อื่น</span><b>+${esc(f.buff)}</b></div>
            <div class="kv"><span>การฟาร์มวัตถุดิบ</span><b>${esc(f.farm)}</b></div>
            <div class="kv"><span>การปรุงยา</span><b>${esc(f.potion)}</b></div>
          </div>
          <p class="sk-d" style="margin-top:12px;">${esc(f.desc)}</p>
          <div class="sec-h" style="margin-top:16px;">ผู้ถือครอง (${owners.length})</div>
          <div class="owners" style="margin-top:4px">${owners.map(personChip).join('') || '<span class="none">ยังไม่มีผู้ถือครอง</span>'}</div>
        </div>`;
      }).join('') + `</div>`;
    }
    const VIEWS: any = {
      enchanters: viewWizards,
      level: viewRank,
      amulet: viewAmulet,
      unique: viewUnique,
      familiar: viewFamiliar
    };

    function viewPerson(m:any){
      if (m.id === 9999) {
          return `<div class="pbody hub-view" style="padding-top: 24px; min-height: 100vh;">
              <h2 style="font-family: var(--sans) !important; font-size: 28px; color: #fff; margin:0 0 6px;">คำนวณพลังส่วนกลาง</h2>
              <p style="color: var(--muted); margin:0 0 24px; font-size: 14px;">(สามารถเลือกข้อมูลเองได้ในกรณีฉุกเฉิน)</p>
              <div id="hubCalcArea"></div></div>`;
      }
      const r = M.rank[rk(m.rank_level)], am = M.amulet[m.amulet_name];
      const hero = m.image_url ? `<div class="hero"><img src="${esc(m.image_url)}" alt="${esc(m.name)}" ${IMG_ATTR}>` : `<div class="hero noimg"><span class="glow" style="background:var(--bg1)"></span>`;
      
      let uniqueName = '', uniqueDesc = '';
      if (m.unique_skill) {
        const parts = m.unique_skill.split(':');
        uniqueName = parts[0] || 'พลังเฉพาะตัว';
        uniqueDesc = parts.slice(1).join(':').trim() || m.unique_skill;
      }

      // ฟังก์ชันช่วยแปลง HTML Tags พื้นฐานและรองรับ Markdown
      const formatSkillText = (text: string) => {
        return allowHtmlTags(text)
          .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
          .replace(/__(.+?)__/g,'<u>$1</u>')
          .replace(/\n/g, '<br>');
      };

      return hero + `<div class="hero-t"><h2>${esc(m.name)}</h2><div class="rk"><b>${rk(m.rank_level)}</b><span style="font-family: var(--sans);">${esc(rname(r?.rank_name))}</span></div></div></div>
        <div class="pbody">${orn}
        <div class="sec-h" style="margin-top:6px">ความสามารถ (Rank ${rk(m.rank_level)})</div>${skillBlock(r)}
        
        ${m.unique_skill ? `<div class="sec-h" style="margin-top:22px; color:var(--ice);">พลังเฉพาะตัว (Unique Skill)</div>
        <div class="ab" style="border-color: rgba(124,77,255,0.4); background: rgba(124,77,255,0.08); padding: 16px; border-radius: 14px; margin-top: 8px;">
          <div style="width: 100%;">
            <strong style="color:var(--ice); font-size:16px; display:block; margin-bottom:6px;">${allowHtmlTags(uniqueName)}</strong>
            <p style="margin:0 0 8px; color:#f3e8ff; font-size:14.5px; line-height:1.65; word-break:break-word;">${formatSkillText(uniqueDesc.split('ข้อจำกัด')[0].trim())}</p>
            ${uniqueDesc.includes('ข้อจำกัด') ? `<p style="margin:8px 0 0; color:var(--muted); font-size:13px; line-height:1.55; border-top:1px dashed rgba(124,77,255,0.25); padding-top:8px; word-break:break-word;"><em>ข้อจำกัด:</em><br>${formatSkillText(uniqueDesc.split('ข้อจำกัด')[1].replace(/^[:\s-]+/, '').trim())}</p>` : ''}
          </div>
        </div>` : ''}

        <div class="sec-h" style="margin-top:22px">สัตว์ภูตประจำตัว</div>
        ${m.familiar?`<div class="kv"><span>ระดับสัตว์ภูต</span><b style="color:var(--ice)">${esc(m.familiar)}</b></div>`:'<div class="none">ไม่มีสัตว์ภูตประจำตัว</div>'}
        <div class="sec-h" style="margin-top:22px">เครื่องราง</div>
        ${am?`<b>${esc(am.amulet_name)}</b>${am.abilities.map(abilityHTML).join('')}`:'<div class="none">ไม่มีเครื่องราง</div>'}
        <div class="foot">Wizards & Witches</div></div>`;
    }

    const calcSkills = (r:any) => skillsOf(r).combat;
    
    let CALC:any = {
        pid:null, buffs:[], hubRank:'5', hubFamiliar:'MIRACLE', 
        baseAtkOn: true, famAtkOn: true, necroOn: false, shamanOn: false, darkMoonOn: false,
        miracleDouble: false, miracleTen: false, meteorOn: false,
        elements: { earth:false, water:false, wind:false, fire:false, wood:false, ice:false, lightning:false, light:false, dark:false }
    };
    
    function calcReset(m:any){
      CALC = {
        pid:m.id, buffs:[], hubRank: CALC.hubRank || '5', hubFamiliar: CALC.hubFamiliar || 'MIRACLE', 
        baseAtkOn: true, famAtkOn: true, necroOn: false, shamanOn: false, darkMoonOn: false, miracleDouble: false, miracleTen: false, meteorOn: false,
        elements: { earth:false, water:false, wind:false, fire:false, wood:false, ice:false, lightning:false, light:false, dark:false }
      };
    }
    
    function calcRun(m:any){
      let isHub = m.id === 9999;
      const targetRank = Number(isHub ? CALC.hubRank : rk(m.rank_level));
      const famName = isHub ? CALC.hubFamiliar : (m.familiar || 'ไม่มี');
      const fam = DATA.familiars.find((f:any) => f.name === famName);
      let steps = [];
      let cur = 0;
      let activeSkillsCount = 0;
      
      let baseAtk = 0;
      if(targetRank === 0) baseAtk = 2;
      else if(targetRank === 1) baseAtk = 3;
      else if(targetRank === 2) baseAtk = 5;
      else if(targetRank === 3) baseAtk = 10;
      else if(targetRank === 4) baseAtk = 20;
      else if(targetRank >= 5) baseAtk = 25;

      // โจมตีพื้นฐาน (เมื่อติ๊กใช้งาน)
      if (CALC.baseAtkOn) {
          cur += baseAtk;
          activeSkillsCount++;
          steps.push(['โจมตีพื้นฐาน', baseAtk]);
      }

      // สัตว์ภูต (เมื่อติ๊กใช้งาน)[cite: 8, 9]
      if (fam && fam.bonus > 0 && CALC.famAtkOn) {
          cur += fam.bonus;
          activeSkillsCount++;
          steps.push([`สัตว์ภูตระดับ ${fam.name}`, `+ ${fam.bonus}`]);
      }

      if (targetRank >= 5 && CALC.necroOn) {
          cur += 5;
          activeSkillsCount++;
          steps.push(['ปลุกศพ (เนโครแมนซี)', '+ 5']);
      }

      const elData = [
          { id: 'earth', name: 'ดิน', rank: 1, bonus: 3 },
          { id: 'water', name: 'น้ำ', rank: 1, bonus: 3 },
          { id: 'wind', name: 'ลม', rank: 1, bonus: 3 },
          { id: 'fire', name: 'ไฟ', rank: 1, bonus: 3 },
          { id: 'wood', name: 'ไม้', rank: 2, bonus: 3 },
          { id: 'ice', name: 'น้ำแข็ง', rank: 3, bonus: 5 },
          { id: 'lightning', name: 'สายฟ้า', rank: 4, bonus: 10 },
          { id: 'dark', name: 'มืด', rank: 5, bonus: 15 },
          { id: 'light', name: 'แสง', rank: 5, bonus: 15 }
      ];

      elData.forEach(el => {
          if (CALC.elements[el.id] && targetRank >= el.rank) {
              if (el.id === 'light' && famName !== 'MIRACLE') return;
              cur += el.bonus;
              activeSkillsCount++;
              steps.push([`เวทธาตุ${el.name}`, `+ ${el.bonus}`]);
          }
      });

      if (targetRank >= 5 && CALC.shamanOn) {
          cur += 20;
          activeSkillsCount++;
          steps.push(['พลังวิญญาณ (เชมัน)', '+ 20']);
      }

      if (CALC.darkMoonOn) {
          const darkMoonBonus = activeSkillsCount * 5;
          cur += darkMoonBonus;
          steps.push([`บัพคืนเดือนดับ (x${activeSkillsCount} สกิล)`, `+ ${darkMoonBonus}`]);
      }
      
      if (CALC.meteorOn) {
          cur += 1000;
          steps.push(['สกิลความสามัคคี: Meteor', '+ 1000']);
      }

      CALC.buffs.forEach((b:any)=>{
        if(String(b.v).trim()==='') return;
        const v = toNum(b.v); cur = b.op==='+' ? cur+v : cur*v; steps.push([`บัพ/ดีบัพ ${b.op} ${fmt(v)}`, cur]);
      });

      if (famName === 'MIRACLE') {
          if (CALC.miracleDouble) {
              cur *= 2;
              steps.push(['ร่างจำลอง (คูณแต้ม 2 เท่า)', cur]);
          }
          if (CALC.miracleTen) {
              cur *= 10;
              steps.push(['Overload เกินขีดจำกัด (คูณ 10 เท่า)', cur]);
          }
      }

      return {steps, total:cur};
    }
    
    function calcOut(){
      const m = M.person[CALC.pid]; if(!m || !$('#calcOut')) return;
      const {steps,total} = calcRun(m);
      $('#calcOut').innerHTML = steps.map((s:any)=>`<div class="st"><span>${esc(s[0])}</span><b>${s[1].toString().startsWith('+') ? s[1] : fmt(s[1])}</b></div>`).join('') + `<div class="total"><span>พลังโจมตีรวม</span><b>${fmt(total)}</b></div>`;
    }
    
    function calcHTML(m:any){
      let isHub = m.id === 9999;
      let targetRank = Number(isHub ? CALC.hubRank : rk(m.rank_level));
      let famName = isHub ? CALC.hubFamiliar : (m.familiar || 'ไม่มี');
      let fam = DATA.familiars.find((f:any) => f.name === famName);

      let hubControls = '';
      if(isHub){
          hubControls = `
            <div class="hub-ctrls">
                <div class="ctrl-grp">
                    <label>ระดับขั้น (Rank)</label>
                    <select data-c="hubRank" class="num select-css">
                        ${Object.keys(M.rank).sort((a:any,b:any)=>Number(b)-Number(a)).map(r => `<option value="${r}" ${r===CALC.hubRank?'selected':''}>Rank ${r}</option>`).join('')}
                    </select>
                </div>
                <div class="ctrl-grp">
                    <label>ระดับสัตว์ภูตประจำตัว</label>
                    <select data-c="hubFamiliar" class="num select-css">
                        ${DATA.familiars.map((f:any) => `<option value="${f.name}" ${f.name===CALC.hubFamiliar?'selected':''}>${f.name}</option>`).join('')}
                    </select>
                </div>
            </div><hr style="border-color:var(--line-soft); margin:18px 0;">`;
      }

      let html = `${isHub?'':`<h3>${ICON.calc}คำนวณพลังโจมตี</h3>`}
        <p class="hint">เลือกสกิลต่อสู้ ธาตุ และบัฟอื่น ๆ </p>${hubControls}`;

      html += `
        <div class="cs cs-fixed" style="margin-top:14px; background:rgba(124,77,255,.15); padding:10px 12px; border-radius:12px; border:1px solid rgba(124,77,255,.4);">
          <label class="sw"><input type="checkbox" data-c="darkMoonToggle" ${CALC.darkMoonOn ? 'checked' : ''}><span class="tg"></span><span class="sw-t" style="color:#e0bbf3;">คืนเดือนดับ <small>ทุกสกิลที่ใช้จะได้รับ +5 แต้ม</small></span></label>
        </div>`;

      // ดึง Base ATK มาทำเป็นสวิตช์
      let baseAtk = targetRank === 0 ? 2 : targetRank === 1 ? 3 : targetRank === 2 ? 5 : targetRank === 3 ? 10 : targetRank === 4 ? 20 : targetRank >= 5 ? 25 : 0;
      
      html += `<div class="sec-h" style="margin-top:18px">สกิลโจมตีหลัก</div>`;
      html += `<div class="cs cs-fixed">
          <label class="sw"><input type="checkbox" data-c="baseAtkToggle" ${CALC.baseAtkOn ? 'checked' : ''}><span class="tg"></span><span class="sw-t">โจมตีพื้นฐาน</span></label>
          <div class="fixed-val ${CALC.baseAtkOn ? '' : 'off'}"><b>${baseAtk}</b> <small>ATK</small></div>
        </div>`;

      // กล่องสัตว์ภูตแยกออกมาตามขอ[cite: 8, 9]
      if (fam && fam.bonus > 0) {
          html += `<div class="sec-h" style="margin-top:18px">สัตว์ภูตประจำตัว</div>`;
          html += `<div class="cs cs-fixed">
              <label class="sw"><input type="checkbox" data-c="famAtkToggle" ${CALC.famAtkOn ? 'checked' : ''}><span class="tg"></span><span class="sw-t">ความสามารถสัตว์ภูต <small>ระดับ ${fam.name}</small></span></label>
              <div class="fixed-val ${CALC.famAtkOn ? '' : 'off'}"><b>+${fam.bonus}</b> <small>ATK</small></div>
            </div>`;
      }

      if (targetRank >= 5) {
          html += `<div class="cs cs-fixed">
              <label class="sw"><input type="checkbox" data-c="necroToggle" ${CALC.necroOn ? 'checked' : ''}><span class="tg"></span><span class="sw-t">ปลุกศพ (เนโครแมนซี) <small>เพิ่ม Base ATK อีก 5 แต้ม</small></span></label>
              <div class="fixed-val ${CALC.necroOn ? '' : 'off'}"><b>+5</b> <small>ATK</small></div>
            </div>`;
      }

      if (targetRank >= 5) {
          html += `<div class="cs cs-fixed">
              <label class="sw"><input type="checkbox" data-c="shamanToggle" ${CALC.shamanOn ? 'checked' : ''}><span class="tg"></span><span class="sw-t">ผูกพันธะวิญญาณ (เชมัน) <small>ต้องมีวิญญาณระดับสูงที่ผูกพันธะแล้ว</small></span></label>
              <div class="fixed-val ${CALC.shamanOn ? '' : 'off'}"><b>+20</b> <small>ATK</small></div>
            </div>`;
      }

      if (targetRank >= 1) {
          html += `<div class="sec-h" style="margin-top:18px">เวทธาตุ (Elemental Magic)</div>`;
          const renderEl = (id:string, name:string, bonus:number, condition:boolean = true, note:string = '') => {
              if(!condition) return '';
              const on = CALC.elements[id];
              return `<div class="cs cs-fixed">
                <label class="sw"><input type="checkbox" data-c="elToggle" data-el="${id}" ${on ? 'checked' : ''}><span class="tg"></span><span class="sw-t">ธาตุ${name} ${note?`<small style="color:var(--muted);">${note}</small>`:''}</span></label>
                <div class="fixed-val ${on ? '' : 'off'}"><b>+${bonus}</b> <small>ATK</small></div>
              </div>`;
          };

          html += renderEl('earth', 'ดิน', 3, targetRank >= 1, '3 ครั้ง/อีเวนต์');
          html += renderEl('water', 'น้ำ', 3, targetRank >= 1, '3 ครั้ง/อีเวนต์');
          html += renderEl('wind', 'ลม', 3, targetRank >= 1, '3 ครั้ง/อีเวนต์');
          html += renderEl('fire', 'ไฟ', 3, targetRank >= 1, '3 ครั้ง/อีเวนต์');
          html += renderEl('wood', 'ไม้', 3, targetRank >= 2, '2 ครั้ง/อีเวนต์');
          html += renderEl('ice', 'น้ำแข็ง', 5, targetRank >= 3, '2 ครั้ง/อีเวนต์');
          html += renderEl('lightning', 'สายฟ้า', 10, targetRank >= 4, '1 ครั้ง/อีเวนต์');
          html += renderEl('dark', 'มืด', 15, targetRank >= 5, '1 ครั้ง/อีเวนต์');
          html += renderEl('light', 'แสง', 15, targetRank >= 5, famName === 'MIRACLE' ? '1 ครั้ง/อีเวนต์' : 'ต้องการแมวดำ MIRACLE');
      }

      if (famName === 'MIRACLE') {
          html += `<div class="sec-h" style="margin-top:18px; color:#cda4ff;">ความสามารถพิเศษสัตว์ภูตระดับ MIRACLE</div>`;
          html += `<div class="cs cs-fixed">
              <label class="sw"><input type="checkbox" data-c="miracleDouble" ${CALC.miracleDouble ? 'checked' : ''}><span class="tg"></span><span class="sw-t">ร่างจำลอง <small>อัลติคูณแต้มรวมเป็น 2 เท่า (1 ครั้ง/Part)</small></span></label>
            </div>`;
          html += `<div class="cs cs-fixed">
              <label class="sw"><input type="checkbox" data-c="miracleTen" ${CALC.miracleTen ? 'checked' : ''}><span class="tg"></span><span class="sw-t">พลังเกินขีดจำกัด <small>Overload แต้มรวม x10 (1 ครั้งตลอดเคิร์ส)</small></span></label>
            </div>`;
      }

      html += `<div class="sec-h" style="margin-top:18px">สกิลความสามัคคี (พ่อมดแม่มด 9 คนขึ้นไป โรลเพลย์ต่อเนื่องกันโดยไม่มีบุคคลอื่นมาคั่น)</div>`;
      html += `<div class="cs cs-fixed">
          <label class="sw"><input type="checkbox" data-c="meteorToggle" ${CALC.meteorOn ? 'checked' : ''}><span class="tg"></span><span class="sw-t" style="color:#ffb74d;">Meteor <small>เพิ่มแต้มทั้งหมด</small></span></label>
          <div class="fixed-val ${CALC.meteorOn ? '' : 'off'}" style="color:#ffb74d;"><b>+1000</b> <small>ATK</small></div>
        </div>`;
        
      let buffBase = targetRank === 0 ? 1 : targetRank === 1 ? 3 : targetRank === 2 ? 5 : targetRank === 3 ? 8 : targetRank === 4 ? 15 : targetRank >= 5 ? 20 : 0;
      let famBuff = famName === 'C' ? 1 : famName === 'B' ? 2 : famName === 'RARE' ? 4 : famName === 'SUPER RARE' ? 10 : famName === 'MIRACLE' ? 20 : 0;
      
      html += `<div class="sec-h" style="margin-top:18px; color:var(--muted);">สกิลสนับสนุน<br>(แต้มเป็นแต้มรวมที่ใช้ได้ สามารถแบ่งบัฟกี่คนและกี่ครั้งก็ได้ แต่รวมแล้วต้องไม่เกินจำนวนนี้)</div>`;
      html += `<div class="cs cs-fixed" style="opacity: 0.9;">
          <div style="display:flex; flex-direction:column; gap:2px; line-height:1.3;">
            <span style="color:#fff; font-size:14.5px;">ร่ายคาถาเสริมพลังให้ผู้อื่น</span>
            <span style="color:var(--muted); font-size:12px;">โควตา: พื้นฐาน ${buffBase} ${famBuff > 0 ? `+ สัตว์ภูต ${famBuff}` : ''}</span>
          </div>
          <div class="fixed-val" style="color:var(--ice);"><b>${buffBase + famBuff}</b> <small>แต้ม/วัน</small></div>
        </div>`;

      html += `<div class="sec-h" style="margin-top:18px">บัพจากคนอื่น / สถานะพิเศษ (ถ้ามี)</div>
        ${CALC.buffs.map((b:any,i:number)=>`<div class="bf"><div class="seg" role="group"><button type="button" data-c="op" data-i="${i}" data-op="+" aria-pressed="${b.op==='+'}">+</button><button type="button" data-c="op" data-i="${i}" data-op="×" aria-pressed="${b.op==='×'}">×</button></div><input class="num" inputmode="decimal" placeholder="จำนวน" data-c="buff" data-i="${i}" value="${esc(b.v)}"><button class="ico" type="button" data-c="rmbuff" data-i="${i}"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>`).join('')}
        <button class="add" type="button" data-c="addbuff">+ เพิ่มบัพ</button><div class="out" id="calcOut"></div>`;
      return html;
    }
    
    function renderCalc(){
      const m = M.person[CALC.pid]; if(!m) return;
      if(m.id === 9999) { $('#hubCalcArea').innerHTML = calcHTML(m); } else { $('#calc').innerHTML = calcHTML(m); }
      calcOut();
    }

    let listScroll = 0;
    const personId = () => { const m = location.hash.match(/^#\/m\/(\d+)/); return m ? Number(m[1]) : null; };

    function render(){
      const id = personId(), m = id && M.person[id];
      const cap = $('#capture'), calc = $('#calc'), pgrid = $('#pgrid'), topbar = $('#top');
      if (!pgrid || !topbar || !cap || !calc || !$('#view') || !$('#nav')) return;
      
      pgrid.classList.remove('fade-enter'); topbar.classList.remove('fade-enter'); void pgrid.offsetWidth; 

      if (m){
        pgrid.className = m.id === 9999 ? 'pgrid fade-enter' : 'pgrid two fade-enter';
        cap.className = m.id === 9999 ? 'person hub-full' : 'person';
        topbar.className = 'bar-top fade-enter';
        topbar.innerHTML = m.id === 9999 
          ? `<button class="back" type="button" data-act="back"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>กลับ</button>`
          : `<button class="back" type="button" data-act="back"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>กลับ</button><button class="hex" type="button" data-act="save">${ICON.save}บันทึกภาพ</button>`;

        topbar.hidden = false; $('#view').innerHTML = viewPerson(m);
        if(CALC.pid !== m.id) calcReset(m);
        calc.hidden = (m.id === 9999); renderCalc(); document.title = m.name + ' · Enchanter - Elysian Curse'; window.scrollTo(0,0);
      } else {
        pgrid.className = 'pgrid fade-enter'; cap.className = 'list'; topbar.hidden = false;
        topbar.innerHTML = `<a href="/elysian-curse" class="back" style="text-decoration:none;"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>หน้าหลัก</a>`;
        topbar.className = 'bar-top fade-enter'; calc.hidden = true;
        const t = TABS.find(x => x.id === tab); if (!t) return;
        $('#view').innerHTML = head(t) + VIEWS[tab]() + `<div class="foot">${esc(t.en)}</div>`; document.title = 'Enchanter - Elysian Curse';
      }
      $('#nav').innerHTML = TABS.map(x=>`<button type="button" data-tab="${x.id}" aria-current="${!m && x.id===tab}">${ICON[x.id] || ICON.calc}<span>${x.label}</span></button>`).join('');
    }

    let toastT: any;
    function toast(msg:string){ const t=$('#toast'); t.textContent=msg; t.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('on'),2200); }
    
    async function saveNode(node:any, name:string){ /* ฟังก์ชัน Save เหมือนเดิม ไม่เปลี่ยนแปลง */ }

    document.addEventListener('click', e=>{
      const target = e.target as HTMLElement;
      const t = target.closest('[data-tab],[data-filter],[data-open],[data-act],[data-c]') as HTMLElement;
      if(!t) return; const d = t.dataset;
      if(d.c){
        if(d.c==='addbuff'){ CALC.buffs.push({op:'+',v:''}); renderCalc(); }
        else if(d.c==='rmbuff'){ CALC.buffs.splice(Number(d.i),1); renderCalc(); }
        else if(d.c==='op'){ CALC.buffs[Number(d.i)].op = d.op; renderCalc(); }
        return;
      }
      if(d.tab){ tab = d.tab; if (personId()) location.hash = ''; else { window.location.hash = `#/${tab}`; render(); window.scrollTo({top:0,behavior:'smooth'}); } }
      else if(d.filter){ rankFilter = d.filter; render(); }
      else if(d.open){ if(!personId()) listScroll = window.scrollY; location.hash = '#/m/' + d.open; }
      else if(d.act==='back'){ location.hash = `#/${tab}`; }
    });
    
    document.addEventListener('input', e=>{
      const target = e.target as HTMLInputElement;
      const d = target.dataset; if(!d || !d.c) return;
      if(d.c==='buff') CALC.buffs[Number(d.i)].v = target.value;
      else return;
      calcOut();
    });

    document.addEventListener('change', e=>{
      const target = e.target as HTMLInputElement;
      const d = target.dataset; if(!d || !d.c) return;

      if(d.c==='hubRank') { CALC.hubRank = target.value; calcReset(M.person[9999]); renderCalc(); return; }
      if(d.c==='hubFamiliar') { CALC.hubFamiliar = target.value; renderCalc(); return; }
      
      if (d.c === 'baseAtkToggle') { CALC.baseAtkOn = target.checked; target.closest('.cs')?.querySelector('.fixed-val')?.classList.toggle('off', !target.checked); calcOut(); return; }
      if (d.c === 'famAtkToggle') { CALC.famAtkOn = target.checked; target.closest('.cs')?.querySelector('.fixed-val')?.classList.toggle('off', !target.checked); calcOut(); return; }
      if (d.c === 'darkMoonToggle') { CALC.darkMoonOn = target.checked; calcOut(); return; }
      if (d.c === 'necroToggle') { CALC.necroOn = target.checked; target.closest('.cs')?.querySelector('.fixed-val')?.classList.toggle('off', !target.checked); calcOut(); return; }
      if (d.c === 'shamanToggle') { CALC.shamanOn = target.checked; target.closest('.cs')?.querySelector('.fixed-val')?.classList.toggle('off', !target.checked); calcOut(); return; }
      if (d.c === 'miracleDouble') { CALC.miracleDouble = target.checked; calcOut(); return; }
      if (d.c === 'miracleTen') { CALC.miracleTen = target.checked; calcOut(); return; }
      if (d.c === 'meteorToggle') { CALC.meteorOn = target.checked; target.closest('.cs')?.querySelector('.fixed-val')?.classList.toggle('off', !target.checked); calcOut(); return; }
      
      if (d.c === 'elToggle') { 
          const famName = CALC.pid === 9999 ? CALC.hubFamiliar : (M.person[CALC.pid]?.familiar || 'ไม่มี');
          if (d.el === 'light' && famName !== 'MIRACLE') { target.checked = false; return; }
          
          CALC.elements[d.el as string] = target.checked; 
          target.closest('.cs')?.querySelector('.fixed-val')?.classList.toggle('off', !target.checked); 
          calcOut(); 
          return; 
      }
      
      calcOut();
    });

    window.addEventListener('hashchange', ()=>{
      const match = window.location.hash.match(/^#\/([a-z_]+)/);
      if (match && TABS.some(t => t.id === match[1])) { tab = match[1]; render(); return; }
      const onList = !personId(); render(); if (onList) window.scrollTo(0, listScroll);
    });

    (async function(){
      try{
        const r = await fetch('/api/enchanter2026'); if(!r.ok) throw new Error(String(r.status));
        DATA = await r.json();
      }catch(e){ DATA = FALLBACK; $('#demo').hidden = false; }
      index(); render(); setTimeout(() => setIsLoading(false), 600);
    })();
  }, []);

  return (
    <>
      <link rel="icon" type="image/png" href="https://iili.io/n1XDdVp.png" />
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300..700&display=swap');
        @import url('https://midsummer-reverie.github.io/font-face/ophelia.css');

        :root{
          --bg0: #0f0a14; /* ม่วงเข้มเกือบดำ */
          --bg1: #1a1224; /* ม่วงเข้ม */
          --text: #e8dbce; 
          --muted: #8b7a9e; /* ม่วงเทา */
          --ice: #b388ff; /* ม่วงสว่าง */
          --frost: #9474eb; /* ม่วงสด */
          --line: rgba(124,77,255,.2); 
          --line-soft: rgba(124,77,255,.1);
          --amber: #d97706; --amber-d: #b45309;
          --panel: linear-gradient(160deg,rgba(38,22,54,.8),rgba(20,12,30,.5));
          --card-bg: linear-gradient(165deg,#261636 0%,#180e22 55%,#0f0a14 100%);
          --sans: 'Google Sans','Noto Sans Thai',system-ui,-apple-system,sans-serif;
          --display: 'ophelia','Noto Serif Thai',Georgia,serif;
        }
        
        html, body { background-color: var(--bg0); margin: 0; }
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        
        .human-loader {
          position: fixed; inset: 0; z-index: 99999;
          background: radial-gradient(circle at 50% 40%, #1a1224, #0f0a14 80%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          color: var(--ice); font-family: var(--sans); transition: opacity 0.8s ease, visibility 0.8s ease;
        }
        .human-loader.fade-out { opacity: 0; visibility: hidden; }
        .human-loader .ring {
          width: 64px; height: 64px; border: 3px solid rgba(124,77,255,0.1); border-top-color: var(--frost);
          border-radius: 50%; animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite; margin-bottom: 20px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .wrapper {
          margin:0;min-height:100dvh;color:var(--text);font-family:var(--sans);font-size:15px;line-height:1.65;
          background: radial-gradient(900px 520px at 88% -8%,rgba(124,77,255,.08),transparent 62%),
                      radial-gradient(700px 520px at -5% 42%,rgba(179,136,255,.04),transparent 62%),
                      linear-gradient(180deg,var(--bg1),var(--bg0) 70%);
          background-attachment:fixed; padding:env(safe-area-inset-top,0px) 0 0;
        }
        
        [hidden]{display:none!important}
        button{font:inherit;color:inherit;cursor:pointer}
        p,.sk-d,.ab p,.hint,.none{text-wrap:pretty} h1,h2,h3,.nm,.sk-n,.sw-t{text-wrap:balance}
        :focus-visible{outline:2px solid var(--ice);outline-offset:2px}

        .wrap{position:relative;max-width:1200px;margin:0 auto;padding:18px 16px calc(120px + env(safe-area-inset-bottom,0px))}
        @media(min-width:900px){ .wrapper{font-size:16px} .wrap{padding:28px 28px calc(120px + env(safe-area-inset-bottom,0px))}}

        .fade-enter { animation: fadeEnter 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes fadeEnter { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }

        .head h1{margin:0;font-family:var(--display);font-weight:400;font-size:clamp(36px,9vw,56px);line-height:1.05;color:#fff}
        .head p{margin:4px 0 0;color:var(--muted);font-size:14px}
        .orn{display:flex;align-items:center;gap:10px;margin:16px 0 18px;color:var(--ice)}
        .orn::before,.orn::after{content:"";height:1px;flex:1;background:linear-gradient(90deg,transparent,var(--line),transparent)}
        .orn svg{width:14px;height:14px;fill:currentColor;opacity:.9}

        .hex{ --c:12px;border:0;padding:9px 20px 9px 16px;display:inline-flex;align-items:center;gap:8px;font-weight:600;font-size:14px;color:#0a0a0c; background:linear-gradient(180deg,var(--ice),var(--frost) 55%,var(--muted)); clip-path:polygon(var(--c) 0,calc(100% - var(--c)) 0,100% 50%,calc(100% - var(--c)) 100%,var(--c) 100%,0 50%); min-height:42px;transition:filter .15s; }
        .hex:hover{filter:brightness(1.15)} .hex svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2.2;}

        .chips{display:flex;gap:8px;overflow-x:auto;padding:2px 0 14px;scrollbar-width:none} .chips::-webkit-scrollbar{display:none}
        .chip{flex:none;white-space:nowrap;display:inline-flex;align-items:center;border:1px solid var(--line);background:rgba(124,77,255,.1);border-radius:999px;padding:6px 15px;font-size:13px;color:var(--ice);min-height:36px}
        .chip[aria-pressed="true"]{background:var(--ice);color:#0a0a0c;border-color:var(--ice);font-weight:600}

        .group{margin:0 0 24px}
        .group-h{display:flex;align-items:center;gap:12px;margin:0 0 10px}
        .group-h .n{font-family:var(--sans);font-weight:500;font-size:34px;line-height:1;color:#fff}
        .group-h .t{color:var(--ice);font-weight:500}
        .grid{display:grid;gap:10px;grid-template-columns:1fr;align-items:stretch;}
        @media(min-width:640px){.grid{grid-template-columns:1fr 1fr}} @media(min-width:1000px){.grid{grid-template-columns:1fr 1fr 1fr}}

        .pcols{display:grid;gap:12px;grid-template-columns:1fr;align-items:stretch}
        @media(min-width:700px){.pcols{grid-template-columns:1fr 1fr}} @media(min-width:1040px){.pcols{grid-template-columns:1fr 1fr 1fr}}

        .panel{background:var(--panel);border:1px solid var(--line);border-radius:20px;padding:16px;display:flex;flex-direction:column;}
        .panel h3{margin:0 0 2px;font-size:18px;font-weight:600;color:#fff} .sub{color:var(--muted);font-size:13px}
        
        .mcard{ display:flex;align-items:flex-start;gap:12px;text-align:left;width:100%;height:100%; background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:12px 14px; }
        .mcard .av { margin-top: 2px; }
        .mcard:hover{border-color:var(--ice)}
        .mcard-info { flex: 1; min-width: 0; } 
        .mcard .nm{display:block;font-weight:600;font-size:16px;line-height:1.35;color:#fff;}
        .mcard .meta{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:6px}
        
        .tag{display:inline-flex;align-items:center;white-space:nowrap;font-size:12px;line-height:1.5;padding:2px 10px;border-radius:999px;border:1px solid var(--line);color:var(--ice);background:rgba(124,77,255,.1)}
        .tag.r-spirit{color:#d1d5db;border-color:#6b7280;background:rgba(107,114,128,.15)}
        .none{color:var(--muted);font-size:13px}

        .who{display:flex;align-items:center;gap:14px}
        .av{flex:none;width:52px;height:52px;border-radius:50%;overflow:hidden;border:2px solid rgba(255,255,255,.7);box-shadow:0 0 0 3px rgba(124,77,255,.18)}
        .av img{width:100%;height:100%;object-fit:cover;object-position:50% 18%;display:block}
        .rk{display:flex;align-items:center;gap:10px;font-family:var(--display);font-size:16px;line-height:1.2;color:var(--ice)}
        .rk b{font-family:var(--sans);font-size:32px;font-weight:500;color:#fff;margin:0;line-height:1}

        .ab{display:flex;gap:10px;padding:10px 0;border-top:1px solid var(--line-soft)} .ab:first-of-type{border-top:0}
        .ab::before{content:"";flex:none;width:7px;height:7px;margin-top:9px;transform:rotate(45deg);background:var(--frost);box-shadow:0 0 8px rgba(124,77,255,.3)}
        .ab p{margin:0 0 4px} .ab p:last-child{margin:0}
        .note{font-size:13.5px;padding:6px 12px;border-radius:0 10px 10px 0;margin:6px 0 0}
        .note.warn{color:#d1d5db;background:rgba(107,114,128,.2);border-left:3px solid var(--amber)}
        .note.trait{color:#e5e7eb;background:rgba(124,77,255,.12);border-left:3px solid var(--frost)}
        strong{font-weight:700;color:#fff} u{text-decoration-thickness:1.5px;text-underline-offset:3px}

        .kv{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:9px 0;min-height:44px;border-top:1px solid var(--line-soft)}
        .kv:first-child{border-top:0} .kv span:first-child{color:var(--muted)} .kv b{font-weight:600;text-align:right}
        .sec-h{margin:16px 0 4px;font-size:13px;color:var(--frost);font-weight:600} .sec-h:first-child{margin-top:0}

        .sk{padding:11px 0;border-top:1px solid var(--line-soft)} .sec-h + .sk{border-top:0}
        .sk-h{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
        .sk-n{flex:1;min-width:0;font-weight:600;color:#fff;line-height:1.45;overflow-wrap:break-word}
        .sk-c{flex:none;display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:flex-end;gap:6px}
        .cn{display:inline-flex;align-items:center;gap:5px;white-space:nowrap;padding:2px 11px;border-radius:999px;border:1px solid var(--line);background:rgba(124,77,255,.1);font-size:13.5px;color:#fff}
        .cn em{font-style:normal;color:var(--frost);font-size:12px} .cn b{font-weight:600} .cn small{font-weight:400;color:var(--muted);font-size:12px}
        .sk-d{margin-top:6px;color:var(--muted);font-size:14px;line-height:1.55} .sk-d p{margin:0}
        .sk-d p + p{margin-top:4px} .sk-d em{font-style:normal;color:var(--frost);font-size:12px;margin-right:4px}

        .bar{height:6px;border-radius:6px;background:rgba(124,77,255,.15);overflow:hidden;margin-top:4px}
        .bar i{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,var(--ice),var(--frost))}
        .two{display:grid;grid-template-columns:1fr;gap:14px;margin-top:12px}
        .stat{font-size:13px;color:var(--muted)} .stat b{color:#fff;font-size:16px;margin-left:4px}
        .owners{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
        .owner{display:inline-flex;align-items:center;white-space:nowrap;border:1px solid var(--line);background:rgba(124,77,255,.1);color:var(--ice);border-radius:999px;padding:4px 13px;font-size:13px;}
        .foot{margin-top:18px;text-align:center;font-family:var(--display);font-size:13px;color:var(--muted);letter-spacing:.12em}

        .nav{ position:fixed;left:50%;transform:translateX(-50%);bottom:calc(10px + env(safe-area-inset-bottom,0px)); width:min(620px,calc(100% - 20px));display:flex;justify-content:space-between;gap:2px;padding:6px;z-index:20; background:rgba(23,15,33,.82);backdrop-filter:blur(14px); border:1px solid var(--line);border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.6); }
        .nav button{flex:1;background:none;border:0;border-radius:999px;padding:6px 2px 5px;display:flex;flex-direction:column;align-items:center;gap:1px;color:var(--muted);font-size:10.5px;}
        .nav svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;}
        .nav button[aria-current="true"]{color:#fff;background:linear-gradient(180deg,rgba(124,77,255,.35),rgba(179,136,255,.18));box-shadow:inset 0 0 0 1px var(--line)}

        .pgrid{display:block} #capture.list{background:none;border:0;padding:0}
        #capture.person{background:var(--card-bg);border:1px solid var(--line);border-radius:26px;overflow:hidden;padding:0 0 18px;max-width:600px;margin:0 auto}
        #capture.person.hub-full { max-width: 860px !important; margin: 0 auto; background: none !important; border: none !important; box-shadow: none !important; padding: 0 16px; }
        .hub-view * { font-family: var(--sans) !important; }
        .hub-btn-wrap { text-align: center; margin-bottom: 24px; }
        .hub-btn { display: inline-block; padding: 10px 24px; border-radius: 999px; border: 1px solid var(--line); background: rgba(38,22,54,0.6); color: var(--ice); font-size: 14px; font-weight: 500;}
        .hub-ctrls { background:rgba(38,22,54,.4); border-radius:16px; padding:16px; margin-top:16px; border:1px solid var(--line-soft); }
        .ctrl-grp { margin-bottom:12px; } .ctrl-grp:last-child { margin-bottom:0; }
        .ctrl-grp label { display:block; color:var(--muted); font-size:13px; margin-bottom:4px; }
        .select-css { appearance:none; background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b7a9e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat:no-repeat; background-position:right 12px center; background-size:16px; padding-right:40px; }

        .bar-top{display:flex;justify-content:space-between;align-items:center;max-width:600px;margin:0 auto 12px}
        .back{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:rgba(38,22,54,.9);border-radius:999px;padding:8px 16px 8px 12px;font-size:14px;color:var(--ice);min-height:42px; text-decoration:none;}
        .back svg{width:16px;height:16px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;}
        .hero{position:relative;aspect-ratio:4/5;max-height:640px;width:100%;overflow:hidden;background:#1a1224}
        .hero img{width:100%;height:100%;object-fit:cover;display:block}
        .hero.noimg{aspect-ratio:auto;height:190px;display:grid;place-items:center}
        .hero.noimg .glow{width:96px;height:96px;border-radius:50%;border:3px solid rgba(255,255,255,.75);box-shadow:0 0 0 8px rgba(124,77,255,.15),0 0 40px rgba(124,77,255,.3)}
        .hero::after{content:"";position:absolute;inset:auto 0 0 0;height:55%;background:linear-gradient(180deg,transparent,#0f0a14 92%)}
        .hero-t{position:absolute;left:18px;right:18px;bottom:6px;z-index:2}
        .hero-t h2{margin:0 0 4px;font-family:var(--display);font-weight:400;font-size:clamp(22px,6.4vw,32px);line-height:1.2;color:#fff;}
        .pbody{padding:0 18px}

        @media(min-width:900px){ .pgrid.two{display:grid;grid-template-columns:minmax(0,600px) minmax(0,1fr);gap:24px;align-items:start;} .pgrid.two #capture.person{margin:0} .bar-top{margin:0 0 25px} #calc{margin-top:0!important;} }

        #calc{margin-top:16px} #calc h3{display:flex;align-items:center;gap:8px;font-size:18px} #calc h3 svg{width:20px;height:20px;stroke:var(--frost);fill:none;}
        .hint{color:var(--muted);font-size:13px;margin:2px 0 0}
        .num{width:100%;min-height:44px;background:rgba(38,22,54,.7);border:1px solid var(--line);border-radius:12px;color:#fff;padding:0 12px;font:inherit;font-size:16px}
        .num:disabled{opacity:.4} .num::placeholder{color:rgba(124,77,255,.4)}
        
        .cs{display:grid;grid-template-columns:1fr 104px;gap:10px;align-items:center;border-top:1px solid var(--line-soft);padding:2px 0}
        .cs.cs-fixed { grid-template-columns: 1fr auto; } .sec-h + .cs{border-top:0}
        .fixed-val { font-family: var(--sans); font-size: 16px; font-weight: 600; color: #fff; text-align: right; }
        .fixed-val small { font-size: 12px; color: var(--ice); margin-left: 2px; } .fixed-val.off { opacity: 0.3; }

        .sw{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:48px;cursor:pointer}
        .sw input{position:absolute;opacity:0;pointer-events:none}
        .sw .tg{flex:none;order:-1;width:46px;height:26px;border-radius:99px;background:rgba(124,77,255,.2);border:1px solid var(--line);position:relative;transition:all 0.3s ease}
        .sw .tg::after{content:"";position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:var(--ice);transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.3s ease}
        .sw input:checked + .tg{background:var(--frost)}
        .sw input:checked + .tg::after{transform:translateX(20px);background:#fff}
        .sw .sw-t{flex:1;line-height:1.4} .sw .sw-t small{display:block;color:var(--muted);font-size:12px}

        .bf{display:grid;grid-template-columns:auto 1fr 44px;gap:8px;align-items:center;margin-bottom:8px}
        .seg{display:flex;border:1px solid var(--line);border-radius:12px;overflow:hidden}
        .seg button{border:0;background:none;width:44px;min-height:44px;font-size:20px;color:var(--muted)}
        .seg button[aria-pressed="true"]{background:var(--ice);color:#0a0a0c;}
        .ico{min-height:44px;border:1px solid var(--line);background:none;border-radius:12px;color:var(--muted);display:grid;place-items:center}
        .ico svg{width:16px;height:16px;stroke:currentColor;stroke-width:2;fill:none;}
        .add{margin-top:2px;border:1px dashed var(--line);background:none;border-radius:12px;min-height:44px;width:100%;color:var(--ice)}
        .out{margin-top:18px;border-top:1px solid var(--line);padding-top:14px}
        .st{display:flex;justify-content:space-between;align-items:center;padding:3px 0;font-size:14px;color:var(--muted)} .st b{color:var(--text);font-weight:500}
        .total{display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding:12px 14px;border-radius:16px;background:linear-gradient(160deg,rgba(124,77,255,.28),rgba(179,136,255,.12));border:1px solid var(--line)}
        .total span{color:var(--ice)} .total b{font-family:var(--sans);font-weight:500;font-size:40px;line-height:1;color:#fff;text-shadow:0 0 18px rgba(124,77,255,.5)}

        #demo{margin:0 0 12px;padding:8px 14px;border-radius:12px;background:rgba(179,136,255,.12);border:1px solid rgba(179,136,255,.4);color:var(--ice);font-size:13px}
        #toast{position:fixed;left:50%;bottom:calc(92px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:60;background:#e8dbce;color:#0a0a0c;padding:8px 18px;border-radius:999px;font-size:14px;opacity:0;transition:opacity .2s} #toast.on{opacity:1}
        @media(prefers-reduced-motion:reduce){*{transition:none!important}}
      `}} />

      <div className="wrapper">
        <div className={`human-loader ${!isLoading ? 'fade-out' : ''}`}>
          <div className="ring"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>

        <div className="wrap">
          <div id="demo" hidden>กำลังแสดงข้อมูลตัวอย่าง เนื่องจากยังเชื่อมต่อฐานข้อมูลไม่ได้ (/api/wizard2026)</div>
          <div className="bar-top" id="top" hidden></div>
          <div className="pgrid" id="pgrid">
            <div id="capture"><div id="view"></div></div>
            <aside className="panel" id="calc" hidden></aside>
          </div>
        </div>
        <nav className="nav" id="nav" aria-label="หมวดข้อมูล"></nav>
        <div id="toast" role="status"></div>
      </div>
    </>
  );
}