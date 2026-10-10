"use client";

import React, { useEffect, useRef, useState } from "react";

export default function HumansPage() {
  const initialized = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const FALLBACK = {
      weapon_tiers: [
        { name: 'Copper', bonus_rank3: 0, bonus_rank4: 1 },
        { name: 'Silver', bonus_rank3: 2, bonus_rank4: 2 },
        { name: 'Gold', bonus_rank3: 3, bonus_rank4: 4 },
        { name: 'Diamond', bonus_rank3: 4, bonus_rank4: 8 },
        { name: 'Elythuim', bonus_rank3: 5, bonus_rank4: 15 }
      ],
      amulets: [
        { amulet_name: 'เครื่องรางนาฬิกาอนันต์', abilities: ['ป้องกันพลังมุ่งร้าย (เฉพาะลำดับขั้นเดียวกันและต่ำกว่า)', 'บิดเบือนกาลเวลา: ย้อนการตัดสินใจ 1 เทิร์น (ติดมึนงง 1 เทิร์น)', 'เกราะกำบังล่องหน: กันตาย 1 ครั้ง (รอประจุ 3 วัน)', 'คลังอาวุธมิติ: เรียกอาวุธจากความว่างเปล่าได้'] }
      ],
      levels: [
        { rank_level: "0", rank_name: "คนธรรมดา", combat_abilities: {"โจมตีด้วยอาวุธระยะประชิด": {"แต้ม/โพสต์": "1"}}, utility_abilities: {} },
        { rank_level: "3", rank_name: "นักล่ามือฉกาจ", combat_abilities: {"โจมตีด้วยอาวุธ (ประชิด/ปืน)": {"แต้ม/โพสต์": "5"}}, utility_abilities: {} },
        { rank_level: "4", rank_name: "ผู้เชี่ยวชาญ", combat_abilities: {"โจมตีด้วยอาวุธ (ประชิด/ปืน)": {"แต้ม/โพสต์": "12"}}, utility_abilities: {} }
      ],
      conditions: [],
      humans: [
        ['ตัวอย่าง มนุษย์', 4, 'เครื่องรางนาฬิกาอนันต์', 'Elythuim', 'ช่างซ่อมบำรุง']
      ].map((a,i)=>({id:i+1, name:a[0], rank_level:String(Number(a[1])), amulet_name:a[2], weapon_tier:a[3], profession:a[4], image_url:null}))
    };

    const GROUP_NAMES = { combat:'การโจมตี', other:'ความสามารถอื่นๆ' };
    const SKILL_ORDER = ['โจมตีด้วยอาวุธระยะประชิด', 'โจมตีด้วยอาวุธ (ประชิด/ปืน)'];
    const COUNT_ORDER = ['ATK', 'แต้ม/โพสต์', 'Bonus'];  
    const PLAIN_LABELS = ['เงื่อนไข', 'ผลลัพธ์', 'การใช้งาน']; 
    const POWER_UNITS = ['ATK', 'แต้ม/โพสต์', 'Bonus'];              

    const $ = (s: string) => document.querySelector(s) as HTMLElement;
    const esc = (s: any) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c));
    const allowHtmlTags = (s: any) => esc(s).replace(/&lt;b&gt;/g, '<b>').replace(/&lt;\/b&gt;/g, '</b>').replace(/&lt;i&gt;/g, '<i>').replace(/&lt;\/i&gt;/g, '</i>');

    const rk = (r: any) => Number(r).toString();
    const rname = (n: any) => (!n || n==='-') ? '' : n;
    const fmt = (x: any) => (Math.round(x*100)/100).toLocaleString('en-US',{maximumFractionDigits:2});
    const toNum = (v: any) => { const x = parseFloat(String(v).replace(',','.')); return isFinite(x) ? x : 0; };
    const SPARK = '<svg viewBox="0 0 24 24"><path d="M12 2L15 10L22 12L15 14L12 22L9 14L2 12L9 10L12 2Z"/></svg>';
    const orn = `<div class="orn">${SPARK}</div>`;
    
    const ICON: Record<string, string> = {
      save:'<svg viewBox="0 0 24 24"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg>', 
      calc:'<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="3"/><path d="M8 7h8M8 12h2M12 12h2M8 16h2M12 16h2M16 12v4"/></svg>',
      sapiens:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20M12 8a4 4 0 1 0 0 8 4 4 0 1 0 0-8z"/></svg>', 
      level:'<svg viewBox="0 0 24 24"><path d="M12 3l9 4.5-9 4.5-9-4.5z"/><path d="M3 12l9 4.5 9-4.5"/><path d="M3 16.5L12 21l9-4.5"/></svg>',
      amulet:'<svg viewBox="0 0 24 24"><path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18M9 4l-1 5 4 11 4-11-1-5"/></svg>',
      weapon_tier:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2"/></svg>'
    };
    const TABS = [{id:'sapiens', label:'มนุษย์', title:'รายชื่อมนุษย์', en:'Sapiens'},{id:'level', label:'ระดับขั้น', title:'ระดับความสามารถ', en:'Ranks'},{id:'amulet', label:'เครื่องราง', title:'เครื่องรางป้องกัน', en:'Amulets'},{id:'weapon_tier', label:'ระดับอาวุธ', title:'โบนัสตามระดับอาวุธ', en:'Weapons'}];

    let DATA: any, tab = 'sapiens', rankFilter = 'all';
    let M: any = {};

    function index(){
      DATA.humans.sort((a:any,b:any)=>Number(b.rank_level)-Number(a.rank_level)||a.id-b.id);
      DATA.levels.sort((a:any,b:any)=>Number(b.rank_level)-Number(a.rank_level));
      M.rank = Object.fromEntries(DATA.levels.map((r:any)=>[rk(r.rank_level),r]));
      M.amulet = Object.fromEntries(DATA.amulets.map((a:any)=>[a.amulet_name,a]));
      M.weapon_tier = Object.fromEntries(DATA.weapon_tiers.map((r:any)=>[r.name,r]));
      M.person = Object.fromEntries(DATA.humans.map((p:any)=>[p.id,p]));
      M.person[9999] = { id: 9999, name: 'คำนวณพลังส่วนกลาง', rank_level: '4', weapon_tier: 'Elythuim', amulet_name: 'เครื่องรางนาฬิกาอนันต์', profession: 'ทั่วไป' };
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
    
    const profTag = (c:string) => {
        if(!c || c === 'ทั่วไป') return '';
        if(c.includes('ซ่อมบำรุง') || c.includes('ช่าง')) return `<span class="tag" style="color:#c4a962; border-color:rgba(196,169,98,.4); background:rgba(196,169,98,.12)">⚙️ ${esc(c)}</span>`;
        return `<span class="tag" style="color:#9ca3af; border-color:rgba(156,163,175,.4); background:rgba(156,163,175,.12)">${esc(c)}</span>`;
    };
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
          if(isNum(v)){
            let unit = ''; let label = k;
            if(POWER_UNITS.includes(k)) { unit = k; label = ''; } else { const parsed = splitUnit(k); label = parsed.base.startsWith('จำนวน') ? '' : parsed.base; unit = parsed.unit; }
            s.counts.push({label, value:Number(v), unit});
          }
          else if(v!=null && String(v).trim()!=='') s.details.push({label: PLAIN_LABELS.includes(k)?'':k, text:String(v)});
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

    function viewHumans(){
      const ranks = [...new Set(DATA.humans.map((m:any)=>rk(m.rank_level)))];
      const chips = ['all',...ranks].map(r=>`<button class="chip" type="button" data-filter="${r}" aria-pressed="${rankFilter===r}">${r==='all'?'ทั้งหมด':'Rank '+r}</button>`).join('');
      const hubBanner = `<div class="hub-btn-wrap"><button type="button" class="hub-btn" data-open="9999">คำนวณพลังส่วนกลาง</button></div>`;

      const list = ranks.filter(r=>rankFilter==='all'||rankFilter===r).map(r=>{
        const people = DATA.humans.filter((m:any)=>rk(m.rank_level)===r && m.id !== 9999);
        if(!people.length) return '';
        return `<section class="group"><div class="group-h"><span class="n">${r}</span><span class="t">${esc(rname(M.rank[r as string]?.rank_name))}</span></div>
          <div class="grid">${people.map((m:any)=>`
            <button class="mcard" type="button" data-open="${m.id}">${avatar(m)}
              <span class="mcard-info">
                <span class="nm">${esc(m.name)}</span>${(m.weapon_tier || m.amulet_name) ? `
                <span class="meta">
                  ${m.weapon_tier ? tag(m.weapon_tier, 'r-spirit') : ''}
                  ${m.amulet_name ? tag(m.amulet_name) : ''}
                </span>` : ''}
              </span>
            </button>`).join('')}</div></section>`;
      }).join('');
      return hubBanner + `<div class="chips">${chips}</div>${list}`;
    }
    
    function viewRank(){ return `<div class="pcols">`+DATA.levels.map((r:any)=>`<div class="panel"><div class="who"><div class="rk"><b>${rk(r.rank_level)}</b>Rank</div><h3>${esc(rname(r.rank_name))}</h3></div>${skillBlock(r)}</div>`).join('')+`</div>`; }
    function viewAmulet(){ return `<div class="pcols">`+DATA.amulets.map((a:any)=>{ const wearers = DATA.humans.filter((m:any)=>m.amulet_name===a.amulet_name && m.id !== 9999); return `<div class="panel"><h3>${esc(a.amulet_name)}</h3><div class="sub">${a.abilities.length} ความ মোকสามารถ</div><div style="margin-top:8px">${a.abilities.map(abilityHTML).join('')}</div><div class="sec-h" style="margin-top:16px;">ผู้สวมใส่ (${wearers.length})</div><div class="owners" style="margin-top:4px">${wearers.map(personChip).join('')||'<span class="none">ยังไม่มี</span>'}</div></div>`; }).join('')+`</div>`; }
    function viewWeaponTier(){ return `<div class="pcols">`+DATA.weapon_tiers.map((r:any)=>{ const owners = DATA.humans.filter((m:any)=>m.weapon_tier===r.name && m.id !== 9999); return `<div class="panel"><h3>อาวุธระดับ ${esc(r.name)}</h3><div class="two" style="margin-top: 8px;"><div class="stat">โบนัส Rank 3<b>+${r.bonus_rank3}</b></div><div class="stat">โบนัส Rank 4<b>+${r.bonus_rank4}</b></div></div><div style="margin-top:16px;"><div class="sec-h">ผู้ถือครอง (${owners.length})</div><div class="owners" style="margin-top:4px">${owners.map(personChip).join('')||'<span class="none">ยังไม่มี</span>'}</div></div></div>`; }).join('')+`</div>`; }

    const VIEWS:any = {sapiens:viewHumans,level:viewRank,amulet:viewAmulet,weapon_tier:viewWeaponTier};

    function viewPerson(m:any){
      if (m.id === 9999) {
          return `<div class="pbody hub-view" style="padding-top: 24px; min-height: 100vh;">
              <h2 style="font-family: var(--sans) !important; font-size: 28px; color: #fff; margin:0 0 6px;">คำนวณพลังส่วนกลาง</h2>
              <p style="color: var(--muted); margin:0 0 24px; font-size: 14px;">(สามารถเลือกข้อมูลเองได้ในกรณีฉุกเฉิน)</p>
              <div id="hubCalcArea"></div></div>`;
      }
      const r = M.rank[rk(m.rank_level)], am = M.amulet[m.amulet_name], wp = M.weapon_tier[m.weapon_tier];
      const hero = m.image_url ? `<div class="hero"><img src="${esc(m.image_url)}" alt="${esc(m.name)}" ${IMG_ATTR}>` : `<div class="hero noimg"><span class="glow" style="background:var(--bg1)"></span>`;
      return hero + `<div class="hero-t"><h2>${esc(m.name)}</h2><div class="rk"><b>${rk(m.rank_level)}</b><span style="font-family: var(--sans);">${esc(rname(r?.rank_name))}</span></div></div></div>
        <div class="pbody">${orn}
        <div class="sec-h" style="margin-top:6px">ความสามารถ (Rank ${rk(m.rank_level)})</div>${skillBlock(r)}
        <div class="sec-h" style="margin-top:22px">ระดับอาวุธประจำตัว</div>
        ${wp?`<div class="kv"><span>ระดับอาวุธ</span><b>${esc(wp.name)}</b></div>
          <div class="kv"><span>โบนัสโจมตี (Rank 3)</span><b style="color:var(--ice)">+${wp.bonus_rank3} ATK</b></div>
          <div class="kv"><span>โบนัสโจมตี (Rank 4)</span><b style="color:var(--ice)">+${wp.bonus_rank4} ATK</b></div>`
          :'<div class="none">ไม่มีข้อมูลอาวุธประจำตัว (ใช้อาวุธพื้นฐาน)</div>'}
        <div class="sec-h" style="margin-top:22px">เครื่องราง</div>
        ${am?`<b>${esc(am.amulet_name)}</b>${am.abilities.map(abilityHTML).join('')}`:'<div class="none">ไม่มีเครื่องราง</div>'}
        <div class="foot">Humans</div></div>`;
    }

    const calcSkills = (r:any) => skillsOf(r).combat;
    let CALC:any = {
    pid:null, skills:{}, buffs:[], hubRank:'4', hubAmulet:'เครื่องรางนาฬิกาอนันต์', hubWeaponTier:'Elythuim', 
    baseAtkOn: true, // <--- เพิ่มตัวแปรโจมตีพื้นฐานเป็น true
    horseOn: false, 
    ashOn: false, 
    weaponOn: true, // <--- เปลี่ยนอาวุธเป็น true เพื่อให้เปิดรอไว้
    trapOn: false, 
    trapCount: ''
    };
    
    function calcReset(m:any){
      CALC = {
        pid:m.id, skills:{}, buffs:[], 
        hubRank: CALC.hubRank || '4', 
        hubAmulet: CALC.hubAmulet || 'เครื่องรางนาฬิกาอนันต์', 
        hubWeaponTier: CALC.hubWeaponTier || 'Elythuim', 
        horseOn: false, ashOn: false, 
        weaponOn: true, // <--- อาวุธเปิดรอไว้
        trapOn: false, trapCount: ''
      };
      
      let targetRank = m.id === 9999 ? CALC.hubRank : rk(m.rank_level);
      
      calcSkills(M.rank[targetRank]).forEach((s:any, index:number)=>{ 
        // บังคับให้สกิลลำดับที่ 0 (บนสุด) หรือสกิลที่มีคำว่า โจมตี/อาวุธ เปิดรอไว้เสมอ
        let isDefaultOn = index === 0 || String(s.name).includes('โจมตี') || String(s.name).includes('อาวุธ');
        
        CALC.skills[s.id] = {
            on: isDefaultOn, 
            power: s.power!=null ? String(s.power) : ''
        }; 
      });
    }
    
    function calcRun(m:any){
      let isHub = m.id === 9999;
      const targetWeapon = isHub ? CALC.hubWeaponTier : m.weapon_tier;
      const wp = M.weapon_tier[targetWeapon], steps = [];
      const targetRank = Number(isHub ? CALC.hubRank : rk(m.rank_level));

      let base = 0;
      calcSkills(M.rank[targetRank]).forEach((s:any)=>{ const c = CALC.skills[s.id]; if(c && c.on && s.power!=null) base += toNum(s.power); });
      steps.push(['อาวุธโจมตีพื้นฐาน', base]);
      
      let cur = base;
      
      if(wp && targetRank >= 3 && CALC.weaponOn){ 
          const wBonus = targetRank === 3 ? wp.bonus_rank3 : wp.bonus_rank4;
          cur += wBonus; steps.push([`โบนัสระดับอาวุธ (${targetWeapon})`, `+ ${wBonus}`]); 
      }
      
      if(targetRank >= 4 && CALC.horseOn){ cur += 3; steps.push(['ใช้งานม้าศึก', '+ 3']); }
      
      if(CALC.trapOn && targetRank >= 1){
          const tc = CALC.trapCount === '' ? 1 : Math.max(0, toNum(CALC.trapCount)); 
          let tMult = 5; 
          if (targetRank === 2) tMult += 1;
          else if (targetRank === 3) tMult += 3;
          else if (targetRank >= 4) tMult += 5;

          cur += (tc * tMult); 
          steps.push([`กับดักโจมตี/ระเบิด (${tc} ชิ้น)`, `+ ${tc * tMult}`]); 
      }

      if(CALC.ashOn){ cur += 10; steps.push(['ใช้งานเถ้าภูเขา', '+ 10']); }

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
      let targetRank = Number(isHub ? CALC.hubRank : rk(m.rank_level));
      const sk = calcSkills(M.rank[targetRank]);
      
      // กรองสกิลที่นำมาจาก Database ออก เพื่อป้องกันการซ้อนทับกับสวิตช์ที่เราสร้างแยกเอง
      const atkSkills = sk.filter((s:any)=> s.power != null && !s.name.includes('ม้า') && !s.name.includes('กับดัก'));

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
                    <label>ระดับอาวุธ (Weapon Tier)</label>
                    <select data-c="hubWeaponTier" class="num select-css">
                        <option value="none">อาวุธพื้นฐาน (ไม่มีโบนัส)</option>
                        ${DATA.weapon_tiers.map((r:any) => `<option value="${r.name}" ${r.name===CALC.hubWeaponTier?'selected':''}>${r.name}</option>`).join('')}
                    </select>
                </div>
            </div><hr style="border-color:var(--line-soft); margin:18px 0;">`;
      }

      let html = `${isHub?'':`<h3>${ICON.calc}คำนวณพลังโจมตี</h3>`}
        <p class="hint">เลือกการโจมตีและอุปกรณ์เสิรมที่ใช้</p>${hubControls}`;

      if(atkSkills.length) { 
          html += `<div class="sec-h" style="margin-top:14px">การโจมตีหลัก</div>` + atkSkills.map((s:any) => {
          const c = CALC.skills[s.id] || {on:false};
          return `<div class="cs cs-fixed">
              <label class="sw"><input type="checkbox" data-c="skill" data-id="${s.id}" ${CALC.skills[s.id]?.on ? 'checked' : ''}><span class="tg"></span><span class="sw-t">${esc(s.name)}</span></label>
              <div class="fixed-val ${c.on?'':'off'}"><b>${s.power}</b> <small>ATK</small></div></div>`;
          }).join(''); 
      }

      const targetWeapon = isHub ? CALC.hubWeaponTier : m.weapon_tier;
      const wp = M.weapon_tier[targetWeapon];

      if (wp && targetRank >= 3 && targetWeapon !== 'none') {
          const wBonus = targetRank === 3 ? wp.bonus_rank3 : wp.bonus_rank4;
          html += `<div class="sec-h" style="margin-top:14px">อาวุธประจำตัว</div>
            <div class="cs cs-fixed">
              <label class="sw"><input type="checkbox" data-c="weaponToggle" ${CALC.weaponOn ? 'checked' : ''}><span class="tg"></span><span class="sw-t">ใช้อาวุธระดับ ${esc(targetWeapon)}</span></label>
              <div class="fixed-val ${CALC.weaponOn ? '' : 'off'}"><b>+${wBonus}</b> <small>Bonus</small></div>
            </div>`;
      }
      
      html += `<div class="sec-h" style="margin-top:14px">ไอเทมและอุปกรณ์เสริม</div>`;

      // กับดัก/ระเบิดที่ลบส่วนซ้ำซ้อนออกแล้ว
      if (targetRank >= 1) {
          let tMult = 5;
          if (targetRank === 2) tMult += 1;
          else if (targetRank === 3) tMult += 3;
          else if (targetRank >= 4) tMult += 5;

          html += `
            <div class="cs cs-fixed">
              <label class="sw">
                <input type="checkbox" data-c="trapToggle" ${CALC.trapOn ? 'checked' : ''}>
                <span class="tg"></span>
                <span class="sw-t">กับดัก/ระเบิด <small>+${tMult} แต้ม/ชิ้น</small></span>
              </label>
              <div class="fixed-val" style="width:70px">
                <input class="num" inputmode="numeric" placeholder="ชิ้น" data-c="trapInput" value="${esc(CALC.trapCount)}" ${CALC.trapOn ? '' : 'disabled'} style="text-align:center; padding:0; min-height:36px;">
              </div>
            </div>`;
      }

      html += `<div class="cs cs-fixed" style="margin-top:6px;">
          <label class="sw"><input type="checkbox" data-c="ashToggle" ${CALC.ashOn ? 'checked' : ''}><span class="tg"></span><span class="sw-t">เถ้าภูเขา <small>โจมตีสิ่งมีชีวิตเหนือธรรมชาติ</small></span></label>
          <div class="fixed-val ${CALC.ashOn ? '' : 'off'}"><b>+10</b> <small>Bonus</small></div>
        </div>`;

      if (targetRank >= 4) {
          html += `<div class="cs cs-fixed" style="margin-top:6px;">
            <label class="sw"><input type="checkbox" data-c="horseToggle" ${CALC.horseOn ? 'checked' : ''}><span class="tg"></span><span class="sw-t">ใช้งานม้า <small>เพิ่มความคล่องตัวและแรงปะทะ</small></span></label>
            <div class="fixed-val ${CALC.horseOn ? '' : 'off'}"><b>+3</b> <small>Bonus</small></div>
          </div>`;
      }

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
        calc.hidden = (m.id === 9999); renderCalc(); document.title = m.name + ' · Sapien - Elysian Curse'; window.scrollTo(0,0);
      } else {
        pgrid.className = 'pgrid fade-enter'; cap.className = 'list'; topbar.hidden = false;
        topbar.innerHTML = `<a href="/elysian-curse" class="back" style="text-decoration:none;"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>หน้าหลัก</a>`;
        topbar.className = 'bar-top fade-enter'; calc.hidden = true;
        const t = TABS.find(x => x.id === tab); if (!t) return;
        $('#view').innerHTML = head(t) + VIEWS[tab]() + `<div class="foot">${esc(t.en)}</div>`; document.title = 'Sapien - Elysian Curse';
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
      
      // ปรับปุ่มกลับให้ย้อนไปยังหน้ารายการ (แท็บปัจจุบัน) อย่างแม่นยำ ไม่พึ่งพาประวัติเบราว์เซอร์
      else if(d.act==='back'){ location.hash = `#/${tab}`; }
    });
    
    document.addEventListener('input', e=>{
      const target = e.target as HTMLInputElement;
      const d = target.dataset; if(!d || !d.c) return;
      if(d.c==='buff') CALC.buffs[Number(d.i)].v = target.value;
      else if(d.c==='trapInput') { CALC.trapCount = target.value; }
      else return;
      calcOut();
    });

    document.addEventListener('change', e=>{
      const target = e.target as HTMLInputElement;
      const d = target.dataset; if(!d || !d.c) return;

      if(d.c==='hubRank') { CALC.hubRank = target.value; calcReset(M.person[9999]); renderCalc(); return; }
      if(d.c==='hubWeaponTier') { CALC.hubWeaponTier = target.value; renderCalc(); return; }
      
      if(d.c==='trapToggle') { 
          CALC.trapOn = target.checked; 
          const inp = target.closest('.cs')?.querySelector('input[data-c="trapInput"]') as HTMLInputElement;
          if (inp) {
              inp.disabled = !target.checked;
              if (target.checked && !inp.value) { inp.value = '1'; CALC.trapCount = '1'; } 
              if (target.checked) inp.focus();
          }
          calcOut(); 
          return; 
      }
      
      if(d.c==='ashToggle') { 
          CALC.ashOn = target.checked; 
          target.closest('.cs')?.querySelector('.fixed-val')?.classList.toggle('off', !target.checked); 
          calcOut(); 
          return; 
      }
      if(d.c==='weaponToggle') { 
          CALC.weaponOn = target.checked; 
          target.closest('.cs')?.querySelector('.fixed-val')?.classList.toggle('off', !target.checked); 
          calcOut(); 
          return; 
      }
      if(d.c==='horseToggle') { 
          CALC.horseOn = target.checked; 
          target.closest('.cs')?.querySelector('.fixed-val')?.classList.toggle('off', !target.checked); 
          calcOut(); 
          return; 
      }
      if(d.c==='skill'){ 
          CALC.skills[d.id as string].on = target.checked; 
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
        const r = await fetch('/api/sapien2026'); if(!r.ok) throw new Error(String(r.status));
        DATA = await r.json();
      }catch(e){ DATA = FALLBACK; $('#demo').hidden = false; }
      index(); render(); setTimeout(() => setIsLoading(false), 600);
    })();
  }, []);

  return (
    <>
      <link rel="icon" type="image/png" href="https://iili.io/n1XLNoB.png" />
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300..700&display=swap');
        @import url('https://midsummer-reverie.github.io/font-face/ophelia.css');

        :root{
          --bg0: #140f0a; --bg1: #1f1812; --text: #e8dbce; --muted: #a68d73;
          --ice: #dfa847; --frost: #b38029; --line: rgba(223,168,71,.2); --line-soft: rgba(223,168,71,.1);
          --amber: #d97706; --amber-d: #b45309;
          --panel: linear-gradient(160deg,rgba(38,29,22,.8),rgba(18,14,10,.5));
          --card-bg: linear-gradient(165deg,#261d16 0%,#1a140f 55%,#140f0a 100%);
          --sans: 'Google Sans','Noto Sans Thai',system-ui,-apple-system,sans-serif;
          --display: 'ophelia','Noto Serif Thai',Georgia,serif;
        }
        
        html, body { background-color: var(--bg0); margin: 0; }
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        
        .human-loader {
          position: fixed; inset: 0; z-index: 99999;
          background: radial-gradient(circle at 50% 40%, #1f1812, #140f0a 80%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          color: var(--ice); font-family: var(--sans); transition: opacity 0.8s ease, visibility 0.8s ease;
        }
        .human-loader.fade-out { opacity: 0; visibility: hidden; }
        .human-loader .ring {
          width: 64px; height: 64px; border: 3px solid rgba(223,168,71,0.1); border-top-color: var(--frost);
          border-radius: 50%; animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite; margin-bottom: 20px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .wrapper {
          margin:0;min-height:100dvh;color:var(--text);font-family:var(--sans);font-size:15px;line-height:1.65;
          background: radial-gradient(900px 520px at 88% -8%,rgba(223,168,71,.08),transparent 62%),
                      radial-gradient(700px 520px at -5% 42%,rgba(179,128,41,.04),transparent 62%),
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
        .chip{flex:none;white-space:nowrap;display:inline-flex;align-items:center;border:1px solid var(--line);background:rgba(223,168,71,.1);border-radius:999px;padding:6px 15px;font-size:13px;color:var(--ice);min-height:36px}
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
        
        .mcard{ display:flex;align-items:center;gap:12px;text-align:left;width:100%;height:100%; background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:12px 14px; }
        .mcard:hover{border-color:var(--ice)}
        .mcard-info { flex: 1; min-width: 0; } 
        .mcard .nm{display:block;font-weight:600;font-size:16px;line-height:1.35;color:#fff;}
        .mcard .meta{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:6px}
        
        .tag{display:inline-flex;align-items:center;white-space:nowrap;font-size:12px;line-height:1.5;padding:2px 10px;border-radius:999px;border:1px solid var(--line);color:var(--ice);background:rgba(223,168,71,.1)}
        .tag.r-spirit{color:#d1d5db;border-color:#6b7280;background:rgba(107,114,128,.15)}
        .none{color:var(--muted);font-size:13px}

        .who{display:flex;align-items:center;gap:14px}
        .av{flex:none;width:52px;height:52px;border-radius:50%;overflow:hidden;border:2px solid rgba(255,255,255,.7);box-shadow:0 0 0 3px rgba(223,168,71,.18)}
        .av img{width:100%;height:100%;object-fit:cover;object-position:50% 18%;display:block}
        .rk{display:flex;align-items:center;gap:10px;font-family:var(--display);font-size:16px;line-height:1.2;color:var(--ice)}
        .rk b{font-family:var(--sans);font-size:32px;font-weight:500;color:#fff;margin:0;line-height:1}

        .ab{display:flex;gap:10px;padding:10px 0;border-top:1px solid var(--line-soft)} .ab:first-of-type{border-top:0}
        .ab::before{content:"";flex:none;width:7px;height:7px;margin-top:9px;transform:rotate(45deg);background:var(--frost);box-shadow:0 0 8px rgba(179,128,41,.3)}
        .ab p{margin:0 0 4px} .ab p:last-child{margin:0}
        .note{font-size:13.5px;padding:6px 12px;border-radius:0 10px 10px 0;margin:6px 0 0}
        .note.warn{color:#d1d5db;background:rgba(107,114,128,.2);border-left:3px solid var(--amber)}
        .note.trait{color:#e5e7eb;background:rgba(223,168,71,.12);border-left:3px solid var(--frost)}
        strong{font-weight:700;color:#fff} u{text-decoration-thickness:1.5px;text-underline-offset:3px}

        .kv{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:9px 0;min-height:44px;border-top:1px solid var(--line-soft)}
        .kv:first-child{border-top:0} .kv span:first-child{color:var(--muted)} .kv b{font-weight:600;text-align:right}
        .sec-h{margin:16px 0 4px;font-size:13px;color:var(--frost);font-weight:600} .sec-h:first-child{margin-top:0}

        .sk{padding:11px 0;border-top:1px solid var(--line-soft)} .sec-h + .sk{border-top:0}
        .sk-h{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
        .sk-n{flex:1;min-width:0;font-weight:600;color:#fff;line-height:1.45;overflow-wrap:break-word}
        .sk-c{flex:none;display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:flex-end;gap:6px}
        .cn{display:inline-flex;align-items:center;gap:5px;white-space:nowrap;padding:2px 11px;border-radius:999px;border:1px solid var(--line);background:rgba(223,168,71,.1);font-size:13.5px;color:#fff}
        .cn em{font-style:normal;color:var(--frost);font-size:12px} .cn b{font-weight:600} .cn small{font-weight:400;color:var(--muted);font-size:12px}
        .sk-d{margin-top:6px;color:var(--muted);font-size:14px;line-height:1.55} .sk-d p{margin:0}
        .sk-d p + p{margin-top:4px} .sk-d em{font-style:normal;color:var(--frost);font-size:12px;margin-right:4px}

        .bar{height:6px;border-radius:6px;background:rgba(223,168,71,.15);overflow:hidden;margin-top:4px}
        .bar i{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,var(--ice),var(--frost))}
        .two{display:grid;grid-template-columns:1fr;gap:14px;margin-top:12px}
        .stat{font-size:13px;color:var(--muted)} .stat b{color:#fff;font-size:16px;margin-left:4px}
        .owners{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
        .owner{display:inline-flex;align-items:center;white-space:nowrap;border:1px solid var(--line);background:rgba(223,168,71,.1);color:var(--ice);border-radius:999px;padding:4px 13px;font-size:13px;}
        .foot{margin-top:18px;text-align:center;font-family:var(--display);font-size:13px;color:var(--muted);letter-spacing:.12em}

        .nav{ position:fixed;left:50%;transform:translateX(-50%);bottom:calc(10px + env(safe-area-inset-bottom,0px)); width:min(560px,calc(100% - 20px));display:flex;justify-content:space-between;gap:2px;padding:6px;z-index:20; background:rgba(33,26,19,.82);backdrop-filter:blur(14px); border:1px solid var(--line);border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.6); }
        .nav button{flex:1;background:none;border:0;border-radius:999px;padding:7px 2px 6px;display:flex;flex-direction:column;align-items:center;gap:1px;color:var(--muted);font-size:11px;}
        .nav svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;}
        .nav button[aria-current="true"]{color:#fff;background:linear-gradient(180deg,rgba(223,168,71,.35),rgba(179,128,41,.18));box-shadow:inset 0 0 0 1px var(--line)}

        .pgrid{display:block} #capture.list{background:none;border:0;padding:0}
        #capture.person{background:var(--card-bg);border:1px solid var(--line);border-radius:26px;overflow:hidden;padding:0 0 18px;max-width:600px;margin:0 auto}
        #capture.person.hub-full { max-width: 860px !important; margin: 0 auto; background: none !important; border: none !important; box-shadow: none !important; padding: 0 16px; }
        .hub-view * { font-family: var(--sans) !important; }
        .hub-btn-wrap { text-align: center; margin-bottom: 24px; }
        .hub-btn { display: inline-block; padding: 10px 24px; border-radius: 999px; border: 1px solid var(--line); background: rgba(38,29,22,0.6); color: var(--ice); font-size: 14px; font-weight: 500;}
        .hub-ctrls { background:rgba(38,29,22,.4); border-radius:16px; padding:16px; margin-top:16px; border:1px solid var(--line-soft); }
        .ctrl-grp { margin-bottom:12px; } .ctrl-grp:last-child { margin-bottom:0; }
        .ctrl-grp label { display:block; color:var(--muted); font-size:13px; margin-bottom:4px; }
        .select-css { appearance:none; background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a68d73' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat:no-repeat; background-position:right 12px center; background-size:16px; padding-right:40px; }

        .bar-top{display:flex;justify-content:space-between;align-items:center;max-width:600px;margin:0 auto 12px}
        .back{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:rgba(38,29,22,.9);border-radius:999px;padding:8px 16px 8px 12px;font-size:14px;color:var(--ice);min-height:42px; text-decoration:none;}
        .back svg{width:16px;height:16px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;}
        .hero{position:relative;aspect-ratio:4/5;max-height:640px;width:100%;overflow:hidden;background:#1f1812}
        .hero img{width:100%;height:100%;object-fit:cover;display:block}
        .hero.noimg{aspect-ratio:auto;height:190px;display:grid;place-items:center}
        .hero.noimg .glow{width:96px;height:96px;border-radius:50%;border:3px solid rgba(255,255,255,.75);box-shadow:0 0 0 8px rgba(223,168,71,.15),0 0 40px rgba(179,128,41,.3)}
        .hero::after{content:"";position:absolute;inset:auto 0 0 0;height:55%;background:linear-gradient(180deg,transparent,#140f0a 92%)}
        .hero-t{position:absolute;left:18px;right:18px;bottom:6px;z-index:2}
        .hero-t h2{margin:0 0 4px;font-family:var(--display);font-weight:400;font-size:clamp(22px,6.4vw,32px);line-height:1.2;color:#fff;}
        .pbody{padding:0 18px}

        @media(min-width:900px){ .pgrid.two{display:grid;grid-template-columns:minmax(0,600px) minmax(0,1fr);gap:24px;align-items:start;} .pgrid.two #capture.person{margin:0} .bar-top{margin:0 0 25px} #calc{margin-top:0} }

        #calc{margin-top:16px} #calc h3{display:flex;align-items:center;gap:8px;font-size:18px} #calc h3 svg{width:20px;height:20px;stroke:var(--frost);fill:none;}
        .hint{color:var(--muted);font-size:13px;margin:2px 0 0}
        .num{width:100%;min-height:44px;background:rgba(38,29,22,.7);border:1px solid var(--line);border-radius:12px;color:#fff;padding:0 12px;font:inherit;font-size:16px}
        .num:disabled{opacity:.4} .num::placeholder{color:rgba(223,168,71,.4)}
        
        .cs{display:grid;grid-template-columns:1fr 104px;gap:10px;align-items:center;border-top:1px solid var(--line-soft);padding:2px 0}
        .cs.cs-fixed { grid-template-columns: 1fr auto; } .sec-h + .cs{border-top:0}
        .fixed-val { font-family: var(--sans); font-size: 16px; font-weight: 600; color: #fff; text-align: right; }
        .fixed-val small { font-size: 12px; color: var(--ice); margin-left: 2px; } .fixed-val.off { opacity: 0.3; }

        .sw{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:48px;cursor:pointer}
        .sw input{position:absolute;opacity:0;pointer-events:none}
        .sw .tg{flex:none;order:-1;width:46px;height:26px;border-radius:99px;background:rgba(223,168,71,.2);border:1px solid var(--line);position:relative;transition:background .15s}
        .sw .tg::after{content:"";position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:var(--ice);transition:transform .15s}
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
        .total{display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding:12px 14px;border-radius:16px;background:linear-gradient(160deg,rgba(223,168,71,.28),rgba(179,128,41,.12));border:1px solid var(--line)}
        .total span{color:var(--ice)} .total b{font-family:var(--sans);font-weight:500;font-size:40px;line-height:1;color:#fff;text-shadow:0 0 18px rgba(223,168,71,.5)}

        #demo{margin:0 0 12px;padding:8px 14px;border-radius:12px;background:rgba(179,128,41,.12);border:1px solid rgba(179,128,41,.4);color:var(--ice);font-size:13px}
        #toast{position:fixed;left:50%;bottom:calc(92px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:60;background:#e8dbce;color:#0a0a0c;padding:8px 18px;border-radius:999px;font-size:14px;opacity:0;transition:opacity .2s} #toast.on{opacity:1}
        @media(prefers-reduced-motion:reduce){*{transition:none!important}}
      `}} />

      <div className="wrapper">
        <div className={`human-loader ${!isLoading ? 'fade-out' : ''}`}>
          <div className="ring"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>

        <div className="wrap">
          <div id="demo" hidden>กำลังแสดงข้อมูลตัวอย่าง เนื่องจากยังเชื่อมต่อฐานข้อมูลไม่ได้ (/api/sapien2026)</div>
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