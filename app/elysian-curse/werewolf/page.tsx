"use client";

import React, { useEffect, useRef, useState } from "react";

export default function WerewolvesPage() {
  const initialized = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const FALLBACK = {
      spirit_powers: [
        { name: 'Eclipse Fang', th_name: 'เขี้ยวคราส', atk_bonus: 5, desc: '> ร่างหมาป่ามีขนาดเท่าเดิม' },
        { name: 'Silverclaw', th_name: 'กรงเล็บเงิน', atk_bonus: 7, desc: '> ร่างหมาป่ามีขนาดเท่าเดิม' },
        { name: 'The Quarter (Half Moon)', th_name: 'จันทร์ครึ่งดวง', atk_bonus: 9, desc: '> ร่างหมาป่ามีขนาดใหญ่กว่าปกติ\n> โจมตีเป้าหมายติดพิษอัมพาต 1 เทิร์น (ใช้ได้ 1 ครั้ง/วัน)' },
        { name: 'Lunarglow', th_name: 'แสงจันทร์นวล', atk_bonus: 12, desc: '> ร่างหมาป่ามีขนาดใหญ่กว่าปกติ\n> โจมตีเป้าหมายติดพิษอัมพาต 1 เทิร์น (ใช้ได้ 2 ครั้ง/วัน)' },
        { name: 'Vollaris (Full Moon)', th_name: 'จันทร์เต็มดวง', atk_bonus: 15, desc: '> ร่างหมาป่ามีขนาดใหญ่กว่าปกติ\n> โจมตีเป้าหมายติดพิษอัมพาต 1 เทิร์น (ใช้ได้ 3 ครั้ง/วัน)\n> พันธะปกป้อง: รับความเจ็บปวดแทนเป้าหมายจนกว่าจะตัดพันธะ (ใช้ได้ 1 ครั้ง/วัน)' }
      ],
      amulets: [
        { amulet_name: 'เครื่องรางเครสเซนต์', abilities: ['ช่วยควบคุมการกลายร่างและคงสติในคืนจันทร์เต็มดวง (ระดับ 0-3 ยังถูกบังคับแปลงร่าง)', 'เพิ่มพลังขึ้น 1 ขั้น', 'สื่อสารกับหมาป่าได้จากทุกร่าง', 'เชื่อมมิติเรียกหมาป่าคู่หูจากป่าปริศนาได้', '! คืนจันทรุปราคา: ไม่ลดขั้น แต่กลายร่างไม่ได้ (เพิ่ม 1 ขั้น)'] },
        { amulet_name: 'เครสเซนต์ คลอว์', abilities: ['ควบคุมการกลายร่างในคืนจันทร์เต็มดวงได้สมบูรณ์ (ทุกระดับไม่ถูกบังคับแปลงร่าง)', 'เพิ่มพลังขึ้น 1 ขั้น', 'สื่อสารกับหมาป่าและสุนัขบ้านได้จากทุกร่าง', 'เพิ่มความทนทานต่อแร่เงินและขับแร่เงินออกจากร่างกายได้', 'คืนจันทรุปราคา: ไม่ลดขั้น กลายร่างได้ปกติ (เพิ่ม 1 ขั้น)'] }
      ],
      levels: [
        { rank_level: "0", rank_name: "หมาป่าฝึกหัด", combat_abilities: {"โจมตีด้วยกรงเล็บและพลังกาย": {"แต้ม/โพสต์": "5"}, "บัพกลุ่ม: เบต้าและโอเมก้า (ร่วมกลุ่ม 2+ คน)": {"Bonus": "2"}, "บัพกลุ่ม: เบต้า (ร่วมฝูงตนเอง 2+ คน)": {"Bonus": "3"}}, utility_abilities: {"ส่งเสียงหอนแจ้งเหตุ": {"การใช้งาน": "เฉพาะร่างมนุษย์ (ต้องโรลเพลย์)"}, "สัญชาตญาณ: หาเบาะแส": {"การใช้งาน": "1 ครั้ง/คน"}, "สัญชาตญาณ: ตามรอยเป้าหมายจากกลิ่น": {"ผลลัพธ์": "ต้องรอการตอบสนอง"}, "สัญชาตญาณ: ดูดซับความเจ็บปวด": {"ผลลัพธ์": "บรรเทาความเจ็บปวดให้อีกฝ่าย"}} },
        { rank_level: "1", rank_name: "หมาป่าแรกเกิด", combat_abilities: {"โจมตีด้วยกรงเล็บและพลังกาย": {"แต้ม/โพสต์": "8"}, "บัพกลุ่ม: เบต้าและโอเมก้า (ร่วมกลุ่ม 2+ คน)": {"Bonus": "3"}, "บัพกลุ่ม: เบต้า (ร่วมฝูงตนเอง 2+ คน)": {"Bonus": "4"}}, utility_abilities: {"ส่งเสียงหอนแจ้งเหตุ": {"การใช้งาน": "เฉพาะร่างมนุษย์ (ต้องโรลเพลย์)"}, "สัญชาตญาณ: หาเบาะแส": {"การใช้งาน": "1 ครั้ง/คน"}, "สัญชาตญาณ: ตามรอยเป้าหมายจากกลิ่น": {"ผลลัพธ์": "ต้องรอการตอบสนอง"}, "สัญชาตญาณ: ดูดซับความเจ็บปวด": {"ผลลัพธ์": "บรรเทาความเจ็บปวดให้อีกฝ่าย"}} },
        { rank_level: "2", rank_name: "หมาป่าเต็มตัว", combat_abilities: {"โจมตีด้วยกรงเล็บและพลังกาย": {"แต้ม/โพสต์": "11"}, "แปลงเป็นร่างมนุษย์หมาป่าเพื่อโจมตี": {"แต้ม/โพสต์": "14", "เงื่อนไข": "บาดแผลเป้าหมายเลือดไหลไม่หยุด"}, "บัพกลุ่ม: เบต้าและโอเมก้า (ร่วมกลุ่ม 2+ คน)": {"Bonus": "4"}, "บัพกลุ่ม: เบต้า (ร่วมฝูงตนเอง 2+ คน)": {"Bonus": "5"}}, utility_abilities: {"ส่งเสียงหอนแจ้งเหตุ": {"การใช้งาน": "เฉพาะร่างมนุษย์"}, "ส่งเสียงคำรามดังรอบตัว": {"ผลลัพธ์": "โจมตีระบบประสาทการได้ยินและระบุตำแหน่งเป้าหมาย"}, "สัญชาตญาณ: หาเบาะแส": {"การใช้งาน": "1 ครั้ง/คน"}, "สัญชาตญาณ: ตามรอยเป้าหมายจากกลิ่น": {"ผลลัพธ์": "ต้องรอการตอบสนอง"}, "สัญชาตญาณ: ดูดซับความเจ็บปวด": {}} },
        { rank_level: "3", rank_name: "นักล่าแห่งพงไพร", combat_abilities: {"โจมตีด้วยกรงเล็บและพลังกาย": {"แต้ม/โพสต์": "16"}, "แปลงเป็นร่างมนุษย์หมาป่าเพื่อโจมตี": {"แต้ม/โพสต์": "19", "เงื่อนไข": "บาดแผลเป้าหมายเลือดไหลไม่หยุด"}, "แปลงเป็นร่างหมาป่าเพื่อโจมตี": {"แต้ม/โพสต์": "20", "เงื่อนไข": "แผลติดเชื้อ/เน่าเปื่อย เคลื่อนไหวเงียบและเร็วมาก"}, "เรียกหมาป่าช่วยโจมตี": {"Bonus": "2"}, "บัพกลุ่ม: เบต้าและโอเมก้า (ร่วมกลุ่ม 2+ คน)": {"Bonus": "5"}, "บัพกลุ่ม: เบต้า (ร่วมฝูงตนเอง 2+ คน)": {"Bonus": "6"}}, utility_abilities: {"ส่งเสียงหอนแจ้งเหตุ": {"การใช้งาน": "ใช้ได้ทุกร่าง"}, "ส่งเสียงคำรามดึงดูดความสนใจ": {"การใช้งาน": "1 ครั้ง/วัน"}, "ส่งเสียงคำรามดังรอบตัว": {"ผลลัพธ์": "ระบุตำแหน่งเป้าหมาย"}, "สัญชาตญาณ: หาเบาะแส": {}, "สัญชาตญาณ: ตามรอยเป้าหมาย": {}, "สัญชาตญาณ: ทิ้งกลิ่นบนตัวเป้าหมาย": {}, "สัญชาตญาณ: สแกนความร้อน": {"การใช้งาน": "ระยะ 5 เมตร"}, "สัญชาตญาณ: รับรู้คลื่นอารมณ์": {"การใช้งาน": "ระยะ 5 เมตร"}} },
        { rank_level: "4", rank_name: "หมาป่าจ่าฝูง", combat_abilities: {"โจมตีด้วยกรงเล็บและพลังกาย": {"แต้ม/โพสต์": "18"}, "แปลงเป็นร่างมนุษย์หมาป่าเพื่อโจมตี": {"แต้ม/โพสต์": "21"}, "แปลงเป็นร่างหมาป่าเพื่อโจมตี": {"แต้ม/โพสต์": "22"}, "โซนิกฮาวล์ (คลื่นเสียงกระแทก)": {"Bonus": "4"}, "เรียกหมาป่าช่วยโจมตี": {"Bonus": "3"}, "บัพกลุ่ม: เบต้าและโอเมก้า (ร่วมกลุ่ม 2+ คน)": {"Bonus": "7"}, "บัพกลุ่ม: เบต้า (ร่วมฝูงตนเอง 2+ คน)": {"Bonus": "8"}}, utility_abilities: {"ส่งเสียงคำรามดึงดูดความสนใจ": {"การใช้งาน": "2 ครั้ง/วัน"}, "ส่งเสียงคำรามข่มขวัญ": {"ผลลัพธ์": "บังคับเป้าหมายที่ซ่อนอยู่เผยตัว"}, "สภาวะคลุ้มคลั่ง": {"ผลลัพธ์": "ปลดล็อกขีดจำกัดร่างกาย (จบอีเวนต์พัก 5 โรลเพลย์)"}, "กำหนดอาณาเขต": {"ผลลัพธ์": "รับรู้ภัยคุกคามรวดเร็ว"}, "สัญชาตญาณ: สแกนความร้อน": {"การใช้งาน": "ระยะ 10 เมตร"}, "สัญชาตญาณ: รับรู้คลื่นอารมณ์": {"การใช้งาน": "ระยะ 10 เมตร"}} },
        { rank_level: "5", rank_name: "ลอร์ดไลแคน", combat_abilities: {"โจมตีด้วยกรงเล็บและพลังกาย": {"แต้ม/โพสต์": "23"}, "แปลงเป็นร่างมนุษย์หมาป่าเพื่อโจมตี": {"แต้ม/โพสต์": "26"}, "แปลงเป็นร่างหมาป่าเพื่อโจมตี": {"แต้ม/โพสต์": "27"}, "เสียงคำรามกระหายเลือด (บัพเพื่อน)": {"Bonus": "5", "เงื่อนไข": "1 คน/อีเวนต์"}, "โซนิกฮาวล์ (คลื่นเสียงกระแทก)": {"Bonus": "4"}, "เรียกหมาป่าช่วยโจมตี": {"Bonus": "4"}, "บัพกลุ่ม: อัลฟ่า (ร่วมกลุ่ม 2+ คน)": {"Bonus": "11"}, "บัพกลุ่ม: อัลฟ่า (ร่วมฝูงตนเอง 2+ คน)": {"Bonus": "12"}}, utility_abilities: {"ส่งเสียงคำรามดึงดูดความสนใจ": {"การใช้งาน": "3 ครั้ง/วัน"}, "สภาวะคลุ้มคลั่ง": {"ผลลัพธ์": "ปลดล็อกขีดจำกัดร่างกาย (จบอีเวนต์พัก 3 โรลเพลย์)"}, "สัญชาตญาณ: สแกนความร้อน": {"การใช้งาน": "ระยะ 20 เมตร"}, "สัญชาตญาณ: รับรู้คลื่นอารมณ์": {"การใช้งาน": "ระยะ 20 เมตร"}} }
      ],
      conditions: [],
      werewolves: [
        ['ตัวอย่าง หมาป่า', 5, 'เครสเซนต์ คลอว์', 'Vollaris (Full Moon)', 'Alpha', 'Silvermoon Pack']
      ].map((a,i)=>({id:i+1, name:a[0], rank_level:String(Number(a[1])), amulet_name:a[2], spirit_power:a[3], ww_class:a[4], pack_name:a[5], image_url:null}))
    };

    const GROUP_NAMES = { combat:'การโจมตี', other:'ความสามารถอื่นๆ' };
    const SKILL_ORDER = [
      'โจมตีด้วยกรงเล็บและพลังกาย', 'แปลงเป็นร่างมนุษย์หมาป่าเพื่อโจมตี', 'แปลงเป็นร่างหมาป่าเพื่อโจมตี',
      'โซนิกฮาวล์ (คลื่นเสียงกระแทก)', 'เสียงคำรามกระหายเลือด (บัพเพื่อน)', 'เรียกหมาป่าช่วยโจมตี',
      'บัพกลุ่ม: อัลฟ่า (ร่วมฝูงตนเอง 2+ คน)', 'บัพกลุ่ม: อัลฟ่า (ร่วมกลุ่ม 2+ คน)',
      'บัพกลุ่ม: เบต้า (ร่วมฝูงตนเอง 2+ คน)', 'บัพกลุ่ม: เบต้าและโอเมก้า (ร่วมกลุ่ม 2+ คน)'
    ];
    const COUNT_ORDER = ['ATK', 'แต้ม/โพสต์', 'Bonus'];  
    const PLAIN_LABELS = ['เงื่อนไข', 'ผลลัพธ์', 'การใช้งาน']; 
    const POWER_UNITS = ['ATK', 'แต้ม/โพสต์', 'Bonus'];              

    const $ = (s: string) => document.querySelector(s) as HTMLElement;
    const esc = (s: any) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c));
    
    const allowHtmlTags = (s: any) => {
        let escaped = esc(s);
        return escaped.replace(/&lt;b&gt;/g, '<b>').replace(/&lt;\/b&gt;/g, '</b>').replace(/&lt;i&gt;/g, '<i>').replace(/&lt;\/i&gt;/g, '</i>');
    };

    const rk = (r: any) => Number(r).toString();
    const rname = (n: any) => (!n || n==='-') ? '' : n;
    const fmt = (x: any) => (Math.round(x*100)/100).toLocaleString('en-US',{maximumFractionDigits:2});
    const toNum = (v: any) => { const x = parseFloat(String(v).replace(',','.')); return isFinite(x) ? x : 0; };
    const SPARK = '<svg viewBox="0 0 24 24"><path d="M12 2L15 10L22 12L15 14L12 22L9 14L2 12L9 10L12 2Z"/></svg>';
    const orn = `<div class="orn">${SPARK}</div>`;
    const ICON: Record<string, string> = {
      save:'<svg viewBox="0 0 24 24"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg>', calc:'<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="3"/><path d="M8 7h8M8 12h2M12 12h2M8 16h2M12 16h2M16 12v4"/></svg>',
      werewolves:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a5.5 5.5 0 0 1-5.5-5.5C6.5 13 9 11 12 11s5.5 2 5.5 4.5A5.5 5.5 0 0 1 12 21Z"/><circle cx="12" cy="5" r="2.5"/><circle cx="17.5" cy="7.5" r="2"/><circle cx="6.5" cy="7.5" r="2"/></svg>', 
      level:'<svg viewBox="0 0 24 24"><path d="M12 3l9 4.5-9 4.5-9-4.5z"/><path d="M3 12l9 4.5 9-4.5"/><path d="M3 16.5L12 21l9-4.5"/></svg>',
      amulet:'<svg viewBox="0 0 24 24"><path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18M9 4l-1 5 4 11 4-11-1-5"/></svg>',
      spirit_power:'<svg viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
    };
    const TABS = [{id:'werewolves', label:'หมาป่า', title:'รายชื่อหมาป่า', en:'Werewolves'},{id:'level', label:'ระดับขั้น', title:'ระดับความสามารถ', en:'Ranks'},{id:'amulet', label:'เครื่องราง', title:'เครื่องรางประจำเผ่าพันธุ์', en:'Amulets'},{id:'spirit_power', label:'จิตวิญญาณ', title:'พลังจิตวิญญาณ', en:'Soulborne Powers'}];

    let DATA: any, tab = 'werewolves', rankFilter = 'all';
    let M: any = {};

    function index(){
      DATA.werewolves.sort((a:any,b:any)=>Number(b.rank_level)-Number(a.rank_level)||a.id-b.id);
      DATA.levels.sort((a:any,b:any)=>Number(b.rank_level)-Number(a.rank_level));
      M.rank = Object.fromEntries(DATA.levels.map((r:any)=>[rk(r.rank_level),r]));
      M.amulet = Object.fromEntries(DATA.amulets.map((a:any)=>[a.amulet_name,a]));
      M.spirit_power = Object.fromEntries(DATA.spirit_powers.map((r:any)=>[r.name,r]));
      M.person = Object.fromEntries(DATA.werewolves.map((p:any)=>[p.id,p]));
      M.person[9999] = { id: 9999, name: 'คำนวณพลังส่วนกลาง', rank_level: '5', spirit_power: 'Vollaris (Full Moon)', amulet_name: 'เครสเซนต์ คลอว์', ww_class: 'Alpha' };
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
    const spiritTag = (r:string) => r ? tag(r,'r-spirit') : '';
    
    // โค้ดสีตกแต่งป้ายชนชั้น
    const classTag = (c:string) => {
        if(!c) return '';
        const cl = c.toLowerCase();
        if(cl === 'alpha' || cl === 'อัลฟ่า') return `<span class="tag" style="color:#c4a962; border-color:rgba(196,169,98,.4); background:rgba(196,169,98,.12)">Alpha</span>`;
        if(cl === 'beta' || cl === 'เบต้า') return `<span class="tag" style="color:#a8b0c0; border-color:rgba(168,176,192,.4); background:rgba(168,176,192,.12)">Beta</span>`;
        return `<span class="tag" style="color:#8a8a93; border-color:rgba(138,138,147,.4); background:rgba(138,138,147,.12)">Omega</span>`;
    };
    const personChip = (p:any) => `<button class="owner" type="button" data-open="${p.id}">${esc(p.name)}</button>`;
    function abilityHTML(text:string){
      return `<div class="ab"><div>${richBlock(text)}</div></div>`;
    }

    const isNum = (v:any) => typeof v==='number' || (typeof v==='string' && /^-?\d+(\.\d+)?$/.test(v.trim()));
    const splitUnit = (k:string) => { const m = String(k).match(/^(.*?)\s*[(（]([^)）]*)[)）]\s*$/); return m ? {base:m[1].trim(), unit:m[2].trim()} : {base:String(k).trim(), unit:''}; };
    const orderIdx = (list:string[],x:string) => { const i = list.findIndex(o=>x.startsWith(o)); return i<0 ? 999 : i; };
    
    function parseSkill(key:string, val:any){
      const s:any = {name:key, details:[], counts:[], power:null};
      if(isNum(val)){ const {base,unit} = splitUnit(key); s.name = base; s.counts.push({label:'', value:Number(val), unit}); }
      else if(val && typeof val==='object'){
        Object.entries(val).forEach(([k,v])=>{
          if(isNum(v)){
            let unit = '';
            let label = k;
            if(POWER_UNITS.includes(k)) {
                unit = k;
                label = '';
            } else {
                const parsed = splitUnit(k);
                label = parsed.base.startsWith('จำนวน') ? '' : parsed.base;
                unit = parsed.unit;
            }
            s.counts.push({label, value:Number(v), unit});
          }
          else if(v!=null && String(v).trim()!=='') s.details.push({label: PLAIN_LABELS.includes(k)?'':k, text:String(v)});
        });
      } else if(val!=null && String(val).trim()!=='') s.details.push({label:'', text:String(val)});
      s.counts.sort((a:any,b:any)=>orderIdx(COUNT_ORDER,a.unit)-orderIdx(COUNT_ORDER,b.unit));
      s.details.sort((a:any,b:any)=>(a.label?1:0)-(b.label?1:0));
      
      const p = s.counts.find((c:any)=>POWER_UNITS.includes(c.unit) && !c.label);
      if(p) s.power = p.value;
      return s;
    }
    
    function skillsOf(r:any){
      const out:any = {combat:[], other:[]};
      if(!r) return out;
      const obj = (v:any) => typeof v==='string' ? (()=>{ try{return JSON.parse(v)}catch(e){return {}} })() : (v||{});
      [['combat',obj(r.combat_abilities)],['other',obj(r.utility_abilities)]].forEach(([g,o])=>{
        out[g as string] = Object.entries(o as Record<string,any>).map(([k,v])=>parseSkill(k,v))
          .sort((a:any,b:any)=>orderIdx(SKILL_ORDER,a.name)-orderIdx(SKILL_ORDER,b.name))
          .map((s:any,i:number)=>({...s,id:g+String(i)}));
      });
      return out;
    }
    const countText = (c:any) => `${c.label?c.label+' ':''}${fmt(c.value)}${c.unit?' '+c.unit:''}`;
    
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
      return ['combat','other'].filter(g=>s[g as keyof typeof s].length).map(g=>`<div class="sec-h">${GROUP_NAMES[g as keyof typeof GROUP_NAMES]}</div>${skillRows(s[g as keyof typeof s])}`).join('')
        || '<div class="none">ไม่มีข้อมูล</div>';
    }
    function head(t:any){
      return `<div class="head"><h1>${esc(t.en)}</h1><p>${esc(t.title)}</p></div>${orn}`;
    }

    function viewWerewolves(){
      const ranks = [...new Set(DATA.werewolves.map((m:any)=>rk(m.rank_level)))];
      const chips = ['all',...ranks].map(r=>`<button class="chip" type="button" data-filter="${r}" aria-pressed="${rankFilter===r}">${r==='all'?'ทั้งหมด':'Rank '+r}</button>`).join('');
      
      const hubBanner = `<div class="hub-btn-wrap"><button type="button" class="hub-btn" data-open="9999">คำนวณพลังส่วนกลาง</button></div>`;

      const list = ranks.filter(r=>rankFilter==='all'||rankFilter===r).map(r=>{
        const people = DATA.werewolves.filter((m:any)=>rk(m.rank_level)===r && m.id !== 9999);
        if(!people.length) return '';
        return `<section class="group"><div class="group-h"><span class="n">${r}</span><span class="t">${esc(rname(M.rank[r as string]?.rank_name))}</span></div>
          <div class="grid">${people.map((m:any)=>`
            <button class="mcard" type="button" data-open="${m.id}">${avatar(m)}
              <span class="mcard-info">
                <span class="nm">${esc(m.name)}</span>
                <span class="meta">
                  ${m.ww_class ? classTag(m.ww_class) : ''}
                  ${m.pack_name ? tag('🐺 '+m.pack_name) : ''}
                  ${m.amulet_name ? tag(m.amulet_name) : ''}
                  ${m.spirit_power ? spiritTag(m.spirit_power) : ''}
                </span>
              </span>
            </button>`).join('')}</div></section>`;
      }).join('');
      return hubBanner + `<div class="chips">${chips}</div>${list}`;
    }
    
    function viewRank(){ return `<div class="pcols">`+DATA.levels.map((r:any)=>`<div class="panel"><div class="who"><div class="rk"><b>${rk(r.rank_level)}</b>Rank</div><h3>${esc(rname(r.rank_name))}</h3></div>${skillBlock(r)}</div>`).join('')+`</div>`; }
    function viewAmulet(){ return `<div class="pcols">`+DATA.amulets.map((a:any)=>{ const wearers = DATA.werewolves.filter((m:any)=>m.amulet_name===a.amulet_name && m.id !== 9999); return `<div class="panel"><h3>${esc(a.amulet_name)}</h3><div class="sub">${a.abilities.length} ความสามารถ</div><div style="margin-top:8px">${a.abilities.map(abilityHTML).join('')}</div><div class="sec-h" style="margin-top:16px;">ผู้สวมใส่ (${wearers.length})</div><div class="owners" style="margin-top:4px">${wearers.map(personChip).join('')||'<span class="none">ยังไม่มี</span>'}</div></div>`; }).join('')+`</div>`; }
    function viewSpiritPower(){ return `<div class="pcols">`+DATA.spirit_powers.map((r:any)=>{ const owners = DATA.werewolves.filter((m:any)=>m.spirit_power===r.name && m.id !== 9999); return `<div class="panel"><h3>${esc(r.name)}${r.th_name ? ` <small style="font-weight:400; color:var(--muted); font-size:14px;">(${esc(r.th_name)})</small>` : ''}</h3><div class="two" style="margin-top: 8px;"><div class="stat">โบนัสพลังโจมตี<b>+${r.atk_bonus}</b><div class="bar atk"><i style="width:${r.atk_bonus/15*100}%"></i></div></div></div>${r.desc ? `<div style="margin-top:12px; font-size:14px; color:var(--muted)">${richBlock(r.desc)}</div>` : ''}<div style="margin-top:16px;"><div class="sec-h">ผู้มีพลังจิตวิญญาณนี้ (${owners.length})</div><div class="owners" style="margin-top:4px">${owners.map(personChip).join('')||'<span class="none">ยังไม่มี</span>'}</div></div></div>`; }).join('')+`</div>`; }

    const VIEWS:any = {werewolves:viewWerewolves,level:viewRank,amulet:viewAmulet,spirit_power:viewSpiritPower};

    function viewPerson(m:any){
      if (m.id === 9999) {
          return `
            <div class="pbody hub-view" style="padding-top: 24px; min-height: 100vh;">
              <h2 style="font-family: var(--sans) !important; font-size: 28px; color: #fff; margin:0 0 6px;">คำนวณพลังส่วนกลาง</h2>
              <p style="color: var(--muted); margin:0 0 24px; font-size: 14px;">(สามารถเลือกข้อมูลเองได้ในกรณีถูกลดขั้นในอิเวนต์)</p>
              <div id="hubCalcArea"></div>
            </div>`;
      }

      const r = M.rank[rk(m.rank_level)], am = M.amulet[m.amulet_name], bl = M.spirit_power[m.spirit_power];
      const hero = m.image_url ? `<div class="hero"><img src="${esc(m.image_url)}" alt="${esc(m.name)}" ${IMG_ATTR}>` : `<div class="hero noimg"><span class="glow" style="background:var(--bg1)"></span>`;
      return hero + `<div class="hero-t"><h2>${esc(m.name)}</h2><div class="rk"><b>${rk(m.rank_level)}</b><span style="font-family: var(--sans);">${esc(rname(r?.rank_name))}</span></div></div></div>
        <div class="pbody">
        ${orn}
        <div class="kv"><span>ชนชั้น</span><b>${m.ww_class ? classTag(m.ww_class) : '<span class="none">-</span>'}</b></div>
        <div class="kv"><span>ฝูง (Pack)</span><b>${m.pack_name ? esc(m.pack_name) : '<span class="none">ไม่มีสังกัด</span>'}</b></div>
        <div class="sec-h" style="margin-top:22px">ความสามารถ (Rank ${rk(m.rank_level)})</div>
        ${skillBlock(r)}
        <div class="sec-h" style="margin-top:22px">พลังจิตวิญญาณ</div>
        ${bl?`<div class="kv"><span>พลังจิตวิญญาณ</span><b>${esc(bl.name)}${bl.th_name ? ` <span style="font-weight:normal; color:var(--muted); font-size:13px">(${esc(bl.th_name)})</span>` : ''}</b></div>
          <div class="kv"><span>โบนัสโจมตี</span><b style="color:var(--ice)">+${bl.atk_bonus} ATK</b></div>${bl.desc ? `<div style="font-size:13.5px; color:var(--muted); margin-top:8px">${richBlock(bl.desc)}</div>` : ''}`
          :'<div class="none">ไม่มีข้อมูลพลังจิตวิญญาณ</div>'}
        <div class="sec-h" style="margin-top:22px">เครื่องราง</div>
        ${am?`<b>${esc(am.amulet_name)}</b>${am.abilities.map(abilityHTML).join('')}`:'<div class="none">ไม่มีเครื่องราง</div>'}
        <div class="foot">Werewolves</div></div>`;
    }

    const calcSkills = (r:any) => skillsOf(r).combat;
    let CALC:any = {pid:null, skills:{}, buffs:[], hubRank:'5', hubClass:'Alpha', hubAmulet:'เครสเซนต์ คลอว์', hubSpiritPower:'Vollaris (Full Moon)', spiritPowerOn: false, packBuffOn: false};
    
    function calcReset(m:any){
      CALC = {pid:m.id, skills:{}, buffs:[], hubRank: CALC.hubRank || '5', hubClass: CALC.hubClass || 'Alpha', hubAmulet: CALC.hubAmulet || 'เครสเซนต์ คลอว์', hubSpiritPower: CALC.hubSpiritPower || 'Vollaris (Full Moon)', spiritPowerOn: false, packBuffOn: false};
      let targetRank = m.id === 9999 ? CALC.hubRank : rk(m.rank_level);
      calcSkills(M.rank[targetRank]).forEach((s:any)=>{ CALC.skills[s.id] = {on:false, power: s.power!=null ? String(s.power) : ''}; });
    }
    
    function calcRun(m:any){
      let isHub = m.id === 9999;
      const targetSpiritPower = isHub ? CALC.hubSpiritPower : m.spirit_power;
      const bl = M.spirit_power[targetSpiritPower], steps = [];
      const targetRank = isHub ? CALC.hubRank : rk(m.rank_level);

      let base = 0;
      calcSkills(M.rank[targetRank]).forEach((s:any)=>{ const c = CALC.skills[s.id]; if(c && c.on) base += toNum(s.power != null ? s.power : c.power); });
      steps.push(['รวมพลังจากสกิลที่เลือก', base]);
      
      let cur = base;
      if(bl && CALC.spiritPowerOn){ cur += bl.atk_bonus; steps.push([`โบนัสพลังจิตวิญญาณ (${targetSpiritPower})`, `+ ${bl.atk_bonus}`]); }
      
      // คำนวณบัพหมาหมู่ +10
      if(CALC.packBuffOn){ cur += 10; steps.push(['บัพพันธมิตร (หมาหมู่)', '+ 10']); }

      CALC.buffs.forEach((b:any)=>{
        if(String(b.v).trim()==='') return;
        const v = toNum(b.v); cur = b.op==='+' ? cur+v : cur*v; steps.push([`บัพ/ดีบัพ ${b.op} ${fmt(v)}`, cur]);
      });
      return {steps, total:cur};
    }
    
    function calcOut(){
      const m = M.person[CALC.pid]; if(!m || !$('#calcOut')) return;
      const {steps,total} = calcRun(m);
      $('#calcOut').innerHTML = steps.map((s:any)=>`<div class="st"><span>${esc(s[0])}</span><b>${s[1].toString().startsWith('+') ? s[1] : fmt(s[1])}</b></div>`).join('') + `<div class="total"><span>พลังโจมตีรวม</span><b>${fmt(total)}</b></div>`;
    }
    
    function calcHTML(m:any){
      let isHub = m.id === 9999;
      let targetRank = isHub ? CALC.hubRank : rk(m.rank_level);
      const sk = calcSkills(M.rank[targetRank]);

      const atkSkills = sk.filter((s:any)=> s.counts.some((c:any)=>c.unit==='แต้ม/โพสต์' || c.unit==='ATK'));
      
      // กรองโบนัสตามชนชั้น (Class)
      const targetClass = isHub ? CALC.hubClass : (m.ww_class || 'Omega');
      const isAlpha = targetClass.toLowerCase() === 'alpha' || targetClass === 'อัลฟ่า';
      const isBeta = targetClass.toLowerCase() === 'beta' || targetClass === 'เบต้า';
      const isOmega = targetClass.toLowerCase() === 'omega' || targetClass === 'โอเมก้า';

      const bonusSkills = sk.filter((s:any)=> {
          if(!s.counts.some((c:any)=>c.unit==='แต้ม/โพสต์' || c.unit==='ATK') && s.counts.some((c:any)=>c.unit==='Bonus')) {
              const n = s.name;
              if(n.includes('อัลฟ่า') && !isAlpha) return false;
              if(n.includes('เบต้าและโอเมก้า') && !(isBeta || isOmega)) return false;
              if(n.includes('บัพกลุ่ม: เบต้า (') && !isBeta) return false;
              return true;
          }
          return false;
      });

      const otherSkills = sk.filter((s:any)=> !s.counts.some((c:any)=>c.unit==='แต้ม/โพสต์' || c.unit==='ATK' || c.unit==='Bonus'));

      const renderCalcSkill = (s:any, isBonus: boolean) => {
          const c = CALC.skills[s.id] || {on:false, power:''};
          const hasPower = s.power != null;
          const foundUnit = s.counts.find((x:any) => POWER_UNITS.includes(x.unit))?.unit || (isBonus ? 'Bonus' : 'ATK');
          let rightSide = '';
          if (hasPower) {
              const displayVal = isBonus ? `+${s.power}` : s.power;
              rightSide = `<div class="fixed-val ${c.on?'':'off'}"><b>${displayVal}</b> <small>${foundUnit}</small></div>`;
          } else { rightSide = `<input class="num" inputmode="decimal" placeholder="แต้ม" data-c="power" data-id="${esc(s.id)}" value="${esc(c.power)}" ${c.on?'':'disabled'}>`; }
          const extraDetails = s.details.filter((d:any)=>d.label==='เงื่อนไข').map((d:any)=>`เงื่อนไข: ${d.text}`);
          return `<div class="cs ${hasPower?'cs-fixed':''}">
              <label class="sw"><input type="checkbox" data-c="skill" data-id="${esc(s.id)}" ${c.on?'checked':''}><span class="tg"></span><span class="sw-t">${esc(s.name)}${extraDetails.length ? `<small>${esc(extraDetails.join(', '))}</small>` : ''}</span></label>
              ${rightSide}</div>`;
      };

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
                    <label>ชนชั้น (Class)</label>
                    <select data-c="hubClass" class="num select-css">
                        <option value="Alpha" ${CALC.hubClass==='Alpha'?'selected':''}>Alpha (อัลฟ่า)</option>
                        <option value="Beta" ${CALC.hubClass==='Beta'?'selected':''}>Beta (เบต้า)</option>
                        <option value="Omega" ${CALC.hubClass==='Omega'?'selected':''}>Omega (โอเมก้า)</option>
                    </select>
                </div>
                <div class="ctrl-grp">
                    <label>พลังจิตวิญญาณ (Spirit Power)</label>
                    <select data-c="hubSpiritPower" class="num select-css">
                        <option value="none">ไม่มีพลังพิเศษ</option>
                        ${DATA.spirit_powers.map((r:any) => `<option value="${r.name}" ${r.name===CALC.hubSpiritPower?'selected':''}>${r.name} (+${r.atk_bonus})</option>`).join('')}
                    </select>
                </div>
                <div class="ctrl-grp">
                    <label>เครื่องรางที่ครอบครอง</label>
                    <select data-c="hubAmulet" class="num select-css">
                        <option value="none">ไม่มีเครื่องราง</option>
                        <option value="เครื่องรางเครสเซนต์" ${CALC.hubAmulet==='เครื่องรางเครสเซนต์'?'selected':''}>เครื่องรางเครสเซนต์</option>
                        <option value="เครสเซนต์ คลอว์" ${CALC.hubAmulet==='เครสเซนต์ คลอว์'?'selected':''}>เครสเซนต์ คลอว์</option>
                    </select>
                </div>
            </div><hr style="border-color:var(--line-soft); margin:18px 0;">`;
      }

      let html = `${isHub?'':`<h3>${ICON.calc}เครื่องคิดเลขพลัง</h3>`}
        <p class="hint">ระบบจะคำนวณแต้มรวมให้อัตโนมัติ เพียงติ๊กเลือกสกิลที่ใช้ในโพสต์นี้</p>${hubControls}`;

      if(atkSkills.length) { html += `<div class="sec-h" style="margin-top:14px">การโจมตี</div><p class="hint" style="margin-bottom:8px">เลือกท่าโจมตีหลักที่ต้องการใช้ (เลือก 1 ท่า)</p>` + atkSkills.map((s:any) => renderCalcSkill(s, false)).join(''); }

      const targetSpiritPower = isHub ? CALC.hubSpiritPower : m.spirit_power;
      const bl = M.spirit_power[targetSpiritPower];
      if (bl && bl.atk_bonus) {
          html += `<div class="sec-h" style="margin-top:14px">โบนัสพลังจิตวิญญาณ</div>
            <div class="cs cs-fixed">
              <label class="sw"><input type="checkbox" data-c="spiritPowerToggle" ${CALC.spiritPowerOn ? 'checked' : ''}><span class="tg"></span><span class="sw-t">พลัง ${esc(bl.name)}</span></label>
              <div class="fixed-val ${CALC.spiritPowerOn ? '' : 'off'}"><b>+${bl.atk_bonus}</b> <small>Bonus</small></div>
            </div>`;
      }

      html += `<div class="sec-h" style="margin-top:14px">บัพพันธมิตรพิเศษ</div>
        <div class="cs cs-fixed">
          <label class="sw">
            <input type="checkbox" data-c="packBuffToggle" ${CALC.packBuffOn ? 'checked' : ''}>
            <span class="tg"></span>
            <span class="sw-t">หมาหมู่ <small>มนุษย์หมาป่ารวมตัวกันมากกว่า 5 คนขึ้นไปและศัตรูมีเพียง 1 คน/ตัว</small></span>
          </label>
          <div class="fixed-val ${CALC.packBuffOn ? '' : 'off'}"><b>+10</b> <small>Bonus</small></div>
        </div>`;

      if(bonusSkills.length) { html += `<div class="sec-h" style="margin-top:14px">การเสริมพลัง (${targetClass})</div><p class="hint" style="margin-bottom:8px">สกิลบัพหรือความสามารถเสริมที่ใช้ร่วมกัน</p>` + bonusSkills.map((s:any) => renderCalcSkill(s, true)).join(''); }
      if(otherSkills.length) { html += `<div class="sec-h" style="margin-top:14px">สกิลอื่นๆ</div>` + otherSkills.map((s:any) => renderCalcSkill(s, false)).join(''); }

      html += `<div class="sec-h" style="margin-top:18px">บัพจากคนอื่น / สถานะพิเศษ (ถ้ามี)</div><p class="hint" style="margin-bottom:8px">กรอกตัวเลขบัพที่ได้รับจากเพื่อน หรือดีบัพ (เช่น × 0.75, + 5)</p>
        ${CALC.buffs.map((b:any,i:number)=>`<div class="bf"><div class="seg" role="group"><button type="button" data-c="op" data-i="${i}" data-op="+" aria-pressed="${b.op==='+'}">+</button><button type="button" data-c="op" data-i="${i}" data-op="×" aria-pressed="${b.op==='×'}">×</button></div><input class="num" inputmode="decimal" placeholder="จำนวน" data-c="buff" data-i="${i}" value="${esc(b.v)}"><button class="ico" type="button" data-c="rmbuff" data-i="${i}"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>`).join('')}
        <button class="add" type="button" data-c="addbuff">+ เพิ่มบัพ</button><div class="out" id="calcOut"></div>`;
      return html;
    }
    
    function renderCalc(){
      const m = M.person[CALC.pid]; if(!m) return;
      if(m.id === 9999) {
          $('#hubCalcArea').innerHTML = calcHTML(m);
      } else {
          $('#calc').innerHTML = calcHTML(m); 
      }
      calcOut();
    }

    let listScroll = 0;
    const personId = () => { const m = location.hash.match(/^#\/m\/(\d+)/); return m ? Number(m[1]) : null; };

    function render(){
      const id = personId(), m = id && M.person[id];
      const cap = $('#capture'), calc = $('#calc');
      const pgrid = $('#pgrid');
      const topbar = $('#top');

      if (!pgrid || !topbar || !cap || !calc || !$('#view') || !$('#nav')) return;
      
      pgrid.classList.remove('fade-enter');
      topbar.classList.remove('fade-enter');
      void pgrid.offsetWidth; 

      if (m){
        pgrid.className = m.id === 9999 ? 'pgrid fade-enter' : 'pgrid two fade-enter';
        cap.className = m.id === 9999 ? 'person hub-full' : 'person';
        topbar.className = 'bar-top fade-enter';
        
        if(m.id === 9999) {
            topbar.innerHTML = `<button class="back" type="button" data-act="back"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>กลับ</button>`;
        } else {
            topbar.innerHTML = `<button class="back" type="button" data-act="back"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>กลับ</button>
              <button class="hex" type="button" data-act="save">${ICON.save}บันทึกภาพ</button>`;
        }

        topbar.hidden = false;
        $('#view').innerHTML = viewPerson(m);
        if(CALC.pid !== m.id) calcReset(m);
        calc.hidden = (m.id === 9999);
        renderCalc();
        document.title = m.name + ' · Werewolf - Elysian Curse 2026';
        window.scrollTo(0,0);
      } else {
        pgrid.className = 'pgrid fade-enter';
        cap.className = 'list';
        topbar.hidden = false;
        topbar.innerHTML = `<a href="/elysian-curse" class="back" style="text-decoration:none;"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>หน้าหลัก</a>`;
        topbar.className = 'bar-top fade-enter';
        calc.hidden = true;

        const t = TABS.find(x => x.id === tab);
        if (!t) return;

        $('#view').innerHTML = head(t) + VIEWS[tab]() + `<div class="foot">${esc(t.en)}</div>`;
        document.title = 'Werewolf - Elysian Curse 2026';
      }

      $('#nav').innerHTML = TABS.map(x=>`<button type="button" data-tab="${x.id}" aria-current="${!m && x.id===tab}">${ICON[x.id] || ICON.calc}<span>${x.label}</span></button>`).join('');
    }

    let toastT: any;
    function toast(msg:string){ const t=$('#toast'); t.textContent=msg; t.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('on'),2200); }
    
    async function saveNode(node:any, name:string){
      try {
        toast('กำลังสร้างภาพ กรุณารอสักครู่…');
        // @ts-ignore
        const htmlToImage = await import('html-to-image');
        if(document.fonts?.ready) await document.fonts.ready;
        
        const imgs = node.querySelectorAll('img');
        const brokenImgs: HTMLImageElement[] = [];
        await Promise.all(Array.from(imgs).map((img: any) => {
          if (img.complete) {
            if (img.naturalWidth === 0) brokenImgs.push(img);
            return Promise.resolve();
          }
          return new Promise(resolve => { 
            img.onload = resolve; 
            img.onerror = () => { brokenImgs.push(img); resolve(null); }; 
          });
        }));

        brokenImgs.forEach((img: HTMLImageElement) => { img.style.display = 'none'; });

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const ratio = isMobile ? 2.5 : Math.max(2, Math.min(4, 16000 / node.scrollHeight));
        
        const originalBorderRadius = node.style.borderRadius;
        const originalBorder = node.style.border;
        node.style.borderRadius = '0';
        node.style.border = 'none';

        const watermark = document.createElement('div');
        watermark.innerHTML = '© vivalavivie 2026';
        watermark.style.cssText = 'text-align: center; color: rgba(168, 176, 192, 0.7); padding: 16px; font-size: 13px; font-family: var(--sans); border-top: 1px dashed rgba(168,176,192,0.2); margin-top: 10px; letter-spacing: 0.5px;';
        
        const pbody = node.querySelector('.pbody');
        const oldFoot = node.querySelector('.foot') as HTMLElement | null;
        if (pbody) pbody.appendChild(watermark);
        if (oldFoot) oldFoot.style.display = 'none';

        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            await htmlToImage.toBlob(node, { pixelRatio: 1, style: { margin: '0' } }).catch(() => {});
        }

        const blob = await htmlToImage.toBlob(node, {
          pixelRatio: ratio, 
          cacheBust: true, 
          backgroundColor: '#0a0a0c',
          style: { margin: '0' }
        });
        
        node.style.borderRadius = originalBorderRadius;
        node.style.border = originalBorder;
        if (pbody && watermark.parentNode === pbody) pbody.removeChild(watermark);
        if (oldFoot) oldFoot.style.display = '';
        brokenImgs.forEach((img: HTMLImageElement) => { img.style.display = ''; });

        if (!blob) { toast('บันทึกภาพไม่สำเร็จ (ไม่พบข้อมูลภาพ)'); return; }

        const safeName = name ? String(name) : 'werewolf';
        const fileName = safeName.replace(/[<>:"/\\|?*]/g, '_') + '.png';

        if (isMobile && navigator.share) {
            try {
                const file = new File([blob], fileName, { type: 'image/png' });
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({ files: [file], title: fileName });
                    toast('แชร์หรือบันทึกภาพเรียบร้อย');
                    return; 
                }
            } catch (err: any) {
                if (err.name === 'AbortError') return;
            }
        }
        
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob); 
        a.download = fileName;
        document.body.appendChild(a); 
        a.click();
        document.body.removeChild(a);
        setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
        toast('บันทึกภาพเรียบร้อย');
      } catch(e:any) {
        if(e && e.name === 'AbortError') return;
        toast('บันทึกภาพไม่สำเร็จ ลองอีกครั้ง');
      }
    }

    document.addEventListener('click', e=>{
      const target = e.target as HTMLElement;
      const t = target.closest('[data-tab],[data-filter],[data-open],[data-act],[data-c]') as HTMLElement;
      if(!t) return;
      const d = t.dataset;
      if(d.c){
        if(d.c==='addbuff'){ CALC.buffs.push({op:'+',v:''}); renderCalc(); }
        else if(d.c==='rmbuff'){ CALC.buffs.splice(Number(d.i),1); renderCalc(); }
        else if(d.c==='op'){ CALC.buffs[Number(d.i)].op = d.op; renderCalc(); }
        return;
      }
      if(d.tab){
        tab = d.tab;
        if (personId()) location.hash = ''; else { 
            window.location.hash = `#/${tab}`;
            render(); 
            window.scrollTo({top:0,behavior:'smooth'}); 
        }
      }
      else if(d.filter){ rankFilter = d.filter; render(); }
      else if(d.open){ if(!personId()) listScroll = window.scrollY; location.hash = '#/m/' + d.open; }
      else if(d.act==='back'){ if(history.length>1) history.back(); else location.hash=''; }
      else if(d.act==='save'){ const m = M.person[personId() as number]; saveNode($('#capture'), m ? m.name : 'werewolves'); }
    });
    
    document.addEventListener('input', e=>{
      const target = e.target as HTMLInputElement;
      const d = target.dataset; if(!d || !d.c) return;
      if(d.c==='power') CALC.skills[d.id as string].power = target.value;
      else if(d.c==='buff') CALC.buffs[Number(d.i)].v = target.value;
      else return;
      calcOut();
    });

    document.addEventListener('change', e=>{
      const target = e.target as HTMLInputElement;
      const d = target.dataset; if(!d || !d.c) return;

      if(d.c==='hubRank') {
          CALC.hubRank = target.value;
          calcReset(M.person[9999]);
          renderCalc();
          return;
      }
      if(d.c==='hubClass') { CALC.hubClass = target.value; renderCalc(); return; }
      if(d.c==='hubSpiritPower') { CALC.hubSpiritPower = target.value; renderCalc(); return; }
      if(d.c==='hubAmulet') { CALC.hubAmulet = target.value; renderCalc(); return; }
      
      // สวิตช์พลังจิตวิญญาณ ปรับให้สมูธ ไม่รีเฟรชหน้าจอ
      if(d.c==='spiritPowerToggle') { 
          CALC.spiritPowerOn = target.checked; 
          target.closest('.cs')?.querySelector('.fixed-val')?.classList.toggle('off', !target.checked);
          calcOut(); 
          return; 
      }
      
      // สวิตช์บัพหมาหมู่ ปรับให้สมูธ ไม่รีเฟรชหน้าจอ
      if(d.c==='packBuffToggle') { 
          CALC.packBuffOn = target.checked; 
          target.closest('.cs')?.querySelector('.fixed-val')?.classList.toggle('off', !target.checked);
          calcOut(); 
          return; 
      }

      if(d.c==='skill'){
        CALC.skills[d.id as string].on = target.checked;
        const inp = document.querySelector(`input[data-c="power"][data-id="${CSS.escape(d.id as string)}"]`) as HTMLInputElement;
        
        if(inp){ 
            inp.disabled = !target.checked; 
            if(target.checked) inp.focus(); 
        } else {
            // กรณีเป็นสกิลแบบแต้มตายตัว ให้สลับคลาส off เพื่อเฟดตัวเลขอย่างนุ่มนวล
            target.closest('.cs')?.querySelector('.fixed-val')?.classList.toggle('off', !target.checked);
        }
        
        calcOut();
        return;
      }
      
      calcOut();
    });

    window.addEventListener('hashchange', ()=>{
      const match = window.location.hash.match(/^#\/([a-z_]+)/);
      if (match && TABS.some(t => t.id === match[1])) {
          tab = match[1];
          render();
          return;
      }
      const onList = !personId();
      render();
      if (onList) window.scrollTo(0, listScroll);
    });

    (async function(){
      try{
        const r = await fetch('/api/werewolf2026'); if(!r.ok) throw new Error(String(r.status));
        DATA = await r.json();
      }catch(e){
        DATA = FALLBACK; $('#demo').hidden = false;
      }
      index(); render();
      setTimeout(() => setIsLoading(false), 600);
    })();

  }, []);

  return (
    <>
      <link rel="icon" type="image/png" href="https://iili.io/n1Xybwu.png" />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300..700&display=swap');
        @import url('https://midsummer-reverie.github.io/font-face/ophelia.css');

        :root{
          --bg0: #0a0a0c; --bg1: #141417;
          --text: #e2e2e5; --muted: #8a8a93; --ice: #a8b0c0; --frost: #7b859a;
          --line: rgba(168,176,192,.2); --line-soft: rgba(168,176,192,.1);
          --amber: #c4a962; --amber-d: #a38947;
          --panel: linear-gradient(160deg,rgba(25,25,30,.7),rgba(15,15,18,.4));
          --card-bg: linear-gradient(165deg,#1c1c20 0%,#141417 55%,#0a0a0c 100%);
          --sans: 'Google Sans','Noto Sans Thai',system-ui,-apple-system,'Segoe UI',sans-serif;
          --display: 'ophelia','Noto Serif Thai',Georgia,serif;
        }
        
        html, body { background-color: var(--bg0); margin: 0; }
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        html{scroll-padding-top:env(safe-area-inset-top,0px)}
        
        .werewolf-loader {
          position: fixed; inset: 0; z-index: 99999;
          background: radial-gradient(circle at 50% 40%, #141417, #0a0a0c 80%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          color: var(--ice); font-family: var(--sans);
          transition: opacity 0.8s ease, visibility 0.8s ease;
        }
        .werewolf-loader.fade-out { opacity: 0; visibility: hidden; }
        .werewolf-loader .ring {
          width: 64px; height: 64px; border: 3px solid rgba(168, 176, 192, 0.1); border-top-color: var(--frost);
          border-radius: 50%; animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          margin-bottom: 20px; box-shadow: 0 0 20px rgba(123, 133, 154, 0.15);
        }
        .werewolf-loader p { font-size: 15px; letter-spacing: 0.05em; animation: pulseText 2s ease-in-out infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulseText { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; text-shadow: 0 0 10px rgba(168, 176, 192, 0.4); } }

        .werewolf-wrapper {
          margin:0;min-height:100dvh;color:var(--text);font-family:var(--sans);font-size:15px;line-height:1.65;
          background: radial-gradient(900px 520px at 88% -8%,rgba(168,176,192,.08),transparent 62%),
                      radial-gradient(700px 520px at -5% 42%,rgba(123,133,154,.04),transparent 62%),
                      linear-gradient(180deg,var(--bg1),var(--bg0) 70%);
          background-attachment:fixed; padding:env(safe-area-inset-top,0px) 0 0;
          word-break:normal;overflow-wrap:break-word;line-break:auto;
        }
        
        [hidden]{display:none!important}
        button{font:inherit;color:inherit;cursor:pointer}
        p,.sk-d,.ab p,.hint,.none{text-wrap:pretty}
        h1,h2,h3,.nm,.sk-n,.sw-t{text-wrap:balance}
        :focus-visible{outline:2px solid var(--ice);outline-offset:2px}

        .wrap{position:relative;max-width:1200px;margin:0 auto;padding:18px 16px calc(120px + env(safe-area-inset-bottom,0px))}
        @media(min-width:900px){ .werewolf-wrapper{font-size:16px} .wrap{padding:28px 28px calc(120px + env(safe-area-inset-bottom,0px))}}

        .fade-enter { animation: fadeEnter 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes fadeEnter { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }

        .head h1{margin:0;font-family:var(--display);font-weight:400;font-size:clamp(36px,9vw,56px);line-height:1.05;letter-spacing:.02em;color:#fff}
        .head p{margin:4px 0 0;color:var(--muted);font-size:14px}
        .orn{display:flex;align-items:center;gap:10px;margin:16px 0 18px;color:var(--ice)}
        .orn::before,.orn::after{content:"";height:1px;flex:1;background:linear-gradient(90deg,transparent,var(--line),transparent)}
        .orn svg{width:14px;height:14px;fill:currentColor;opacity:.9}

        .hex{
          --c:12px;border:0;padding:9px 20px 9px 16px;display:inline-flex;align-items:center;gap:8px;white-space:nowrap;
          font-weight:600;font-size:14px;color:#0a0a0c;
          background:linear-gradient(180deg,var(--ice),var(--frost) 55%,var(--muted));
          clip-path:polygon(var(--c) 0,calc(100% - var(--c)) 0,100% 50%,calc(100% - var(--c)) 100%,var(--c) 100%,0 50%);
          min-height:42px;transition:filter .15s;
        }
        .hex:hover{filter:brightness(1.15)}
        .hex:active{filter:brightness(.85)}
        .hex svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}

        .chips{display:flex;gap:8px;overflow-x:auto;padding:2px 0 14px;scrollbar-width:none}
        .chips::-webkit-scrollbar{display:none}
        .chip{flex:none;white-space:nowrap;display:inline-flex;align-items:center;border:1px solid var(--line);background:rgba(168,176,192,.1);border-radius:999px;padding:6px 15px;font-size:13px;color:var(--ice);min-height:36px}
        .chip[aria-pressed="true"]{background:var(--ice);color:#0a0a0c;border-color:var(--ice);font-weight:600}

        .group{margin:0 0 24px}
        .group-h{display:flex;align-items:center;gap:12px;margin:0 0 10px}
        .group-h .n{font-family:var(--sans);font-weight:500;font-size:34px;line-height:1;color:#fff}
        .group-h .t{color:var(--ice);font-weight:500}
        .grid{display:grid;gap:10px;grid-template-columns:1fr;align-items:stretch;}
        @media(min-width:640px){.grid{grid-template-columns:1fr 1fr}}
        @media(min-width:1000px){.grid{grid-template-columns:1fr 1fr 1fr}}

        .pcols{display:grid;gap:12px;grid-template-columns:1fr;align-items:stretch}
        @media(min-width:700px){.pcols{grid-template-columns:1fr 1fr}}
        @media(min-width:1040px){.pcols{grid-template-columns:1fr 1fr 1fr}}

        .panel{background:var(--panel);border:1px solid var(--line);border-radius:20px;padding:16px;display:flex;flex-direction:column;}
        .panel h3{margin:0 0 2px;font-size:18px;font-weight:600;color:#fff}
        .sub{color:var(--muted);font-size:13px}
        
        .mcard{
          display:flex;align-items:flex-start;gap:12px;text-align:left;width:100%;height:100%;
          background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:12px 14px;
        }
        .mcard:hover{border-color:var(--ice)}
        .mcard-info { flex: 1; min-width: 0; } 
        .mcard .nm{display:block;font-weight:600;font-size:16px;line-height:1.35;color:#fff;overflow-wrap:break-word}
        .mcard .meta{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:6px}
        
        .tag{display:inline-flex;align-items:center;white-space:nowrap;font-size:12px;line-height:1.5;padding:2px 10px;border-radius:999px;border:1px solid var(--line);color:var(--ice);background:rgba(168,176,192,.1)}
        .tag.r-spirit{color:#d1d5db;border-color:#6b7280;background:rgba(107,114,128,.15)}
        .none{color:var(--muted);font-size:13px}

        .who{display:flex;align-items:center;gap:14px}
        .av{flex:none;width:52px;height:52px;border-radius:50%;overflow:hidden;border:2px solid rgba(255,255,255,.7);box-shadow:0 0 0 3px rgba(168,176,192,.18),0 0 14px rgba(123,133,154,.2)}
        .av img{width:100%;height:100%;object-fit:cover;object-position:50% 18%;display:block}
        .rk{display:flex;align-items:center;gap:10px;font-family:var(--display);font-size:16px;line-height:1.2;color:var(--ice)}
        .rk b{font-family:var(--sans);font-size:32px;font-weight:500;color:#fff;margin:0;line-height:1}

        .ab{display:flex;gap:10px;padding:10px 0;border-top:1px solid var(--line-soft)}
        .ab:first-of-type{border-top:0}
        .ab::before{content:"";flex:none;width:7px;height:7px;margin-top:9px;transform:rotate(45deg);background:var(--frost);box-shadow:0 0 8px rgba(123,133,154,.3)}
        .ab p{margin:0 0 4px}
        .ab p:last-child{margin:0}
        .note{font-size:13.5px;padding:6px 12px;border-radius:0 10px 10px 0;margin:6px 0 0}
        .note.warn{color:#d1d5db;background:rgba(107,114,128,.2);border-left:3px solid var(--amber)}
        .note.trait{color:#e5e7eb;background:rgba(168,176,192,.12);border-left:3px solid var(--frost)}
        strong{font-weight:700;color:#fff}
        u{text-decoration-thickness:1.5px;text-underline-offset:3px}
        .ab .sec{color:var(--ice)}

        .kv{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:9px 0;min-height:44px;border-top:1px solid var(--line-soft)}
        .kv:first-child{border-top:0}
        .kv span:first-child{color:var(--muted)}
        .kv b{font-weight:600;text-align:right}
        .sec-h{margin:16px 0 4px;font-size:13px;color:var(--frost);font-weight:600}
        .sec-h:first-child{margin-top:0}

        .sk{padding:11px 0;border-top:1px solid var(--line-soft)}
        .sec-h + .sk{border-top:0}
        .sk-h{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
        .sk-n{flex:1;min-width:0;font-weight:600;color:#fff;line-height:1.45;overflow-wrap:break-word}
        .sk-c{flex:none;display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:flex-end;gap:6px}
        .cn{display:inline-flex;align-items:center;gap:5px;white-space:nowrap;padding:2px 11px;border-radius:999px;border:1px solid var(--line);background:rgba(168,176,192,.1);font-size:13.5px;line-height:1.5;color:#fff}
        .cn em{font-style:normal;color:var(--frost);font-size:12px}
        .cn b{font-weight:600}
        .cn small{font-weight:400;color:var(--muted);font-size:12px}
        .sk-d{margin-top:6px;color:var(--muted);font-size:14px;line-height:1.55}
        .sk-d p{margin:0}
        .sk-d p + p{margin-top:4px}
        .sk-d em{font-style:normal;color:var(--frost);font-size:12px;margin-right:4px}

        .bar{height:6px;border-radius:6px;background:rgba(168,176,192,.15);overflow:hidden;margin-top:4px}
        .bar i{display:block;height:100%;border-radius:6px}
        .bar.atk i{background:linear-gradient(90deg,var(--ice),var(--frost))}
        .two{display:grid;grid-template-columns:1fr;gap:14px;margin-top:12px}
        .stat{font-size:13px;color:var(--muted)}
        .stat b{color:#fff;font-size:16px;margin-left:4px}
        .owners{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
        .owner{display:inline-flex;align-items:center;white-space:nowrap;border:1px solid var(--line);background:rgba(168,176,192,.1);color:var(--ice);border-radius:999px;padding:4px 13px;font-size:13px;min-height:32px}
        .owner:hover{border-color:var(--ice)}
        .foot{margin-top:18px;text-align:center;font-family:var(--display);font-size:13px;color:var(--muted);letter-spacing:.12em}

        .nav{
          position:fixed;left:50%;transform:translateX(-50%);bottom:calc(10px + env(safe-area-inset-bottom,0px));
          width:min(560px,calc(100% - 20px));display:flex;justify-content:space-between;gap:2px;padding:6px;z-index:20;
          background:rgba(20,20,23,.82);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);
          border:1px solid var(--line);border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.6);
        }
        .nav button{flex:1;background:none;border:0;border-radius:999px;padding:7px 2px 6px;display:flex;flex-direction:column;align-items:center;gap:1px;color:var(--muted);font-size:11px;line-height:1.3}
        .nav svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
        .nav button[aria-current="true"]{color:#fff;background:linear-gradient(180deg,rgba(168,176,192,.35),rgba(123,133,154,.18));box-shadow:inset 0 0 0 1px var(--line)}

        .pgrid{display:block}
        #capture.list{background:none;border:0;padding:0}
        #capture.person{background:var(--card-bg);border:1px solid var(--line);border-radius:26px;overflow:hidden;padding:0 0 18px;max-width:600px;margin:0 auto}
        
        #capture.person.hub-full { max-width: 860px !important; margin: 0 auto; background: none !important; border: none !important; box-shadow: none !important; padding: 0 16px; }
        .hub-view * { font-family: var(--sans) !important; }
        .hub-btn-wrap { text-align: center; margin-bottom: 24px; }
        .hub-btn { display: inline-block; padding: 10px 24px; border-radius: 999px; border: 1px solid var(--line); background: rgba(20,20,23,0.6); color: var(--ice); font-size: 14px; font-weight: 500; cursor: pointer; white-space: nowrap; transition: background 0.2s, border-color 0.2s; }
        .hub-btn:hover { background: rgba(168,176,192,0.15); border-color: var(--frost); }
        .hub-ctrls { background:rgba(20,20,23,.4); border-radius:16px; padding:16px; margin-top:16px; border:1px solid var(--line-soft); }
        .ctrl-grp { margin-bottom:12px; } .ctrl-grp:last-child { margin-bottom:0; }
        .ctrl-grp label { display:block; color:var(--muted); font-size:13px; margin-bottom:4px; }
        .select-css { appearance:none; background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238a8a93' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat:no-repeat; background-position:right 12px center; background-size:16px; padding-right:40px; }

        .bar-top{display:flex;justify-content:space-between;align-items:center;max-width:600px;margin:0 auto 12px}
        .back{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:rgba(20,20,23,.9);border-radius:999px;padding:8px 16px 8px 12px;font-size:14px;color:var(--ice);min-height:42px; text-decoration:none;}
        .back svg{width:16px;height:16px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
        .hero{position:relative;aspect-ratio:4/5;max-height:640px;width:100%;overflow:hidden;background:#141417}
        .hero img{width:100%;height:100%;object-fit:cover;object-position:50% 15%;display:block}
        .hero.noimg{aspect-ratio:auto;height:190px;display:grid;place-items:center}
        .hero.noimg .glow{width:96px;height:96px;border-radius:50%;border:3px solid rgba(255,255,255,.75);box-shadow:0 0 0 8px rgba(168,176,192,.15),0 0 40px rgba(123,133,154,.3)}
        .hero::after{content:"";position:absolute;inset:auto 0 0 0;height:55%;background:linear-gradient(180deg,transparent,#0a0a0c 92%)}
        .hero-t{position:absolute;left:18px;right:18px;bottom:6px;z-index:2}
        .hero-t h2{margin:0 0 4px;font-family:var(--display);font-weight:400;font-size:clamp(22px,6.4vw,32px);line-height:1.2;color:#fff;overflow-wrap:break-word;text-shadow:0 2px 14px rgba(0,0,0,.6)}
        .pbody{padding:0 18px}

        @media(min-width:900px){
          .pgrid.two{display:grid;grid-template-columns:minmax(0,600px) minmax(0,1fr);gap:24px;align-items:start}
          .pgrid.two #capture.person{margin:0}
          .bar-top{margin:0 0 25px}
          #calc{position:static; margin-top:0}
        }

        #calc{margin-top:16px}
        #calc h3{display:flex;align-items:center;gap:8px;font-size:18px}
        #calc h3 svg{width:20px;height:20px;stroke:var(--frost);fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
        .hint{color:var(--muted);font-size:13px;margin:2px 0 0}
        .num{width:100%;min-height:44px;background:rgba(20,20,23,.7);border:1px solid var(--line);border-radius:12px;color:#fff;padding:0 12px;font:inherit;font-size:16px}
        .num:disabled{opacity:.4}
        .num::placeholder{color:rgba(168,176,192,.4)}
        
        .cs{display:grid;grid-template-columns:1fr 104px;gap:10px;align-items:center;border-top:1px solid var(--line-soft);padding:2px 0}
        .cs.cs-fixed { grid-template-columns: 1fr auto; }
        .sec-h + .cs{border-top:0}
        
        .fixed-val { font-family: var(--sans); font-size: 16px; font-weight: 600; color: #fff; text-align: right; white-space: nowrap; transition: opacity 0.2s; }
        .fixed-val small { font-size: 12px; color: var(--ice); font-weight: 500; margin-left: 2px; }
        .fixed-val.off { opacity: 0.3; }

        .sw{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:48px;cursor:pointer}
        .sw.line{border-top:1px solid var(--line-soft)}
        .sw input{position:absolute;opacity:0;pointer-events:none}
        .sw .tg{flex:none;order:-1;width:46px;height:26px;border-radius:99px;background:rgba(168,176,192,.2);border:1px solid var(--line);position:relative;transition:background .15s}
        .sw .tg::after{content:"";position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:var(--ice);transition:transform .15s}
        .sw input:checked + .tg{background:var(--frost)}
        .sw input:checked + .tg::after{transform:translateX(20px);background:#fff}
        .sw input:focus-visible + .tg{outline:2px solid var(--ice);outline-offset:2px}
        .sw .sw-t{flex:1;line-height:1.4}
        .sw .sw-t small{display:block;color:var(--muted);font-size:12px}
        .sw.off{opacity:.45;cursor:not-allowed}
        .bf{display:grid;grid-template-columns:auto 1fr 44px;gap:8px;align-items:center;margin-bottom:8px}
        .seg{display:flex;border:1px solid var(--line);border-radius:12px;overflow:hidden}
        .seg button{border:0;background:none;width:44px;min-height:44px;font-size:20px;line-height:1;color:var(--muted)}
        .seg button[aria-pressed="true"]{background:var(--ice);color:#0a0a0c;font-weight:700}
        .ico{min-height:44px;border:1px solid var(--line);background:none;border-radius:12px;color:var(--muted);display:grid;place-items:center}
        .ico svg{width:16px;height:16px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round}
        .add{margin-top:2px;border:1px dashed var(--line);background:none;border-radius:12px;min-height:44px;width:100%;color:var(--ice)}
        .out{margin-top:18px;border-top:1px solid var(--line);padding-top:14px}
        .st{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:3px 0;font-size:14px;color:var(--muted)}
        .st b{color:var(--text);font-weight:500}
        .total{display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding:12px 14px;border-radius:16px;background:linear-gradient(160deg,rgba(168,176,192,.28),rgba(123,133,154,.12));border:1px solid var(--line)}
        .total span{color:var(--ice)}
        .total b{font-family:var(--sans);font-weight:500;font-size:40px;line-height:1.1;color:#fff;text-shadow:0 0 18px rgba(168,176,192,.5)}

        #demo{margin:0 0 12px;padding:8px 14px;border-radius:12px;background:rgba(123,133,154,.12);border:1px solid rgba(123,133,154,.4);color:var(--ice);font-size:13px}
        #toast{position:fixed;left:50%;bottom:calc(92px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:60;background:#e2e2e5;color:#0a0a0c;padding:8px 18px;border-radius:999px;font-size:14px;font-weight:500;opacity:0;pointer-events:none;transition:opacity .2s}
        #toast.on{opacity:1}
        @media(prefers-reduced-motion:reduce){*{transition:none!important}}
      `}} />

      <div className="werewolf-wrapper">
        <div className={`werewolf-loader ${!isLoading ? 'fade-out' : ''}`}>
          <div className="ring"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>

        <div className="wrap">
          <div id="demo" hidden>กำลังแสดงข้อมูลตัวอย่าง เนื่องจากยังเชื่อมต่อฐานข้อมูลไม่ได้ (/api/werewolf2026)</div>
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