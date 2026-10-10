"use client";

import React, { useEffect, useRef, useState } from "react";

export default function VampiresPage() {
  const initialized = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const FALLBACK = {
      bloodlines: [
        { name: 'First Shade', atk_bonus: 4, desc: '' },
        { name: 'Bloodborne', atk_bonus: 6, desc: '' },
        { name: 'Nightbound', atk_bonus: 8, desc: '> สกิลพิเศษ: พลังหยุดนิ่ง (1 เป้าหมาย, 5 นาที)' },
        { name: 'Vermilion Lord', atk_bonus: 10, desc: '> สกิลพิเศษ: พลังหยุดนิ่ง (1 เป้าหมาย, 15 นาที)\n> สกิลพิเศษ: เพลิงนรก (ใช้ได้ 1 ครั้ง/วัน)' },
        { name: 'Noctis Archon', atk_bonus: 13, desc: '> สกิลพิเศษ: พลังหยุดนิ่ง (1-2 เป้าหมาย, 30 นาที)\n> สกิลพิเศษ: เพลิงนรกแบบเสาไฟ (ใช้ได้ 2 ครั้ง/วัน)\n> สกิลพิเศษ: หมอกเงา (ใช้ได้ 2 ครั้ง/วัน)' }
      ],
      amulets: [
        { amulet_name: 'เดย์ไลท์ริง (Daylight Ring)', abilities: ['ปกป้องผู้ครอบครองจากแสงแดด', 'ป้องกันคมเขี้ยวของมนุษย์หมาป่า (บาดแผลไม่เน่าเปื่อย)', '! ไม่สามารถป้องกันบอลแสงของแฟรี่ได้ (ผิวจะไหม้และถูกผลักกระเด็น)'] },
        { amulet_name: 'คริมสัน ธอร์น (Crimson Thorn)', abilities: ['ผสานร่างกายให้กลมกลืนกับเงาได้แม้ท่ามกลางแสงแดด', 'ปกป้องผู้ครอบครองจากแสงแดดและคมเขี้ยวหมาป่า', 'เพิ่มความทนทานต่อแร่เงิน และสามารถขับแร่เงินออกจากร่างกายได้', 'ปลดล็อกทักษะสายพลังเงา', '! ไม่สามารถป้องกันบอลแสงของแฟรี่ได้'] }
      ],
      levels: [
        { rank_level: "0", rank_name: "แวมไพร์ฝึกหัด", combat_abilities: {"โจมตีด้วยเขี้ยว กรงเล็บ และพลังกาย": {"แต้ม/โพสต์": "5"}, "กัดเป้าหมายเพื่อดูดเลือด": {"Bonus": "1", "เงื่อนไข": "เป้าหมายต้องมีเลือด"}}, utility_abilities: {} },
        { rank_level: "1", rank_name: "ผีดิบแรกเกิด", combat_abilities: {"โจมตีด้วยเขี้ยว กรงเล็บ และพลังกาย": {"แต้ม/โพสต์": "7"}, "กัดเป้าหมายเพื่อดูดเลือด": {"Bonus": "2", "เงื่อนไข": "เป้าหมายต้องมีเลือด"}, "ใช้เงาตรึงเป้าหมาย": {"Bonus": "2", "เงื่อนไข": "ต้องสวมใส่ Crimson Thorn"}, "ใช้เงาปกคลุมพื้นที่": {"Bonus": "1", "เงื่อนไข": "ต้องสวมใส่ Crimson Thorn"}}, utility_abilities: {"สะกดจิตให้ทำตามคำสั่ง": {"ผลลัพธ์": "เป้าหมายจะลืมสิ่งที่ถูกสั่ง"}, "แปลงร่างเป็นค้างคาว": {"การใช้งาน": "บิน/หลบหนี/สำรวจ"}} },
        { rank_level: "2", rank_name: "ผู้เดินในเงามืด", combat_abilities: {"โจมตีด้วยเขี้ยว กรงเล็บ และพลังกาย": {"แต้ม/โพสต์": "10"}, "สลายร่างเป็นฝูงค้างคาวเพื่อโจมตี": {"แต้ม/โพสต์": "15"}, "กัดเป้าหมายเพื่อดูดเลือด": {"Bonus": "2", "เงื่อนไข": "เป้าหมายต้องมีเลือด"}, "ดึงเลือดออกจากบาดแผลเป้าหมาย": {"Bonus": "1", "เงื่อนไข": "เป้าหมายต้องมีเลือด"}, "ใช้เงาตรึงเป้าหมาย": {"Bonus": "3", "เงื่อนไข": "ต้องสวมใส่ Crimson Thorn"}, "ใช้เงาปกคลุมพื้นที่": {"Bonus": "2", "เงื่อนไข": "ต้องสวมใส่ Crimson Thorn"}}, utility_abilities: {"สะกดจิตให้ทำตามคำสั่ง": {"ผลลัพธ์": "เป้าหมายจะลืมสิ่งที่ถูกสั่ง"}, "แปลงร่างเป็นค้างคาว หรือ หนู": {"การใช้งาน": "บิน/หลบหนี/ลอบเร้น"}} },
        { rank_level: "3", rank_name: "นักล่ารัตติกาล", combat_abilities: {"โจมตีด้วยเขี้ยว กรงเล็บ และพลังกาย": {"แต้ม/โพสต์": "15"}, "โจมตีด้วยร่างมนุษย์ที่มีปีกค้างคาว": {"แต้ม/โพสต์": "18"}, "สลายร่างเป็นฝูงค้างคาวเพื่อโจมตี": {"แต้ม/โพสต์": "21"}, "กัดเป้าหมายเพื่อดูดเลือด": {"Bonus": "3", "เงื่อนไข": "เป้าหมายต้องมีเลือด"}, "ดึงเลือดออกจากบาดแผลเป้าหมาย": {"Bonus": "2", "เงื่อนไข": "เป้าหมายต้องมีเลือด"}, "ใช้เงาตรึงเป้าหมาย": {"Bonus": "4", "เงื่อนไข": "ต้องสวมใส่ Crimson Thorn"}, "ใช้เงาปกคลุมพื้นที่": {"Bonus": "3", "เงื่อนไข": "ต้องสวมใส่ Crimson Thorn"}}, utility_abilities: {"สะกดจิตให้ทำตามคำสั่ง": {"ผลลัพธ์": "เป้าหมายจะลืมสิ่งที่ถูกสั่ง"}, "ล่อลวงและหว่านเสน่ห์": {"ผลลัพธ์": "เกิดความลุ่มหลง คล้อยตาม"}, "แปลงร่างเป็นค้างคาว หรือ หนู": {}} },
        { rank_level: "4", rank_name: "ขุนนางเลือด", combat_abilities: {"โจมตีด้วยเขี้ยว กรงเล็บ และพลังกาย": {"แต้ม/โพสต์": "17"}, "โจมตีด้วยร่างมนุษย์ที่มีปีกค้างคาว": {"แต้ม/โพสต์": "20"}, "ควบคุมฝูงค้างคาวขนาดกลางเข้าโจมตี": {"แต้ม/โพสต์": "22"}, "สลายร่างเป็นฝูงค้างคาวเพื่อโจมตี": {"แต้ม/โพสต์": "25"}, "กัดเป้าหมายเพื่อดูดเลือด": {"Bonus": "4"}, "ดึงเลือดออกจากบาดแผลเป้าหมาย": {"Bonus": "3"}, "ใช้เงาตรึงเป้าหมาย": {"Bonus": "5", "เงื่อนไข": "ต้องสวมใส่ Crimson Thorn"}, "ใช้เงาปกคลุมพื้นที่": {"Bonus": "4", "เงื่อนไข": "ต้องสวมใส่ Crimson Thorn"}}, utility_abilities: {"สะกดจิตให้ทำตามคำสั่ง": {"ผลลัพธ์": "เป้าหมายจะลืมสิ่งที่ถูกสั่ง"}, "ล่อลวงและหว่านเสน่ห์": {"ผลลัพธ์": "เกิดความลุ่มหลง คล้อยตาม"}, "แผ่บรรยากาศกดดัน": {"ผลลัพธ์": "บังคับให้เป้าหมายที่ซ่อนตัวอยู่เผยตัวออกมา"}, "แปลงร่างเป็นค้างคาว หรือ หนู": {}} },
        { rank_level: "5", rank_name: "ลอร์ดแวมไพร์", combat_abilities: {"โจมตีด้วยเขี้ยว กรงเล็บ และพลังกาย": {"แต้ม/โพสต์": "22"}, "โจมตีด้วยร่างมนุษย์ที่มีปีกค้างคาว": {"แต้ม/โพสต์": "25"}, "ควบคุมฝูงค้างคาวขนาดกลางเข้าโจมตี": {"แต้ม/โพสต์": "30"}, "สลายร่างเป็นฝูงค้างคาวเพื่อโจมตี": {"แต้ม/โพสต์": "32"}, "กัดเป้าหมายเพื่อดูดเลือด": {"Bonus": "5"}, "ดึงเลือดออกจากบาดแผลเป้าหมาย": {"Bonus": "4"}, "สร้างอาวุธจากเลือดของตนเอง": {"Bonus": "10", "เงื่อนไข": "หลังจบอิเวนต์ต้องดื่มเลือด ไม่เช่นนั้นจะป่วย"}, "ใช้เงาตรึงเป้าหมาย": {"Bonus": "6", "เงื่อนไข": "ต้องสวมใส่ Crimson Thorn"}, "ใช้เงาปกคลุมพื้นที่": {"Bonus": "5", "เงื่อนไข": "ต้องสวมใส่ Crimson Thorn"}}, utility_abilities: {"แทรกแซงการรับรู้และสร้างภาพลวงตา": {"ผลลัพธ์": "ทำให้เป้าหมายเห็นสิ่งที่กลัวที่สุด"}, "สะกดจิตให้ทำตามคำสั่ง": {"ผลลัพธ์": "เป้าหมายจะลืมสิ่งที่ถูกสั่ง"}, "ล่อลวงและหว่านเสน่ห์": {}, "แผ่บรรยากาศกดดัน": {}} }
      ],
      conditions: [],
      vampires: [
        ['ตัวอย่าง แวมไพร์', 5, '', 'คริมสัน ธอร์น (Crimson Thorn)', 'Noctis Archon']
      ].map((a,i)=>({id:i+1, name:a[0], rank_level:String(Number(a[1])), amulet_name:a[3], bloodline_name:a[4], image_url:null}))
    };

    const GROUP_NAMES = { combat:'การโจมตี', other:'ความสามารถอื่นๆ' };
    const SKILL_ORDER = [
      'โจมตีด้วยเขี้ยว กรงเล็บ และพลังกาย', 'โจมตีเป้าหมายด้วยเขี้ยวและกรงเล็บ',
      'โจมตีด้วยร่างมนุษย์ที่มีปีกค้างคาว',
      'สลายร่างเป็นฝูงค้างคาวเพื่อโจมตี',
      'ควบคุมฝูงค้างคาวขนาดกลางเข้าโจมตี',
      'กัดเป้าหมายเพื่อดูดเลือด',
      'ดึงเลือดออกจากบาดแผลเป้าหมาย',
      'สร้างอาวุธจากเลือดของตนเอง',
      'ใช้เงาตรึงเป้าหมาย',
      'ใช้เงาปกคลุมพื้นที่'
    ];
    const COUNT_ORDER = ['ATK', 'แต้ม/โพสต์', 'Bonus'];  
    const PLAIN_LABELS = ['เงื่อนไข', 'ผลลัพธ์', 'การใช้งาน']; 
    const POWER_UNITS = ['ATK', 'แต้ม/โพสต์', 'Bonus'];    

    const $ = (s: string) => document.querySelector(s) as HTMLElement;
    const esc = (s: any) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c));
    
    const allowHtmlTags = (s: any) => {
        let escaped = esc(s);
        return escaped
            .replace(/&lt;b&gt;/g, '<b>').replace(/&lt;\/b&gt;/g, '</b>')
            .replace(/&lt;i&gt;/g, '<i>').replace(/&lt;\/i&gt;/g, '</i>');
    };

    const rk = (r: any) => Number(r).toString();
    const rname = (n: any) => (!n || n==='-') ? '' : n;
    const fmt = (x: any) => (Math.round(x*100)/100).toLocaleString('en-US',{maximumFractionDigits:2});
    const toNum = (v: any) => { const x = parseFloat(String(v).replace(',','.')); return isFinite(x) ? x : 0; };
    const SPARK = '<svg viewBox="0 0 24 24"><path d="M12 2L15 10L22 12L15 14L12 22L9 14L2 12L9 10L12 2Z"/></svg>';
    const orn = `<div class="orn">${SPARK}</div>`;
    const ICON: Record<string, string> = {
      save:'<svg viewBox="0 0 24 24"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg>',
      calc:'<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="3"/><path d="M8 7h8M8 12h2M12 12h2M8 16h2M12 16h2M16 12v4"/></svg>',
      vampires:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c-2.3 0-4-1-6-3-1 1-3 1.5-4 1.5S9 8 8 7c-2 2-3.7 3-6 3 2 2 3 5 3 8 1-1 3-2 5-2 1 1 2 2 2 2s1-1 2-2c2 0 4 1 5 2 0-3 1-6 3-8z" /></svg>', 
      level:'<svg viewBox="0 0 24 24"><path d="M12 3l9 4.5-9 4.5-9-4.5z"/><path d="M3 12l9 4.5 9-4.5"/><path d="M3 16.5L12 21l9-4.5"/></svg>',
      amulet:'<svg viewBox="0 0 24 24"><path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18M9 4l-1 5 4 11 4-11-1-5"/></svg>',
      bloodline:'<svg viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
    };
    const TABS = [
      {id:'vampires', label:'แวมไพร์', title:'รายชื่อแวมไพร์', en:'Vampires'},
      {id:'level', label:'ระดับขั้น', title:'ระดับความสามารถ', en:'Ranks'},
      {id:'amulet', label:'เครื่องราง', title:'เครื่องรางประจำเผ่าพันธุ์', en:'Amulets'},
      {id:'bloodline', label:'สายเลือด', title:'พลังในสายเลือด', en:'Bloodborne Power'}
    ];

    let DATA: any, tab = 'vampires', rankFilter = 'all';
    let M: any = {};

    function index(){
      DATA.vampires.sort((a:any,b:any)=>Number(b.rank_level)-Number(a.rank_level)||a.id-b.id);
      DATA.levels.sort((a:any,b:any)=>Number(b.rank_level)-Number(a.rank_level));
      M.rank = Object.fromEntries(DATA.levels.map((r:any)=>[rk(r.rank_level),r]));
      M.amulet = Object.fromEntries(DATA.amulets.map((a:any)=>[a.amulet_name,a]));
      M.bloodline = Object.fromEntries(DATA.bloodlines.map((r:any)=>[r.name,r]));
      M.person = Object.fromEntries(DATA.vampires.map((p:any)=>[p.id,p]));
      
      M.person[9999] = { id: 9999, name: 'คำนวณพลังส่วนกลาง', rank_level: '5', bloodline_name: 'Noctis Archon', amulet_name: 'คริมสัน ธอร์น (Crimson Thorn)' };
      DATA.conditions = DATA.conditions || [];
      
      if (window.location.hash) {
          const match = window.location.hash.match(/^#\/([a-z]+)/);
          if (match && TABS.some(t => t.id === match[1])) tab = match[1];
      }
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
    const bloodlineTag = (r:string) => r ? tag(r,'r-blood') : '';
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

    function viewVampires(){
      const ranks = [...new Set(DATA.vampires.map((m:any)=>rk(m.rank_level)))];
      const chips = ['all',...ranks].map(r=>`<button class="chip" type="button" data-filter="${r}" aria-pressed="${rankFilter===r}">${r==='all'?'ทั้งหมด':'Rank '+r}</button>`).join('');
      
      const hubBanner = `
        <div class="hub-btn-wrap">
            <button type="button" class="hub-btn" data-open="9999">
                คำนวณพลังส่วนกลาง
            </button>
        </div>
      `;

      const list = ranks.filter(r=>rankFilter==='all'||rankFilter===r).map(r=>{
        const people = DATA.vampires.filter((m:any)=>rk(m.rank_level)===r && m.id !== 9999);
        if(!people.length) return '';
        return `<section class="group"><div class="group-h"><span class="n">${r}</span><span class="t">${esc(rname(M.rank[r as string]?.rank_name))}</span></div>
          <div class="grid">${people.map((m:any)=>`
            <button class="mcard" type="button" data-open="${m.id}">${avatar(m)}
              <span class="mcard-info">
                <span class="nm">${esc(m.name)}</span>
                <span class="meta">${m.amulet_name?tag(m.amulet_name):''}${m.bloodline_name?bloodlineTag(m.bloodline_name):''}</span>
              </span>
            </button>`).join('')}</div></section>`;
      }).join('');
      return hubBanner + `<div class="chips">${chips}</div>${list}`;
    }
    
    function viewRank(){
      return `<div class="pcols">`+DATA.levels.map((r:any)=>`<div class="panel">
        <div class="who"><div class="rk"><b>${rk(r.rank_level)}</b>Rank</div><h3>${esc(rname(r.rank_name))}</h3></div>
        ${skillBlock(r)}</div>`).join('')+`</div>`;
    }
    
    function viewAmulet(){
      return `<div class="pcols">`+DATA.amulets.map((a:any)=>{
        const wearers = DATA.vampires.filter((m:any)=>m.amulet_name===a.amulet_name && m.id !== 9999);
        return `<div class="panel"><h3>${esc(a.amulet_name)}</h3><div class="sub">${a.abilities.length} ความสามารถ</div>
          <div style="margin-top:8px">${a.abilities.map(abilityHTML).join('')}</div>
          <div class="sec-h" style="margin-top:16px;">ผู้สวมใส่ (${wearers.length})</div>
          <div class="owners" style="margin-top:4px">${wearers.map(personChip).join('')||'<span class="none">ยังไม่มี</span>'}</div></div>`;
      }).join('')+`</div>`;
    }
    
    function viewBloodline(){
      return `<div class="pcols">`+DATA.bloodlines.map((r:any)=>{
        const owners = DATA.vampires.filter((m:any)=>m.bloodline_name===r.name && m.id !== 9999);
        return `<div class="panel">
          <h3>${esc(r.name)}${r.th_name ? ` <small style="font-weight:400; color:var(--muted); font-size:14px;">(${esc(r.th_name)})</small>` : ''}</h3>
          <div class="two" style="margin-top: 8px;">
            <div class="stat">โบนัสพลังโจมตี<b>+${r.atk_bonus}</b><div class="bar atk"><i style="width:${r.atk_bonus/15*100}%"></i></div></div>
          </div>
          ${r.desc ? `<div style="margin-top:12px; font-size:14px; color:var(--muted)">${richBlock(r.desc)}</div>` : ''}
          <div style="margin-top:16px;">
            <div class="sec-h">ผู้มีสายเลือดนี้ (${owners.length})</div>
            <div class="owners" style="margin-top:4px">${owners.map(personChip).join('')||'<span class="none">ยังไม่มี</span>'}</div>
          </div>
        </div>`;
      }).join('')+`</div>`;
    }

    const VIEWS:any = {vampires:viewVampires,level:viewRank,amulet:viewAmulet,bloodline:viewBloodline};

    function viewPerson(m:any){
      if (m.id === 9999) {
          return `
            <div class="pbody hub-view" style="padding-top: 24px; min-height: 100vh;">
              <h2 style="font-family: var(--sans) !important; font-size: 28px; color: #fff; margin:0 0 6px;">คำนวณพลังส่วนกลาง</h2>
              <p style="color: var(--muted); margin:0 0 24px; font-size: 14px;">(สามารถเลือกข้อมูลเองได้ในกรณีถูกลดขั้นในอิเวนต์)</p>
              <div id="hubCalcArea"></div>
            </div>`;
      }

      const r = M.rank[rk(m.rank_level)], am = M.amulet[m.amulet_name], bl = M.bloodline[m.bloodline_name];
      const hero = m.image_url
        ? `<div class="hero"><img src="${esc(m.image_url)}" alt="${esc(m.name)}" ${IMG_ATTR}>`
        : `<div class="hero noimg"><span class="glow" style="background:#8b0000"></span>`;
      return hero + `<div class="hero-t"><h2>${esc(m.name)}</h2>
          <div class="rk"><b>${rk(m.rank_level)}</b><span style="font-family: var(--sans);">${esc(rname(r?.rank_name))}</span></div></div></div>
        <div class="pbody">
        ${orn}
        <div class="sec-h">ความสามารถ (Rank ${rk(m.rank_level)})</div>
        ${skillBlock(r)}
        <div class="sec-h" style="margin-top:22px">สายเลือด</div>
        ${bl?`<div class="kv"><span>สายเลือด</span><b>${esc(bl.name)}${bl.th_name ? ` <span style="font-weight:normal; color:var(--muted); font-size:13px">(${esc(bl.th_name)})</span>` : ''}</b></div>
          <div class="kv"><span>โบนัสโจมตี</span><b style="color:var(--ice)">+${bl.atk_bonus} ATK</b></div>${bl.desc ? `<div style="font-size:13.5px; color:var(--muted); margin-top:8px">${richBlock(bl.desc)}</div>` : ''}`
          :'<div class="none">ไม่มีข้อมูลสายเลือด</div>'}
        <div class="sec-h" style="margin-top:22px">เครื่องราง</div>
        ${am?`<b>${esc(am.amulet_name)}</b>${am.abilities.map(abilityHTML).join('')}`:'<div class="none">ไม่มีเครื่องราง</div>'}
        <div class="foot">Vampires</div></div>`;
    }

    const calcSkills = (r:any) => skillsOf(r).combat;
    let CALC:any = {pid:null, skills:{}, buffs:[], hubRank:'5', hubAmulet:'คริมสัน ธอร์น (Crimson Thorn)', hubBloodline:'Noctis Archon', bloodlineOn: false};
    
    function calcReset(m:any){
      CALC = {pid:m.id, skills:{}, buffs:[], hubRank: CALC.hubRank || '5', hubAmulet: CALC.hubAmulet || 'คริมสัน ธอร์น (Crimson Thorn)', hubBloodline: CALC.hubBloodline || 'Noctis Archon', bloodlineOn: false};
      let targetRank = m.id === 9999 ? CALC.hubRank : rk(m.rank_level);
      calcSkills(M.rank[targetRank]).forEach((s:any)=>{ CALC.skills[s.id] = {on:false, power: s.power!=null ? String(s.power) : ''}; });
    }
    
    function calcRun(m:any){
      let isHub = m.id === 9999;
      const targetBloodline = isHub ? CALC.hubBloodline : m.bloodline_name;
      const bl = M.bloodline[targetBloodline], steps = [];
      const targetRank = isHub ? CALC.hubRank : rk(m.rank_level);

      let base = 0;
      calcSkills(M.rank[targetRank]).forEach((s:any)=>{ 
        const c = CALC.skills[s.id]; 
        if(c && c.on) base += toNum(s.power != null ? s.power : c.power); 
      });
      steps.push(['รวมพลังจากสกิลที่เลือก', base]);
      
      let cur = base;

      // บวกพลังก็ต่อเมื่อมีการติ๊กเลือกสายเลือด
      if(bl && CALC.bloodlineOn){ 
        cur += bl.atk_bonus; 
        steps.push([`โบนัสสายเลือด (${targetBloodline})`, `+ ${bl.atk_bonus}`]); 
      }

      CALC.buffs.forEach((b:any)=>{
        if(String(b.v).trim()==='') return;
        const v = toNum(b.v);
        cur = b.op==='+' ? cur+v : cur*v;
        steps.push([`บัพ/ดีบัพ ${b.op} ${fmt(v)}`, cur]);
      });
      
      return {steps, total:cur};
    }
    
    function calcOut(){
      const m = M.person[CALC.pid]; if(!m || !$('#calcOut')) return;
      const {steps,total} = calcRun(m);
      $('#calcOut').innerHTML = steps.map((s:any)=>`<div class="st"><span>${esc(s[0])}</span><b>${s[1].toString().startsWith('+') ? s[1] : fmt(s[1])}</b></div>`).join('')
        + `<div class="total"><span>พลังโจมตีรวม</span><b>${fmt(total)}</b></div>`;
    }
    
    function calcHTML(m:any){
      let isHub = m.id === 9999;
      let targetRank = isHub ? CALC.hubRank : rk(m.rank_level);
      const sk = calcSkills(M.rank[targetRank]);

      // ดักจับทั้ง ATK และ แต้ม/โพสต์
      const atkSkills = sk.filter((s:any)=> s.counts.some((c:any)=>c.unit==='แต้ม/โพสต์' || c.unit==='ATK'));
      const bonusSkills = sk.filter((s:any)=> !s.counts.some((c:any)=>c.unit==='แต้ม/โพสต์' || c.unit==='ATK') && s.counts.some((c:any)=>c.unit==='Bonus'));
      const otherSkills = sk.filter((s:any)=> !s.counts.some((c:any)=>c.unit==='แต้ม/โพสต์' || c.unit==='ATK' || c.unit==='Bonus'));

      const renderCalcSkill = (s:any, isBonus: boolean) => {
          const c = CALC.skills[s.id] || {on:false, power:''};
          const hasPower = s.power != null;
          const foundUnit = s.counts.find((x:any) => POWER_UNITS.includes(x.unit))?.unit || (isBonus ? 'Bonus' : 'ATK');

          let rightSide = '';
          if (hasPower) {
              const displayVal = isBonus ? `+${s.power}` : s.power;
              rightSide = `<div class="fixed-val ${c.on?'':'off'}"><b>${displayVal}</b> <small>${foundUnit}</small></div>`;
          } else {
              rightSide = `<input class="num" inputmode="decimal" placeholder="แต้ม" data-c="power" data-id="${esc(s.id)}" value="${esc(c.power)}" ${c.on?'':'disabled'} aria-label="พลังของ ${esc(s.name)}">`;
          }

          const extraDetails = s.details.filter((d:any)=>d.label==='เงื่อนไข').map((d:any)=>`เงื่อนไข: ${d.text}`);

          // เปลี่ยนจาก fixed เป็น cs-fixed ตรงนี้เพื่อไม่ให้ชนกับ Tailwind
          return `
            <div class="cs ${hasPower?'cs-fixed':''}">
              <label class="sw">
                <input type="checkbox" data-c="skill" data-id="${esc(s.id)}" ${c.on?'checked':''}>
                <span class="tg"></span>
                <span class="sw-t">${esc(s.name)}
                   ${extraDetails.length ? `<small>${esc(extraDetails.join(', '))}</small>` : ''}
                </span>
              </label>
              ${rightSide}
            </div>`;
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
                    <label>สายเลือดแวมไพร์ (Bloodline)</label>
                    <select data-c="hubBloodline" class="num select-css">
                        <option value="none">ไม่มีสายเลือดพิเศษ</option>
                        ${DATA.bloodlines.map((r:any) => `<option value="${r.name}" ${r.name===CALC.hubBloodline?'selected':''}>${r.name} (+${r.atk_bonus})</option>`).join('')}
                    </select>
                </div>
                <div class="ctrl-grp">
                    <label>เครื่องรางที่ครอบครอง</label>
                    <select data-c="hubAmulet" class="num select-css">
                        <option value="none">ไม่มีเครื่องราง</option>
                        <option value="เดย์ไลท์ริง (Daylight Ring)" ${CALC.hubAmulet==='เดย์ไลท์ริง (Daylight Ring)'?'selected':''}>เดย์ไลท์ริง (Daylight Ring)</option>
                        <option value="คริมสัน ธอร์น (Crimson Thorn)" ${CALC.hubAmulet==='คริมสัน ธอร์น (Crimson Thorn)'?'selected':''}>คริมสัน ธอร์น (ปลดล็อกสกิลเงา)</option>
                    </select>
                </div>
            </div>
            <hr style="border-color:var(--line-soft); margin:18px 0;">
          `;
      }

      let html = `${isHub?'':`<h3>${ICON.calc}คำนวณพลังโจมตี</h3>`}
        <p class="hint">เลือกสกิลต่อสู้และการเสริมพลังที่ใช้ </p>
        ${hubControls}`;

      if(atkSkills.length) {
          html += `<div class="sec-h" style="margin-top:14px">การโจมตี</div>
                   <p class="hint" style="margin-bottom:8px">เลือกท่าโจมตีหลักที่ต้องการใช้ (เลือก 1 ท่า)</p>`;
          html += atkSkills.map((s:any) => renderCalcSkill(s, false)).join('');
      }

      // --- สร้างปุ่มติ๊กเลือกโบนัสสายเลือด ---
      const targetBloodline = isHub ? CALC.hubBloodline : m.bloodline_name;
      const bl = M.bloodline[targetBloodline];
      if (bl && bl.atk_bonus) {
          html += `
            <div class="sec-h" style="margin-top:14px">โบนัสสายเลือด</div>
            <div class="cs cs-fixed">
              <label class="sw">
                <input type="checkbox" data-c="bloodlineToggle" ${CALC.bloodlineOn ? 'checked' : ''}>
                <span class="tg"></span>
                <span class="sw-t">สายเลือด ${esc(bl.name)}</span>
              </label>
              <div class="fixed-val ${CALC.bloodlineOn ? '' : 'off'}"><b>+${bl.atk_bonus}</b> <small>Bonus</small></div>
            </div>`;
      }
      // ------------------------------------

      if(bonusSkills.length) {
          html += `<div class="sec-h" style="margin-top:14px">การเสริมพลัง</div>
                   <p class="hint" style="margin-bottom:8px">สกิลบัพหรือความสามารถเสริมที่ใช้ร่วมกัน</p>`;
          html += bonusSkills.map((s:any) => renderCalcSkill(s, true)).join('');
      }
      if(otherSkills.length) {
          html += `<div class="sec-h" style="margin-top:14px">สกิลอื่นๆ</div>`;
          html += otherSkills.map((s:any) => renderCalcSkill(s, false)).join('');
      }

      html += `
        <div class="sec-h" style="margin-top:18px">บัพจากคนอื่น / สถานะพิเศษ (ถ้ามี)</div>
        <p class="hint" style="margin-bottom:8px">กรอกตัวเลขบัพที่ได้รับจากเพื่อน หรือดีบัพ (เช่น × 0.75, + 5)</p>
        ${CALC.buffs.map((b:any,i:number)=>`<div class="bf">
          <div class="seg" role="group" aria-label="ชนิดบัพ">
            <button type="button" data-c="op" data-i="${i}" data-op="+" aria-pressed="${b.op==='+'}">+</button>
            <button type="button" data-c="op" data-i="${i}" data-op="×" aria-pressed="${b.op==='×'}">×</button></div>
          <input class="num" inputmode="decimal" placeholder="จำนวน" data-c="buff" data-i="${i}" value="${esc(b.v)}" aria-label="จำนวนบัพ">
          <button class="ico" type="button" data-c="rmbuff" data-i="${i}" aria-label="ลบบัพ"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>`).join('')}
        <button class="add" type="button" data-c="addbuff">+ เพิ่มบัพ</button>
        <div class="out" id="calcOut"></div>`;
        
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
        document.title = m.name + ' · Vampire - Elysian Curse 2026';
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
        document.title = 'Vampire - Elysian Curse 2026';
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
        watermark.style.cssText = 'text-align: center; color: rgba(224, 102, 102, 0.7); padding: 16px; font-size: 13px; font-family: var(--sans); border-top: 1px dashed rgba(224,102,102,0.2); margin-top: 10px; letter-spacing: 0.5px;';
        
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
          backgroundColor: '#0f0707',
          style: { margin: '0' }
        });
        
        node.style.borderRadius = originalBorderRadius;
        node.style.border = originalBorder;
        if (pbody && watermark.parentNode === pbody) pbody.removeChild(watermark);
        if (oldFoot) oldFoot.style.display = '';
        brokenImgs.forEach((img: HTMLImageElement) => { img.style.display = ''; });

        if (!blob) { toast('บันทึกภาพไม่สำเร็จ (ไม่พบข้อมูลภาพ)'); return; }

        const safeName = name ? String(name) : 'vampire';
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
      else if(d.act==='save'){ const m = M.person[personId() as number]; saveNode($('#capture'), m ? m.name : 'vampires'); }
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

      // ส่วนของ Dropdown ที่ต้องรีเฟรชหน้าต่างใหม่
      if(d.c==='hubRank') {
          CALC.hubRank = target.value;
          calcReset(M.person[9999]);
          renderCalc();
          return;
      }
      if(d.c==='hubBloodline') { CALC.hubBloodline = target.value; renderCalc(); return; }
      if(d.c==='hubAmulet') { CALC.hubAmulet = target.value; renderCalc(); return; }
      
      // ส่วนของ Toggle ที่สลับการทำงานแค่ CSS เพื่อความลื่นไหล
      if(d.c==='bloodlineToggle') { 
          CALC.bloodlineOn = target.checked; 
          target.closest('.cs')?.querySelector('.fixed-val')?.classList.toggle('off', !target.checked);
          calcOut(); 
          return; 
      }
      
      if(d.c==='skill'){
        CALC.skills[d.id as string].on = target.checked;
        
        // 1. กรณีเป็นสกิลแบบช่องกรอกตัวเลข
        const inp = document.querySelector(`input[data-c="power"][data-id="${CSS.escape(d.id as string)}"]`) as HTMLInputElement;
        if(inp){ inp.disabled = !target.checked; if(target.checked) inp.focus(); }
        
        // 2. กรณีเป็นสกิลแบบแต้มตายตัว (แสดงผลตัวเลขเลย)
        target.closest('.cs')?.querySelector('.fixed-val')?.classList.toggle('off', !target.checked);
        
        calcOut();
        return;
      }
      
      calcOut();
    });

    window.addEventListener('hashchange', ()=>{
      const match = window.location.hash.match(/^#\/([a-z]+)/);
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
        const r = await fetch('/api/vampire2026'); if(!r.ok) throw new Error(String(r.status));
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
      <link rel="icon" type="image/png" href="https://iili.io/n1hfecJ.png" />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300..700&display=swap');
        @import url('https://midsummer-reverie.github.io/font-face/ophelia.css');

        :root{
          --bg0:#0f0707; --bg1:#1a0f0f;
          --text:#f0e6e6; --muted:#b09090; --ice:#e06666; --frost:#cc4444;
          --line:rgba(224,102,102,.2); --line-soft:rgba(224,102,102,.1);
          --amber:#d93838; --amber-d:#a62b2b;
          --panel:linear-gradient(160deg,rgba(30,15,15,.7),rgba(20,10,10,.4));
          --card-bg:linear-gradient(165deg,#1c1010 0%,#140a0a 55%,#0f0707 100%);
          --sans:'Google Sans','Noto Sans Thai',system-ui,-apple-system,'Segoe UI',sans-serif;
          --display:'ophelia','Noto Serif Thai',Georgia,serif;
        }
        
        html, body { background-color: var(--bg0); margin: 0; }
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        html{scroll-padding-top:env(safe-area-inset-top,0px)}
        
        .vampire-loader {
          position: fixed; inset: 0; z-index: 99999;
          background: radial-gradient(circle at 50% 40%, #1a0f0f, #0f0707 80%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          color: var(--ice); font-family: var(--sans);
          transition: opacity 0.8s ease, visibility 0.8s ease;
        }
        .vampire-loader.fade-out { opacity: 0; visibility: hidden; }
        .vampire-loader .ring {
          width: 64px; height: 64px; border: 3px solid rgba(224, 102, 102, 0.1); border-top-color: var(--frost);
          border-radius: 50%; animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          margin-bottom: 20px; box-shadow: 0 0 20px rgba(204, 68, 68, 0.15);
        }
        .vampire-loader p { font-size: 15px; letter-spacing: 0.05em; animation: pulseText 2s ease-in-out infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulseText { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; text-shadow: 0 0 10px rgba(224, 102, 102, 0.4); } }

        .vampire-wrapper {
          margin:0;min-height:100dvh;color:var(--text);font-family:var(--sans);font-size:15px;line-height:1.65;
          background: radial-gradient(900px 520px at 88% -8%,rgba(204,68,68,.08),transparent 62%),
                      radial-gradient(700px 520px at -5% 42%,rgba(179,45,45,.04),transparent 62%),
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
        @media(min-width:900px){ .vampire-wrapper{font-size:16px} .wrap{padding:28px 28px calc(120px + env(safe-area-inset-bottom,0px))}}

        .fade-enter { animation: fadeEnter 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes fadeEnter { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }

        .head h1{margin:0;font-family:var(--display);font-weight:400;font-size:clamp(36px,9vw,56px);line-height:1.05;letter-spacing:.02em;color:#fff}
        .head p{margin:4px 0 0;color:var(--muted);font-size:14px}
        .orn{display:flex;align-items:center;gap:10px;margin:16px 0 18px;color:var(--ice)}
        .orn::before,.orn::after{content:"";height:1px;flex:1;background:linear-gradient(90deg,transparent,var(--line),transparent)}
        .orn svg{width:14px;height:14px;fill:currentColor;opacity:.9}

        .hex{
          --c:12px;border:0;padding:9px 20px 9px 16px;display:inline-flex;align-items:center;gap:8px;white-space:nowrap;
          font-weight:600;font-size:14px;color:#fff;
          background:linear-gradient(180deg,#e06666,var(--amber) 55%,var(--amber-d));
          clip-path:polygon(var(--c) 0,calc(100% - var(--c)) 0,100% 50%,calc(100% - var(--c)) 100%,var(--c) 100%,0 50%);
          min-height:42px;transition:filter .15s;
        }
        .hex:hover{filter:brightness(1.15)}
        .hex:active{filter:brightness(.85)}
        .hex svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}

        .chips{display:flex;gap:8px;overflow-x:auto;padding:2px 0 14px;scrollbar-width:none}
        .chips::-webkit-scrollbar{display:none}
        .chip{flex:none;white-space:nowrap;display:inline-flex;align-items:center;border:1px solid var(--line);background:rgba(224,102,102,.1);border-radius:999px;padding:6px 15px;font-size:13px;color:var(--ice);min-height:36px}
        .chip[aria-pressed="true"]{background:var(--ice);color:#0f0707;border-color:var(--ice);font-weight:600}

        .group{margin:0 0 24px}
        .group-h{display:flex;align-items:center;gap:12px;margin:0 0 10px}
        .group-h .n{font-family:var(--sans);font-weight:500;font-size:34px;line-height:1;color:#fff}
        .group-h .t{color:var(--ice);font-weight:500}
        .grid{display:grid;gap:10px;grid-template-columns:1fr;align-items:start;}
        @media(min-width:640px){.grid{grid-template-columns:1fr 1fr}}
        @media(min-width:1000px){.grid{grid-template-columns:1fr 1fr 1fr}}

        .pcols{display:grid;gap:12px;grid-template-columns:1fr;align-items:stretch}
        @media(min-width:700px){.pcols{grid-template-columns:1fr 1fr}}
        @media(min-width:1040px){.pcols{grid-template-columns:1fr 1fr 1fr}}

        .panel{background:var(--panel);border:1px solid var(--line);border-radius:20px;padding:16px;display:flex;flex-direction:column;}
        .panel h3{margin:0 0 2px;font-size:18px;font-weight:600;color:#fff}
        .sub{color:var(--muted);font-size:13px}
        .mcard{
          display:flex;align-items:center;gap:12px;text-align:left;width:100%;
          background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:12px 14px;
        }
        .mcard:hover{border-color:var(--ice)}
        .mcard-info { flex: 1; min-width: 0; } 
        .mcard .nm{display:block;font-weight:600;font-size:16px;line-height:1.35;color:#fff;overflow-wrap:break-word}
        .mcard .meta{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:6px}
        
        .tag{display:inline-flex;align-items:center;white-space:nowrap;font-size:12px;line-height:1.5;padding:2px 10px;border-radius:999px;border:1px solid var(--line);color:var(--ice);background:rgba(224,102,102,.1)}
        .tag.r-blood{color:#e6b3b3;border-color:#b33333;background:rgba(204,68,68,.15)}
        .none{color:var(--muted);font-size:13px}

        .who{display:flex;align-items:center;gap:14px}
        .av{flex:none;width:52px;height:52px;border-radius:50%;overflow:hidden;border:2px solid rgba(255,255,255,.7);box-shadow:0 0 0 3px rgba(224,102,102,.18),0 0 14px rgba(204,68,68,.2)}
        .av img{width:100%;height:100%;object-fit:cover;object-position:50% 18%;display:block}
        .rk{display:flex;align-items:center;gap:10px;font-family:var(--display);font-size:16px;line-height:1.2;color:var(--ice)}
        .rk b{font-family:var(--sans);font-size:32px;font-weight:500;color:#fff;margin:0;line-height:1}

        .ab{display:flex;gap:10px;padding:10px 0;border-top:1px solid var(--line-soft)}
        .ab:first-of-type{border-top:0}
        .ab::before{content:"";flex:none;width:7px;height:7px;margin-top:9px;transform:rotate(45deg);background:var(--frost);box-shadow:0 0 8px rgba(204,68,68,.3)}
        .ab p{margin:0 0 4px}
        .ab p:last-child{margin:0}
        .note{font-size:13.5px;padding:6px 12px;border-radius:0 10px 10px 0;margin:6px 0 0}
        .note.warn{color:#e6b3b3;background:rgba(179,45,45,.2);border-left:3px solid var(--amber)}
        .note.trait{color:#e6cccc;background:rgba(224,102,102,.12);border-left:3px solid var(--frost)}
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
        .cn{display:inline-flex;align-items:center;gap:5px;white-space:nowrap;padding:2px 11px;border-radius:999px;border:1px solid var(--line);background:rgba(224,102,102,.1);font-size:13.5px;line-height:1.5;color:#fff}
        .cn em{font-style:normal;color:var(--frost);font-size:12px}
        .cn b{font-weight:600}
        .cn small{font-weight:400;color:var(--muted);font-size:12px}
        .sk-d{margin-top:6px;color:var(--muted);font-size:14px;line-height:1.55}
        .sk-d p{margin:0}
        .sk-d p + p{margin-top:4px}
        .sk-d em{font-style:normal;color:var(--frost);font-size:12px;margin-right:4px}

        .bar{height:6px;border-radius:6px;background:rgba(224,102,102,.15);overflow:hidden;margin-top:4px}
        .bar i{display:block;height:100%;border-radius:6px}
        .bar.atk i{background:linear-gradient(90deg,#e06666,#e6b3b3)}
        .two{display:grid;grid-template-columns:1fr;gap:14px;margin-top:12px}
        .stat{font-size:13px;color:var(--muted)}
        .stat b{color:#fff;font-size:16px;margin-left:4px}
        .owners{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
        .owner{display:inline-flex;align-items:center;white-space:nowrap;border:1px solid var(--line);background:rgba(224,102,102,.1);color:var(--ice);border-radius:999px;padding:4px 13px;font-size:13px;min-height:32px}
        .owner:hover{border-color:var(--ice)}
        .foot{margin-top:18px;text-align:center;font-family:var(--display);font-size:13px;color:var(--muted);letter-spacing:.12em}

        .nav{
          position:fixed;left:50%;transform:translateX(-50%);bottom:calc(10px + env(safe-area-inset-bottom,0px));
          width:min(560px,calc(100% - 20px));display:flex;justify-content:space-between;gap:2px;padding:6px;z-index:20;
          background:rgba(26,15,15,.82);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);
          border:1px solid var(--line);border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.6);
        }
        .nav button{flex:1;background:none;border:0;border-radius:999px;padding:7px 2px 6px;display:flex;flex-direction:column;align-items:center;gap:1px;color:var(--muted);font-size:11px;line-height:1.3}
        .nav svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
        .nav button[aria-current="true"]{color:#fff;background:linear-gradient(180deg,rgba(224,102,102,.35),rgba(204,68,68,.18));box-shadow:inset 0 0 0 1px var(--line)}

        .pgrid{display:block}
        #capture.list{background:none;border:0;padding:0}
        #capture.person{background:var(--card-bg);border:1px solid var(--line);border-radius:26px;overflow:hidden;padding:0 0 18px;max-width:600px;margin:0 auto}
        
        #capture.person.hub-full { max-width: 860px !important; margin: 0 auto; background: none !important; border: none !important; box-shadow: none !important; padding: 0 16px; }
        .hub-view * { font-family: var(--sans) !important; }
        .hub-btn-wrap { text-align: center; margin-bottom: 24px; }
        .hub-btn { display: inline-block; padding: 10px 24px; border-radius: 999px; border: 1px solid var(--line); background: rgba(26,15,15,0.6); color: var(--ice); font-size: 14px; font-weight: 500; cursor: pointer; white-space: nowrap; transition: background 0.2s, border-color 0.2s; }
        .hub-btn:hover { background: rgba(224,102,102,0.15); border-color: var(--frost); }
        .hub-ctrls { background:rgba(26,15,15,.4); border-radius:16px; padding:16px; margin-top:16px; border:1px solid var(--line-soft); }
        .ctrl-grp { margin-bottom:12px; } .ctrl-grp:last-child { margin-bottom:0; }
        .ctrl-grp label { display:block; color:var(--muted); font-size:13px; margin-bottom:4px; }
        .select-css { appearance:none; background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b09090' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat:no-repeat; background-position:right 12px center; background-size:16px; padding-right:40px; }

        .bar-top{display:flex;justify-content:space-between;align-items:center;max-width:600px;margin:0 auto 12px}
        .back{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:rgba(26,15,15,.9);border-radius:999px;padding:8px 16px 8px 12px;font-size:14px;color:var(--ice);min-height:42px; text-decoration:none;}
        .back svg{width:16px;height:16px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
        .hero{position:relative;aspect-ratio:4/5;max-height:640px;width:100%;overflow:hidden;background:#1a0f0f}
        .hero img{width:100%;height:100%;object-fit:cover;object-position:50% 15%;display:block}
        .hero.noimg{aspect-ratio:auto;height:190px;display:grid;place-items:center}
        .hero.noimg .glow{width:96px;height:96px;border-radius:50%;border:3px solid rgba(255,255,255,.75);box-shadow:0 0 0 8px rgba(224,102,102,.15),0 0 40px rgba(204,68,68,.3)}
        .hero::after{content:"";position:absolute;inset:auto 0 0 0;height:55%;background:linear-gradient(180deg,transparent,#140a0a 92%)}
        .hero-t{position:absolute;left:18px;right:18px;bottom:6px;z-index:2}
        .hero-t h2{margin:0 0 4px;font-family:var(--display);font-weight:400;font-size:clamp(22px,6.4vw,32px);line-height:1.2;color:#fff;overflow-wrap:break-word;text-shadow:0 2px 14px rgba(0,0,0,.6)}
        .pbody{padding:0 18px}
        .swatch{display:inline-flex;align-items:center;gap:8px;text-transform: uppercase}
        .swatch i{width:14px;height:14px;border-radius:50%;border:1.5px solid rgba(255,255,255,.8)}

        @media(min-width:900px){
          .pgrid.two{display:grid;grid-template-columns:minmax(0,600px) minmax(0,1fr);gap:24px;align-items:start}
          .pgrid.two #capture.person{margin:0}
          .bar-top{margin:0 0 25px}
          /* ลบ position: sticky และ top ทิ้งไปเลย เพื่อให้แสดงผลและเลื่อนตามปกติ */
          #calc{margin-top:0}
        }

        #calc{margin-top:16px}
        #calc h3{display:flex;align-items:center;gap:8px;font-size:18px}
        #calc h3 svg{width:20px;height:20px;stroke:var(--frost);fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
        .hint{color:var(--muted);font-size:13px;margin:2px 0 0}
        .num{width:100%;min-height:44px;background:rgba(26,15,15,.7);border:1px solid var(--line);border-radius:12px;color:#fff;padding:0 12px;font:inherit;font-size:16px}
        .num:disabled{opacity:.4}
        .num::placeholder{color:rgba(224,102,102,.4)}
        
        .cs{display:grid;grid-template-columns:1fr 104px;gap:10px;align-items:center;border-top:1px solid var(--line-soft);padding:2px 0}
        /* เปลี่ยนชื่อคลาสเป็น .cs-fixed */
        .cs.cs-fixed { grid-template-columns: 1fr auto; }
        .sec-h + .cs{border-top:0}
        
        .fixed-val { font-family: var(--sans); font-size: 16px; font-weight: 600; color: #fff; text-align: right; white-space: nowrap; transition: opacity 0.2s; }
        .fixed-val small { font-size: 12px; color: var(--ice); font-weight: 500; margin-left: 2px; }
        .fixed-val.off { opacity: 0.3; }

        .sw{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:48px;cursor:pointer}
        .sw.line{border-top:1px solid var(--line-soft)}
        .sw input{position:absolute;opacity:0;pointer-events:none}
        .sw .tg{flex:none;order:-1;width:46px;height:26px;border-radius:99px;background:rgba(224,102,102,.2);border:1px solid var(--line);position:relative;transition:background .15s}
        .sw .tg::after{content:"";position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:#e6b3b3;transition:transform .15s}
        .sw input:checked + .tg{background:var(--frost)}
        .sw input:checked + .tg::after{transform:translateX(20px);background:#fff}
        .sw input:focus-visible + .tg{outline:2px solid var(--ice);outline-offset:2px}
        .sw .sw-t{flex:1;line-height:1.4}
        .sw .sw-t small{display:block;color:var(--muted);font-size:12px}
        .sw.off{opacity:.45;cursor:not-allowed}
        .bf{display:grid;grid-template-columns:auto 1fr 44px;gap:8px;align-items:center;margin-bottom:8px}
        .seg{display:flex;border:1px solid var(--line);border-radius:12px;overflow:hidden}
        .seg button{border:0;background:none;width:44px;min-height:44px;font-size:20px;line-height:1;color:var(--muted)}
        .seg button[aria-pressed="true"]{background:var(--ice);color:#0f0707;font-weight:700}
        .ico{min-height:44px;border:1px solid var(--line);background:none;border-radius:12px;color:var(--muted);display:grid;place-items:center}
        .ico svg{width:16px;height:16px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round}
        .add{margin-top:2px;border:1px dashed var(--line);background:none;border-radius:12px;min-height:44px;width:100%;color:var(--ice)}
        .out{margin-top:18px;border-top:1px solid var(--line);padding-top:14px}
        .st{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:3px 0;font-size:14px;color:var(--muted)}
        .st b{color:var(--text);font-weight:500}
        .total{display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding:12px 14px;border-radius:16px;background:linear-gradient(160deg,rgba(224,102,102,.28),rgba(179,45,45,.12));border:1px solid var(--line)}
        .total span{color:var(--ice)}
        .total b{font-family:var(--sans);font-weight:500;font-size:40px;line-height:1.1;color:#fff;text-shadow:0 0 18px rgba(224,102,102,.5)}

        #demo{margin:0 0 12px;padding:8px 14px;border-radius:12px;background:rgba(204,68,68,.12);border:1px solid rgba(204,68,68,.4);color:#e6b3b3;font-size:13px}
        #toast{position:fixed;left:50%;bottom:calc(92px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:60;background:#f0e6e6;color:#0f0707;padding:8px 18px;border-radius:999px;font-size:14px;font-weight:500;opacity:0;pointer-events:none;transition:opacity .2s}
        #toast.on{opacity:1}
        @media(prefers-reduced-motion:reduce){*{transition:none!important}}
      `}} />

      <div className="vampire-wrapper">
        <div className={`vampire-loader ${!isLoading ? 'fade-out' : ''}`}>
          <div className="ring"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>

        <div className="wrap">
          <div id="demo" hidden>กำลังแสดงข้อมูลตัวอย่าง เพราะยังเชื่อมต่อฐานข้อมูลไม่ได้ (/api/vampire2026)</div>
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