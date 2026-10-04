"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";

export default function FairiesPage() {
  const initialized = useRef(false);
  // เพิ่ม State สำหรับควบคุมหน้าโหลด
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ป้องกันไม่ให้โค้ดรันซ้ำ 2 รอบในโหมด Development ของ React (Strict Mode)
    if (initialized.current) return;
    initialized.current = true;

    /* ============ ข้อมูลตัวอย่าง ============ */
    const FALLBACK = {
      rarities:[
        {rarity:'ธรรมดา',atk_bonus:2,def_bonus:0},{rarity:'กลาง',atk_bonus:3,def_bonus:1},
        {rarity:'สูง',atk_bonus:4,def_bonus:3},{rarity:'ตำนาน',atk_bonus:7,def_bonus:10},
        {rarity:'เทพเจ้า',atk_bonus:15,def_bonus:15}],
      pacts:[
        {power_name:'ภูตบุปผามายา',description:'สามารถจำแลงกายเป็นดอกไม้หรือพืชพรรณขนาดเล็กเพื่อพรางตัวจากศัตรูได้อย่างสมบูรณ์แบบ'},
        {power_name:'ภูตพฤกษาฟื้นฟู',description:'เมื่อร่างกายสัมผัสกับพื้นดินและต้นไม้ อาการบาดเจ็บจะถูกรักษาให้หายเร็วขึ้นอย่างน่าอัศจรรย์'},
        {power_name:'พสุธากัมปนาท',description:'สามารถสั่งให้รากไม้ใต้ดินสั่นสะเทือนเพื่อสร้างแผ่นดินไหวขนาดย่อม ทำลายการทรงตัวของศัตรู'},
        {power_name:'เสียงกระซิบแห่งไพร',description:'สามารถฟังเสียงและเข้าใจภาษาของต้นไม้ เพื่อรับรู้เหตุการณ์ที่เกิดขึ้นในป่าลึกได้'}],
      amulets:[
        {amulet_name:'สร้อยผีเสื้อพฤกษา',abilities:['แฟรี่ที่สวมใส่จะได้รับพลังแห่งพืชพรรณซึ่งคอยเสริมพลังเวทมนตร์ตลอดเวลา','ป้องกันผู้สวมใส่จากแวมไพร์ แวมไพร์ตนใดที่พยายามเข้ามาทำร้ายจะถูกพลังแห่งแสงขับไล่ออกไปแต่ไม่ถึงกับบาดเจ็บ แวมไพร์ที่มีพลังแก่กล้ายังสามารถฝืนพลังแห่งแสงนั้นได้']},
        {amulet_name:'สร้อยประกายพฤกษ์',abilities:[
          'ผู้สวมใส่จะมีรัศมีกายที่เปล่งปลั่งแต่ยังสามารถควบคุมรัศมีนั้นไม่ให้เป็นอันตรายต่อแวมไพร์ได้ การไม่ควบคุมจะทำให้แวมไพร์ที่พยายามเข้ามาใกล้ปวดแสบปวดร้อนแสนสาหัส',
          'เพิ่มโอกาสในการโน้มน้าวและกลายเป็นเพื่อนกับสัตว์ได้อย่างง่ายดายขึ้น',
          'พืชพันธุ์ใด ๆ ที่ผู้สวมใส่ปลูกจะออกผลงอกงามและมีคุณภาพสูงมากกว่าปกติ (ใช้งานในเนื้อเรื่องเท่านั้น)',
          'สร้างศัสตราแห่งพฤกษา ด้วยการหยิบยืมกิ่งไม้หรือใบไม้ มาแปลงสภาพพร้อมถ่ายโอนพลังจากสร้อยลงไป ให้ส่วนประกอบเหล่านั้นหลอมรวมเป็นอาวุธหรือโล่ที่แข็งแกร่งเป็นการชั่วคราว',
          'หากเกิดอันตรายถึงชีวิต พลังในสร้อยจะตื่นขึ้นและกางม่านพลังงานแสงในรูปแบบดักแด้สีทองขึ้นมาห่อหุ้มร่างกายผู้สวมใส่ไว้ ดักแด้นี้จะป้องกันการโจมตีทุกรูปแบบชั่วขณะ (คล้ายเป็นอมตะชั่วคราว) และจะแผ่รังสีความร้อนสูงออกมาเผาไหม้ศัตรูที่พยายามเข้ามาโจมตีในระยะประชิด',
          'สามารถปล่อยละอองแสงสีทองและเขียวกระจายออกไปรอบตัว ซึ่งมีฤทธิ์ต่อระบบประสาท ทำให้เป้าหมายเกิดอาการง่วงซึม เคลื่อนไหวช้าลงอย่างมาก หรือหลับใหลไปชั่วขณะ (กำหนดเป้าหมายได้)',
          'สามารถสื่อสารกับผู้ครอบครองสร้อยประกายพฤกษ์ในระยะไกลได้ผ่านเครือข่ายคล้ายเห็ดรา']}],
      ranks:[{"rank_level": "0", "rank_name": "-", "combat_abilities": {"ยิงบอลแสงเข้าโจมตี": {"จำนวน (ตัว/โพสต์)": "5"}, "ปล่อยแสงวาบฉับพลันเพื่อก่อกวนศัตรู": {"จำนวน (ตัว/ครั้ง)": "3", "จำนวน (ครั้ง/วัน)": "2", "ผลกระทบต่อศัตรู": "ทำให้มองเห็นพร่ามัวและเสียจังหวะ"}}, "utility_abilities": {}}, {"rank_level": "1", "rank_name": "ประกายแสงแรก", "combat_abilities": {"ยิงบอลแสงเข้าโจมตี": {"จำนวน (ตัว/โพสต์)": "7"}, "ลำแสงพุ่งเข้าโจมตีศัตรู": {"จำนวน (ตัว/ครั้ง)": "10", "จำนวน (ครั้ง/วัน)": "2"}, "ปล่อยแสงวาบรุนแรงเพื่อก่อกวนศัตรู": {"จำนวน (ตัว/ครั้ง)": "5", "จำนวน (ครั้ง/วัน)": "2", "ผลกระทบต่อศัตรู": "ทำให้การมองเห็นพร่ามัวและลดความแม่นยำ"}}, "utility_abilities": {"ใช้พลังแห่งแสงเยียวยาอาการบาดเจ็บ": {"ระดับอาการ": "เล็กน้อย", "จำนวน (คน/วัน)": "1"}, "ฟื้นฟูตนเอง (เมื่ออยู่ใกล้พืชพรรณ)": "บาดเจ็บเล็กน้อย"}}, {"rank_level": "2", "rank_name": "ภูตน้อยในดงพฤกษ์", "combat_abilities": {"ยิงบอลแสงเข้าโจมตี": {"จำนวน (ตัว/โพสต์)": "9"}, "ลำแสงพุ่งเข้าโจมตีเป็นแนว": {"จำนวน (ตัว/ครั้ง)": "12", "จำนวน (ครั้ง/วัน)": "2"}, "กระจายกลีบดอกเรืองแสงก่อกวนศัตรู": {"จำนวน (ตัว/ครั้ง)": "8", "จำนวน (ครั้ง/วัน)": "2", "ผลกระทบต่อศัตรู": "รบกวนการมองเห็นและสมาธิ"}, "สร้างม่านแสงบดบังทัศนวิสัย": {"จำนวน (ครั้ง/วัน)": "2"}}, "utility_abilities": {"ใช้พลังแห่งแสงเยียวยาอาการบาดเจ็บ": {"ระดับอาการ": "เล็กน้อยถึงปานกลาง", "จำนวน (คน/วัน)": "3"}, "ฟื้นฟูตนเอง (เมื่ออยู่ใกล้พืชพรรณ)": "บาดเจ็บปานกลาง", "มอบพรแห่งพฤกษา (ให้พ่อมดแม่มด)": {"จำนวน (ครั้ง/วัน)": "1"}}}, {"rank_level": "3", "rank_name": "แสงสว่างแห่งพงไพร", "combat_abilities": {"ยิงบอลแสงเข้าโจมตี": {"จำนวน (ตัว/โพสต์)": "12"}, "ลำแสงพลังรุนแรง": {"จำนวน (ตัว/ครั้ง)": "15", "จำนวน (ครั้ง/วัน)": "3"}, "ระเบิดพลังแสงรอบตัว": {"จำนวน (ตัว/ครั้ง)": "8", "จำนวน (ครั้ง/วัน)": "2", "ผลกระทบต่อศัตรู": "มองเห็นพร่ามัวและเสียจังหวะ"}, "พืชพรรณพุ่งจู่โจมศัตรู": {"จำนวน (ตัว/ครั้ง)": "12", "จำนวน (ครั้ง/วัน)": "3"}, "สร้างเถาวัลย์พันธนาการศัตรู": {"จำนวน (ตัว/ครั้ง)": "8", "จำนวน (ครั้ง/วัน)": "3"}}, "utility_abilities": {"ใช้พลังแห่งแสงเยียวยาอาการบาดเจ็บ": {"ระดับอาการ": "ปานกลาง", "จำนวน (คน/วัน)": "3"}, "สร้างพืชพรรณปกคลุมพื้นที่": {"ลักษณะ": "ชะลอการเคลื่อนไหวและบังคับทิศทางศัตรู", "จำนวน (ครั้ง/วัน)": "2"}, "ใช้เถาวัลย์ช่วยเหลือพันธมิตร": {"จำนวน (คน/ครั้ง)": "2", "จำนวน (ครั้ง/วัน)": "2"}, "สร้างเกราะจากพลังแสง": {"ป้องกัน (คน/ครั้ง)": "4", "จำนวน (ครั้ง/วัน)": "2"}, "ล่องหน": {"ระยะเวลา (ชม./วัน)": "3"}, "ฟื้นฟูตนเอง (เมื่ออยู่ใกล้พืชพรรณ)": "บาดเจ็บปานกลาง", "มอบพรแห่งพฤกษา (ให้พ่อมดแม่มด)": {"จำนวน (ครั้ง/วัน)": "2"}}}, {"rank_level": "4", "rank_name": "ละอองมนตรา", "combat_abilities": {"ยิงบอลแสงเข้าโจมตี": {"จำนวน (ตัว/โพสต์)": "16"}, "ลำแสงพลังรุนแรง": {"จำนวน (ตัว/ครั้ง)": "20", "จำนวน (ครั้ง/วัน)": "3"}, "ระเบิดพลังแสงรอบตัว": {"จำนวน (ตัว/ครั้ง)": "10", "จำนวน (ครั้ง/วัน)": "3"}, "พืชพรรณพุ่งจู่โจมศัตรู": {"จำนวน (ตัว/ครั้ง)": "15", "จำนวน (ครั้ง/วัน)": "3"}, "สร้างเถาวัลย์พันธนาการศัตรู": {"จำนวน (ตัว/ครั้ง)": "12", "จำนวน (ครั้ง/วัน)": "3"}}, "utility_abilities": {"ใช้พลังแห่งแสงเยียวยาอาการบาดเจ็บ": {"ระดับอาการ": "ปานกลางค่อนสาหัส", "จำนวน (คน/วัน)": "5"}, "สร้างพืชพรรณปกคลุมพื้นที่": {"ลักษณะ": "ชะลอการเคลื่อนไหวและบังคับทิศทางศัตรู", "จำนวน (ครั้ง/วัน)": "3"}, "ใช้เถาวัลย์ช่วยเหลือพันธมิตร": {"จำนวน (คน/ครั้ง)": "3", "จำนวน (ครั้ง/วัน)": "2"}, "สร้างเกราะจากพลังแสง": {"ป้องกัน (คน/ครั้ง)": "5", "จำนวน (ครั้ง/วัน)": "3"}, "ล่องหน": {"ระยะเวลา (ชม./วัน)": "5"}, "สร้างภาพลวงตา": {"จำนวน (ครั้ง/วัน)": "1", "ระยะเวลาที่มีผล (ชม.)": "3"}, "ฟื้นฟูตนเอง (เมื่ออยู่ใกล้พืชพรรณ)": "ปานกลางค่อนสาหัส", "มอบพรแห่งพฤกษา (ให้พ่อมดแม่มด)": {"จำนวน (ครั้ง/วัน)": "3"}}}, {"rank_level": "5", "rank_name": "ปีกพฤกษาสวรรค์", "combat_abilities": {"ยิงบอลแสงเข้าโจมตี": {"จำนวน (ตัว/โพสต์)": "20"}, "ลำแสงพลังรุนแรง": {"จำนวน (ตัว/ครั้ง)": "25", "จำนวน (ครั้ง/วัน)": "4"}, "ระเบิดพลังแสงรอบตัว": {"จำนวน (ตัว/ครั้ง)": "15", "จำนวน (ครั้ง/วัน)": "3"}, "พืชพรรณพุ่งจู่โจมศัตรู": {"จำนวน (ตัว/ครั้ง)": "20", "จำนวน (ครั้ง/วัน)": "4"}, "สร้างเถาวัลย์พันธนาการศัตรู": {"จำนวน (ตัว/ครั้ง)": "15", "จำนวน (ครั้ง/วัน)": "3"}}, "utility_abilities": {"ใช้พลังแห่งแสงเยียวยาอาการบาดเจ็บ": {"ระดับอาการ": "สาหัส", "จำนวน (คน/วัน)": "5"}, "สร้างพืชพรรณปกคลุมพื้นที่": {"ลักษณะ": "ชะลอการเคลื่อนไหวและบังคับทิศทางศัตรู", "จำนวน (ครั้ง/วัน)": "3"}, "ใช้เถาวัลย์ช่วยเหลือพันธมิตร": {"จำนวน (คน/ครั้ง)": "5", "จำนวน (ครั้ง/วัน)": "3"}, "สร้างเกราะจากพลังแสง": {"ป้องกัน (คน/ครั้ง)": "5", "จำนวน (ครั้ง/วัน)": "3"}, "วงดอกไม้หรือเถาวัลย์ป้องกันพื้นที่": {"ป้องกัน (คน/ครั้ง)": "5", "จำนวน (ครั้ง/วัน)": "2"}, "ล่องหน": {"ระยะเวลา (ชม./วัน)": "6"}, "สร้างภาพลวงตา": {"จำนวน (ครั้ง/วัน)": "1", "ระยะเวลาที่มีผล (ชม.)": "7"}, "พลังจิตเคลื่อนย้ายสิ่งของ (รัศมี 3 เมตร)": {"จำนวน (ครั้ง/วัน)": "3"}, "ควบคุมสภาพอากาศ (รัศมี 20 เมตร)": {"จำนวน (ครั้ง/วัน)": "1"}, "แปลงร่างเป็นสัตว์ป่า": {"ระยะเวลา (ชม./วัน)": "3"}, "ฟื้นฟูตนเอง (เมื่ออยู่ใกล้พืชพรรณ)": "สาหัส", "มอบพรแห่งพฤกษา (ให้พ่อมดแม่มด)": {"จำนวน (ครั้ง/วัน)": "4"}}}],
      conditions:[
        {skill_name:'มอบพรแห่งพฤกษา', condition_text:'สามารถช่วยเหลือพ่อมดแม่มดในการตามหาวัตถุดิบสมุนไพรสำหรับปรุงยาได้ด้วยพรแห่งพฤกษา พรแห่งพฤกษาจะทำให้พ่อมดแม่มดสามารถเก็บสมุนไพรได้มากขึ้น 2 เท่า เป็นจำนวน 3 โพสต์'}
      ],
      fairies:[
        ['Ashlyn Gonzalez',5,'#7fff00','สร้อยประกายพฤกษ์','Elara','ผีเสื้อจรกา','เทพเจ้า','ภูตพฤกษาฟื้นฟู'],
        ['Honeybeel Moonfae',4,'#ffb6c1','สร้อยประกายพฤกษ์','Bumble','กระต่ายป่า','ตำนาน','พสุธากัมปนาท'],
        ['Zephyr Laine',3,'#98fb98','สร้อยผีเสื้อพฤกษา',null,null,null,null],
        ['Reiju Z. Velaqueous',2,'#87cefa','สร้อยผีเสื้อพฤกษา',null,null,null,null]
      ].map((a,i)=>({id:i+1,name:a[0],rank_level:String(Number(a[1])),wing_color:a[2],amulet_name:a[3],spirit_animal_name:a[4],spirit_animal_type:a[5],spirit_animal_rarity:a[6],pact_power_name:a[7],image_url:i===0?'https://i.pinimg.com/1200x/30/84/c7/3084c7a5fba0c5a278161bd4e9185a75.jpg':null}))
    };

    /* ==================================================================== */
    const GROUP_NAMES = { combat:'ต่อสู้', other:'อื่น ๆ' };
    const SKILL_ORDER = [
      'ยิงบอลแสงเข้าโจมตี','ลำแสงพุ่งเข้าโจมตี','ระเบิดพลังแสงรอบตัว','พืชพรรณพุ่งจู่โจมศัตรู','สร้างเถาวัลย์พันธนาการ',
      'ปล่อยแสงวาบ','กระจายกลีบดอก','สร้างม่านแสง','สร้างพืชพรรณปกคลุมพื้นที่','ใช้เถาวัลย์ช่วยเหลือพันธมิตร','สร้างเกราะจากพลังแสง','วงดอกไม้หรือเถาวัลย์ป้องกันพื้นที่',
      'ใช้พลังแห่งแสงเยียวยา','มอบพรแห่งพฤกษา','สร้างภาพลวงตา','ล่องหน','พลังจิตเคลื่อนย้ายสิ่งของ','ควบคุมสภาพอากาศ','แปลงร่างเป็นสัตว์ป่า','ฟื้นฟูตนเอง'
    ];
    // เพิ่ม 'ตัว/ครั้ง' เข้าไปให้เรียงลำดับถูก
    const COUNT_ORDER = ['ครั้ง/วัน','ตัว/โพสต์','ตัว/ครั้ง'];   
    const PLAIN_LABELS = ['ลักษณะ','ลักษณะการใช้งาน','ทิศทาง/ความรุนแรง']; 
    
    // ตั้งค่าหน่วยที่จะให้ดึงเป็น "พลัง" ใส่ช่องกรอกอัตโนมัติ (รองรับทั้ง 2 แบบ)
    const POWER_UNITS = ['ตัว/โพสต์', 'ตัว/ครั้ง'];                 

    const $ = (s: string) => document.querySelector(s) as HTMLElement;
    const esc = (s: any) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c));
    
    // ฟังก์ชันใหม่: ป้องกัน XSS แต่ยังอนุญาตแท็ก <b> และ <i> ได้
    const allowHtmlTags = (s: any) => {
        let escaped = esc(s);
        // แปลงกลับเฉพาะ <b>, </b>, <i>, </i>
        return escaped
            .replace(/&lt;b&gt;/g, '<b>').replace(/&lt;\/b&gt;/g, '</b>')
            .replace(/&lt;i&gt;/g, '<i>').replace(/&lt;\/i&gt;/g, '</i>');
    };

    const rk = (r: any) => Number(r).toString();
    
    const rname = (n: any) => (!n || n==='-') ? '' : n;
    const fmt = (x: any) => (Math.round(x*100)/100).toLocaleString('en-US',{maximumFractionDigits:2});
    const toNum = (v: any) => { const x = parseFloat(String(v).replace(',','.')); return isFinite(x) ? x : 0; };
    const SPARK = '<svg viewBox="0 0 24 24"><path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z"/></svg>';
    const orn = `<div class="orn">${SPARK}</div>`;
    const ICON: Record<string, string> = {
      save:'<svg viewBox="0 0 24 24"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg>',
      calc:'<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="3"/><path d="M8 7h8M8 12h2M12 12h2M8 16h2M12 16h2M16 12v4"/></svg>',
      fairies:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-2-3-2-8c0-3.5 2-6 2-6s2 2.5 2 6c0 5-2 8-2 8z"/><path d="M10 14c-3.5 0-7-2-7-6s4-4 7-4"/><path d="M14 14c3.5 0 7-2 7-6s-4-4-7-4"/><path d="M10 20c-3.5 0-7-1-7-4s3-3 7-3"/><path d="M14 20c3.5 0 7-1 7-4s-3-3-7-3"/></svg>', 
      rank:'<svg viewBox="0 0 24 24"><path d="M12 3l9 4.5-9 4.5-9-4.5z"/><path d="M3 12l9 4.5 9-4.5"/><path d="M3 16.5L12 21l9-4.5"/></svg>',
      amulet:'<svg viewBox="0 0 24 24"><path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18M9 4l-1 5 4 11 4-11-1-5"/></svg>',
      spirit:'<svg viewBox="0 0 24 24"><circle cx="6.5" cy="10" r="1.8"/><circle cx="10" cy="6" r="1.8"/><circle cx="14" cy="6" r="1.8"/><circle cx="17.5" cy="10" r="1.8"/><path d="M12 12c-3 0-5 3-5 5 0 2 2 2.5 5 2.5s5-.5 5-2.5c0-2-2-5-5-5z"/></svg>',
      pact:'<svg viewBox="0 0 24 24"><path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></svg>'
    };
    const TABS = [
      {id:'fairies', label:'แฟรี่', title:'รายชื่อแฟรี่', en:'Fairies'},
      {id:'rank', label:'ระดับขั้น', title:'ความสามารถตามระดับขั้น', en:'Ranks'},
      {id:'amulet', label:'เครื่องราง', title:'เครื่องรางประจำเผ่าพันธุ์', en:'Amulets'},
      {id:'spirit', label:'สัตว์แฝง', title:'โบนัสสัตว์แฝงตามระดับความหายาก', en:'Spirit Animals'},
      {id:'pact', label:'พันธสัญญา', title:'พันธสัญญาแห่งชีวิตในพงไพร', en:'Wildbound Powers'}
    ];

    let DATA: any, tab = 'fairies', rankFilter = 'all';
    let M: any = {};

    function index(){
      DATA.fairies.sort((a:any,b:any)=>Number(b.rank_level)-Number(a.rank_level)||a.id-b.id);
      DATA.ranks.sort((a:any,b:any)=>Number(b.rank_level)-Number(a.rank_level));
      M.rank = Object.fromEntries(DATA.ranks.map((r:any)=>[rk(r.rank_level),r]));
      M.amulet = Object.fromEntries(DATA.amulets.map((a:any)=>[a.amulet_name,a]));
      M.rarity = Object.fromEntries(DATA.rarities.map((r:any)=>[r.rarity,r]));
      M.pact = Object.fromEntries(DATA.pacts.map((p:any)=>[p.power_name,p]));
      M.person = Object.fromEntries(DATA.fairies.map((p:any)=>[p.id,p]));
      DATA.conditions = DATA.conditions || [];
      
      // อ่านค่าจาก URL ตอนโหลดเพื่อเปิดหน้าเดิม
      if (window.location.hash) {
          const match = window.location.hash.match(/^#\/([a-z]+)/);
          if (match && TABS.some(t => t.id === match[1])) {
              tab = match[1];
          }
      }
    }
    const condsOf = (name: string) => DATA.conditions.filter((c:any)=>c.skill_name && (name===c.skill_name || name.startsWith(c.skill_name) || c.skill_name.startsWith(name)));

    const IMG_ATTR = 'referrerpolicy="no-referrer" crossOrigin="anonymous" decoding="async"';
    const avatar = (m:any) => `<span class="av" style="background:${esc(m.wing_color)}">${m.image_url?`<img src="${esc(m.image_url)}" alt="" loading="lazy" ${IMG_ATTR}>`:''}</span>`;
    
    // ปรับให้ใช้ allowHtmlTags แทน esc ธรรมดา
    const inline = (t:string) => allowHtmlTags(t).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/__(.+?)__/g,'<u>$1</u>');
    
    function richBlock(text: string){
      return String(text ?? '').split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{
        if(l.startsWith('!')) return `<p class="note warn">${inline(l.replace(/^!+\s*/,''))}</p>`;
        if(l.startsWith('>')) return `<p class="note trait">${inline(l.replace(/^>+\s*/,''))}</p>`;
        if(l.startsWith('**') && !/^\*\*.+\*\*/.test(l)) return `<p class="note warn">${inline(l.replace(/^\*+\s*/,''))}</p>`;
        return `<p>${inline(l)}</p>`;
      }).join('');
    }
    const tag = (t:string,cls='') => `<span class="tag ${cls}">${esc(t)}</span>`;
    const rarityTag = (r:string) => r ? tag(r,'r-'+r) : '';
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
          if(isNum(v)){ const {base,unit} = splitUnit(k); s.counts.push({label: base.startsWith('จำนวน')?'':base, value:Number(v), unit}); }
          else if(v!=null && String(v).trim()!=='') s.details.push({label: PLAIN_LABELS.includes(k)?'':k, text:String(v)});
        });
      } else if(val!=null && String(val).trim()!=='') s.details.push({label:'', text:String(val)});
      s.counts.sort((a:any,b:any)=>orderIdx(COUNT_ORDER,a.unit)-orderIdx(COUNT_ORDER,b.unit));
      s.details.sort((a:any,b:any)=>(a.label?1:0)-(b.label?1:0));
      
      // ดึงค่าพลังอัตโนมัติจากหน่วย "ตัว/โพสต์" หรือ "ตัว/ครั้ง"
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
          .sort((a,b)=>orderIdx(SKILL_ORDER,a.name)-orderIdx(SKILL_ORDER,b.name))
          .map((s,i)=>({...s,id:g+String(i)}));
      });
      return out;
    }
    const countText = (c:any) => `${c.label?c.label+' ':''}${fmt(c.value)}${c.unit?' '+c.unit:''}`;
    function skillRows(list:any[]){
      if(!list.length) return '<div class="none">ไม่มีข้อมูล</div>';
      return list.map(s=>{
        const dets = [...s.details, ...condsOf(s.name).map((c:any)=>({label:'เงื่อนไข', text:c.condition_text}))];
        return `<div class="sk"><div class="sk-h"><span class="sk-n">${esc(s.name)}</span>
        <span class="sk-c">${s.counts.map((c:any)=>`<span class="cn">${c.label?`<em>${esc(c.label)}</em>`:''}<b>${esc(fmt(c.value))}</b>${c.unit?`<small>${esc(c.unit)}</small>`:''}</span>`).join('')}</span></div>
        ${dets.length?`<div class="sk-d">${dets.map(d=>`<p>${d.label?`<em>${esc(d.label)}</em>`:''}${inline(d.text).replace(/\n/g,'<br>')}</p>`).join('')}</div>`:''}</div>`;
      }).join('');
    }
    function skillBlock(r:any){
      const s = skillsOf(r);
      return ['combat','other'].filter(g=>s[g].length).map(g=>`<div class="sec-h">${GROUP_NAMES[g as keyof typeof GROUP_NAMES]}</div>${skillRows(s[g])}`).join('')
        || '<div class="none">ไม่มีข้อมูล</div>';
    }
    function head(t:any){
      return `<div class="head"><h1>${esc(t.en)}</h1><p>${esc(t.title)}</p></div>${orn}`;
    }

    function viewFairies(){
      const ranks = [...new Set(DATA.fairies.map((m:any)=>rk(m.rank_level)))];
      const chips = ['all',...ranks].map(r=>`<button class="chip" type="button" data-filter="${r}" aria-pressed="${rankFilter===r}">${r==='all'?'ทั้งหมด':'Rank '+r}</button>`).join('');
      const list = ranks.filter(r=>rankFilter==='all'||rankFilter===r).map(r=>{
        const people = DATA.fairies.filter((m:any)=>rk(m.rank_level)===r);
        return `<section class="group"><div class="group-h"><span class="n">${r}</span><span class="t">${esc(rname(M.rank[r as string]?.rank_name))}</span></div>
          <div class="grid">${people.map((m:any)=>`
            <button class="mcard" type="button" data-open="${m.id}">${avatar(m)}
              <span class="mcard-info">
                <span class="nm">${esc(m.name)}</span>
                <span class="meta">${m.amulet_name?tag(m.amulet_name):''}${m.spirit_animal_name?rarityTag(m.spirit_animal_rarity):''}${m.pact_power_name?tag('พันธสัญญา','pact'):''}</span>
              </span>
            </button>`).join('')}</div></section>`;
      }).join('');
      return `<div class="chips">${chips}</div>${list}`;
    }
    function viewRank(){
      return `<div class="pcols">`+DATA.ranks.map((r:any)=>`<div class="panel">
        <div class="who"><div class="rk"><b>${rk(r.rank_level)}</b>Rank</div><h3>${esc(rname(r.rank_name))}</h3></div>
        ${skillBlock(r)}</div>`).join('')+`</div>`;
    }
    function viewAmulet(){
      return `<div class="pcols">`+DATA.amulets.map((a:any)=>{
        const wearers = DATA.fairies.filter((m:any)=>m.amulet_name===a.amulet_name);
        return `<div class="panel"><h3>${esc(a.amulet_name)}</h3><div class="sub">${a.abilities.length} ความสามารถ</div>
          <div style="margin-top:8px">${a.abilities.map(abilityHTML).join('')}</div>
          <div class="sec-h" style="margin-top:16px;">ผู้สวมใส่ (${wearers.length})</div>
          <div class="owners" style="margin-top:4px">${wearers.map(personChip).join('')||'<span class="none">ยังไม่มี</span>'}</div></div>`;
      }).join('')+`</div>`;
    }
    function viewSpirit(){
      return `<div class="pcols">`+DATA.rarities.slice().sort((a:any,b:any)=>(b.atk_bonus+b.def_bonus)-(a.atk_bonus+a.def_bonus)).map((r:any)=>{
        const owners = DATA.fairies.filter((m:any)=>m.spirit_animal_rarity===r.rarity);
        return `<div class="panel"><div>${rarityTag(r.rarity)}</div>
          <div class="two">
            <div class="stat">โจมตี<b>+${r.atk_bonus}</b><div class="bar atk"><i style="width:${r.atk_bonus/15*100}%"></i></div></div>
            <div class="stat">ป้องกัน<b>+${r.def_bonus}</b><div class="bar def"><i style="width:${r.def_bonus/15*100}%"></i></div></div>
          </div>
          <div style="margin-top:16px;">
            ${owners.length?`<div class="sec-h">สัตว์แฝงในระดับนี้</div>`+owners.map((m:any)=>`<div class="kv"><span>${esc(m.spirit_animal_name)}<br><small>${esc(m.spirit_animal_type)}</small></span><button class="owner" type="button" data-open="${m.id}">${esc(m.name)}</button></div>`).join(''):''}
          </div>
        </div>`;
      }).join('')+`</div>`;
    }
    function viewPact(){
      return `<div class="pcols">`+DATA.pacts.map((p:any)=>{
        const owners = DATA.fairies.filter((m:any)=>m.pact_power_name===p.power_name);
        return `<div class="panel"><h3>${esc(p.power_name)}</h3>
          <div style="margin-top:8px">${richBlock(p.description)}</div>
          <div style="margin-top:auto; padding-top:16px;">
            ${owners.length?`<div class="sec-h">ผู้ทำพันธสัญญา</div><div class="owners" style="margin-top:4px">${owners.map(personChip).join('')}</div>`:''}
          </div></div>`;
      }).join('')+`</div>`;
    }
    const VIEWS:any = {fairies:viewFairies,rank:viewRank,amulet:viewAmulet,spirit:viewSpirit,pact:viewPact};

    function viewPerson(m:any){
      const r = M.rank[rk(m.rank_level)], am = M.amulet[m.amulet_name], ra = M.rarity[m.spirit_animal_rarity], pc = M.pact[m.pact_power_name];
      const hero = m.image_url
        ? `<div class="hero"><img src="${esc(m.image_url)}" alt="${esc(m.name)}" ${IMG_ATTR}>`
        : `<div class="hero noimg"><span class="glow" style="background:${esc(m.wing_color)}"></span>`;
      return hero + `<div class="hero-t"><h2>${esc(m.name)}</h2>
          <div class="rk"><b>${rk(m.rank_level)}</b><span style="font-family: var(--sans);">${esc(rname(r?.rank_name))}</span></div></div></div>
        <div class="pbody">
        <div class="owners"><span class="tag swatch"><i style="background:${esc(m.wing_color)}"></i>สีปีก ${esc(m.wing_color)}</span></div>
        ${orn}
        <div class="sec-h">ความสามารถ</div>
        ${skillBlock(r)}
        <div class="sec-h" style="margin-top:22px">เครื่องราง</div>
        ${am?`<b>${esc(am.amulet_name)}</b>${am.abilities.map(abilityHTML).join('')}`:'<div class="none">ไม่มีเครื่องราง</div>'}
        <div class="sec-h" style="margin-top:22px">สัตว์แฝง</div>
        ${m.spirit_animal_name?`<div class="kv"><span>ชื่อ</span><b>${esc(m.spirit_animal_name)}</b></div>
          <div class="kv"><span>ชนิด</span><b>${esc(m.spirit_animal_type)}</b></div>
          <div class="kv"><span>ระดับ</span><b>${rarityTag(m.spirit_animal_rarity)}</b></div>${ra?`<div class="kv"><span>โบนัส</span><b>โจมตี +${ra.atk_bonus} | ป้องกันเจ้าของ ${ra.def_bonus} ครั้ง</b></div>`:''}`
          :'<div class="none">ยังไม่มีสัตว์แฝง</div>'}
        <div class="sec-h" style="margin-top:22px">พันธสัญญา</div>
        ${pc?`<b>${esc(pc.power_name)}</b><div style="margin-top:4px">${richBlock(pc.description)}</div>`:'<div class="none">ยังไม่มีพันธสัญญา</div>'}
        <div class="foot">Fairies</div></div>`;
    }

    const CALC_EXCLUDE = ['สร้างม่านแสงบดบังทัศนวิสัยศัตรู','สร้างเกราะป้องกัน', 'เยียวยา', 'สร้างพืชพรรณปกคลุมพื้นที่', 'ใช้เถาวัลย์ช่วยเหลือ', 'มอบพรแห่งพฤกษา', 'ล่องหน', 'สร้างภาพลวงตา', 'พลังจิตเคลื่อนย้ายสิ่งของ', 'ควบคุมสภาพอากาศ', 'แปลงร่างเป็นสัตว์ป่า', 'ฟื้นฟูตนเอง', 'วงดอกไม้หรือเถาวัลย์ป้องกันพื้นที่'];   
    const calcSkills = (r:any) => skillsOf(r).combat.filter((s:any)=>!CALC_EXCLUDE.some(x=>s.name.startsWith(x)));
    let CALC:any = {pid:null, skills:{}, amulet:false, spirit:false, buffs:[]};
    function calcReset(m:any){
      CALC = {pid:m.id, skills:{}, amulet:false, spirit:false, buffs:[]};
      calcSkills(M.rank[rk(m.rank_level)]).forEach((s:any)=>{ CALC.skills[s.id] = {on:false, power: s.power!=null ? String(s.power) : ''}; });
    }
    function calcRun(m:any){
      const ra = M.rarity[m.spirit_animal_rarity], steps = [];
      let base = 0;
      calcSkills(M.rank[rk(m.rank_level)]).forEach((s:any)=>{ const c = CALC.skills[s.id]; if(c && c.on) base += toNum(c.power); });
      steps.push(['พลังจากสกิลที่เลือก', base]);
      let cur = base;
      if(CALC.amulet){ cur *= 2; steps.push(['×2 จากเครื่องรางอัพเกรดเมื่ออยู่ใกล้แหล่งพืชพรรณ', cur]); }
      CALC.buffs.forEach((b:any)=>{
        if(String(b.v).trim()==='') return;
        const v = toNum(b.v);
        cur = b.op==='+' ? cur+v : cur*v;
        steps.push([`บัพ ${b.op} ${fmt(v)}`, cur]);
      });
      if(CALC.spirit && ra){ cur += ra.atk_bonus; steps.push([`สัตว์แฝง + ${ra.atk_bonus}`, cur]); }
      return {steps, total:cur};
    }
    function calcOut(){
      const m = M.person[CALC.pid]; if(!m || !$('#calcOut')) return;
      const {steps,total} = calcRun(m);
      $('#calcOut').innerHTML = steps.map(s=>`<div class="st"><span>${esc(s[0])}</span><b>${fmt(s[1])}</b></div>`).join('')
        + `<div class="total"><span>พลังโจมตีรวม</span><b>${fmt(total)}</b></div>`;
    }
    function calcHTML(m:any){
      const sk = calcSkills(M.rank[rk(m.rank_level)]), ra = M.rarity[m.spirit_animal_rarity];
      const hasSpirit = !!(m.spirit_animal_name && ra);
      const hasAmulet = (m.amulet_name === 'สร้อยประกายพฤกษ์');

      return `<h3>${ICON.calc}คำนวณพลังโจมตี</h3>
        <p class="hint">เลือกสกิลที่จะใช้ในโพสต์นั้น ๆ สามารถเลือกเพิ่มบัฟจากเผ่าอื่นด้วยตัวเองได้</p>
        <div class="sec-h" style="margin-top:14px">สกิลที่ใช้ (ต่อสู้)</div>
        ${sk.length?sk.map((s:any)=>{ const c = CALC.skills[s.id] || {on:false,power:''}; return `
          <div class="cs"><label class="sw"><input type="checkbox" data-c="skill" data-id="${esc(s.id)}" ${c.on?'checked':''}><span class="tg"></span>
            <span class="sw-t">${esc(s.name)}${s.counts.length?`<small>${esc(s.counts.map(countText).join(', '))}</small>`:''}</span></label>
            <input class="num" inputmode="decimal" placeholder="พลัง" data-c="power" data-id="${esc(s.id)}" value="${esc(c.power)}" ${c.on?'':'disabled'} aria-label="พลังของ ${esc(s.name)}"></div>`; }).join(''):'<div class="none">ไม่มีสกิลต่อสู้</div>'}
        <div class="sec-h" style="margin-top:18px">ตัวเลือก</div>
        
        <label class="sw ${hasAmulet?'':'off'}"><input type="checkbox" data-c="amulet" ${CALC.amulet&&hasAmulet?'checked':''} ${hasAmulet?'':'disabled'}><span class="tg"></span>
          <span class="sw-t">×2 จากเครื่องรางอัพเกรดเมื่ออยู่ใกล้แหล่งพืชพรรณ<small>${hasAmulet?'สร้อยประกายพฤกษ์':(m.amulet_name?esc(m.amulet_name):'ไม่มีเครื่องราง')}</small></span></label>
          
        <label class="sw line ${hasSpirit?'':'off'}"><input type="checkbox" data-c="spirit" ${CALC.spirit&&hasSpirit?'checked':''} ${hasSpirit?'':'disabled'}><span class="tg"></span>
          <span class="sw-t">ใช้สัตว์แฝง<small>${hasSpirit?`บวก ATK +${ra.atk_bonus}`:'ไม่มีสัตว์แฝง'}</small></span></label>
          
        <div class="sec-h" style="margin-top:18px">บัพจากคนอื่น</div>
        ${CALC.buffs.map((b:any,i:number)=>`<div class="bf">
          <div class="seg" role="group" aria-label="ชนิดบัพ">
            <button type="button" data-c="op" data-i="${i}" data-op="+" aria-pressed="${b.op==='+'}">+</button>
            <button type="button" data-c="op" data-i="${i}" data-op="×" aria-pressed="${b.op==='×'}">×</button></div>
          <input class="num" inputmode="decimal" placeholder="จำนวน" data-c="buff" data-i="${i}" value="${esc(b.v)}" aria-label="จำนวนบัพ">
          <button class="ico" type="button" data-c="rmbuff" data-i="${i}" aria-label="ลบบัพ"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>`).join('')}
        <button class="add" type="button" data-c="addbuff">+ เพิ่มบัพ</button>
        <div class="out" id="calcOut"></div>`;
    }
    function renderCalc(){
      const m = M.person[CALC.pid]; if(!m) return;
      $('#calc').innerHTML = calcHTML(m); calcOut();
    }

    let listScroll = 0;
    const personId = () => { const m = location.hash.match(/^#\/m\/(\d+)/); return m ? Number(m[1]) : null; };

    function render(){
      const id = personId(), m = id && M.person[id];
      const cap = $('#capture'), calc = $('#calc');
      const pgrid = $('#pgrid');
      const topbar = $('#top');
      
      pgrid.classList.remove('fade-enter');
      topbar.classList.remove('fade-enter');
      void pgrid.offsetWidth; 

      if (m){
        pgrid.className = 'pgrid two fade-enter';
        cap.className = 'person';
        topbar.className = 'bar-top fade-enter';
        topbar.innerHTML = `<button class="back" type="button" data-act="back"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>กลับ</button>
          <button class="hex" type="button" data-act="save">${ICON.save}บันทึกภาพ</button>`;
        topbar.hidden = false;
        $('#view').innerHTML = viewPerson(m);
        if(CALC.pid !== m.id) calcReset(m);
        calc.hidden = false; renderCalc();
        document.title = m.name + ' · Fairy - Elysian Curse 2026';
        window.scrollTo(0,0);
      } else {
        pgrid.className = 'pgrid fade-enter';
        cap.className = 'list';
        topbar.hidden = true;
        topbar.innerHTML = '';
        calc.hidden = true;
        topbar.className = 'bar-top';

          const t = TABS.find(x => x.id === tab);

      if (!t) {
      return;
    }

      $('#view').innerHTML =
        head(t) +
        VIEWS[tab]() +
        `<div class="foot">${esc(t.en)}</div>`;

      document.title = 'Fairy - Elysian Curse 2026';
    }

    $('#nav').innerHTML = TABS.map(x=>`<button type="button" data-tab="${x.id}" aria-current="${!m && x.id===tab}">${ICON[x.id]}<span>${x.label}</span></button>`).join('');
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
        
        // --- ส่วนที่ 1: ตรวจจับและซ่อนภาพที่เสีย เพื่อไม่ให้ html-to-image พัง ---
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

        // ซ่อนภาพชั่วคราว
        brokenImgs.forEach((img: HTMLImageElement) => {
          img.style.display = 'none';
        });
        // -----------------------------------------------------------

        // แก้ปัญหาภาพเว้นว่าง (Blank Image) บนมือถือ: 
        // 1. ลด Ratio บนมือถือเพื่อไม่ให้เกิน Canvas Memory Limit ของ iOS
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const ratio = isMobile ? 1.5 : Math.max(1, Math.min(3, 12000 / node.scrollHeight));
        
        // --- ปรับแต่ง DOM ก่อนถ่ายภาพ ---
        const originalBorderRadius = node.style.borderRadius;
        const originalBorder = node.style.border;
        node.style.borderRadius = '0';
        node.style.border = 'none';

        const watermark = document.createElement('div');
        watermark.innerHTML = '© vivalavivie 2026';
        watermark.style.cssText = 'text-align: center; color: rgba(57, 132, 82, 0.7); padding: 16px; font-size: 13px; font-family: var(--sans); border-top: 1px dashed rgba(180,205,255,0.2); margin-top: 10px; letter-spacing: 0.5px;';
        
        const pbody = node.querySelector('.pbody');
        const oldFoot = node.querySelector('.foot') as HTMLElement | null;
        
        if (pbody) pbody.appendChild(watermark);
        if (oldFoot) oldFoot.style.display = 'none';
        // ----------------------------------

        // 2. ทริคสำหรับ iOS Safari: เรนเดอร์หลอก 1 ครั้งเพื่อโหลดฟอนต์/รูปภาพลง Canvas
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            await htmlToImage.toBlob(node, { pixelRatio: 1, style: { margin: '0' } }).catch(() => {});
        }

        const blob = await htmlToImage.toBlob(node, {
          pixelRatio: ratio, 
          cacheBust: true, 
          backgroundColor: '#05140b',
          style: {
            margin: '0',
          }
        });
        
        // --- คืนค่า DOM กลับสู่สภาพเดิม ---
        node.style.borderRadius = originalBorderRadius;
        node.style.border = originalBorder;
        if (pbody && watermark.parentNode === pbody) pbody.removeChild(watermark);
        if (oldFoot) oldFoot.style.display = '';
        
        // นำภาพที่ซ่อนกลับมาแสดงใหม่
        brokenImgs.forEach((img: HTMLImageElement) => {
          img.style.display = '';
        });
        // ----------------------------------

        if (!blob) {
          toast('บันทึกภาพไม่สำเร็จ (ไม่พบข้อมูลภาพ)');
          return;
        }

        const fileName = name.replace(/[^\w\u0E00-\u0E7F-]+/g,'_') + '.png';

        // --- แก้ปัญหาเซฟในมือถือแล้วเข้าแอป Books ---
        if (isMobile && navigator.share) {
            try {
                const file = new File([blob], fileName, { type: 'image/png' });
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: fileName,
                    });
                    toast('แชร์หรือบันทึกภาพเรียบร้อย');
                    return; // ถ้าแชร์สำเร็จจบการทำงาน
                }
            } catch (err: any) {
                // ถ้า user กดยกเลิก ไม่ต้องทำอะไร
                if (err.name === 'AbortError') return;
            }
        }
        
        // Desktop fallback หรือถ้า navigator.share พัง
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
        console.error(e); toast('บันทึกภาพไม่สำเร็จ ลองอีกครั้ง');
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
            // อัปเดต URL เพื่อให้จำหน้าเวลา refresh
            window.location.hash = `#/${tab}`;
            render(); 
            window.scrollTo({top:0,behavior:'smooth'}); 
        }
      }
      else if(d.filter){ rankFilter = d.filter; render(); }
      else if(d.open){ if(!personId()) listScroll = window.scrollY; location.hash = '#/m/' + d.open; }
      else if(d.act==='back'){ if(history.length>1) history.back(); else location.hash=''; }
      else if(d.act==='save'){ const m = M.person[personId() as number]; saveNode($('#capture'), m ? m.name : 'fairies'); }
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
      if(d.c==='skill'){
        CALC.skills[d.id as string].on = target.checked;
        const inp = document.querySelector(`input[data-c="power"][data-id="${CSS.escape(d.id as string)}"]`) as HTMLInputElement;
        if(inp){ inp.disabled = !target.checked; if(target.checked) inp.focus(); }
      }
      else if(d.c==='amulet') CALC.amulet = target.checked;
      else if(d.c==='spirit') CALC.spirit = target.checked;
      else return;
      calcOut();
    });

    window.addEventListener('hashchange', ()=>{
      // ตรวจสอบว่าถ้า hash เป็นแค่ชื่อ tab ให้ไม่ต้อง render ใหม่แบบหน้ารายคน
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
        const r = await fetch('/api/fairy2026'); if(!r.ok) throw new Error(String(r.status));
        DATA = await r.json();
      }catch(e){
        DATA = FALLBACK; $('#demo').hidden = false;
      }
      index(); render();
      // เมื่อโหลดและประมวลผลเสร็จ หน่วงเวลาเล็กน้อยเพื่อซ่อนหน้าโหลด
      setTimeout(() => setIsLoading(false), 600);
    })();

  }, []); // ปิด useEffect

  return (
    <>
      {/* ========================================== */}
      {/* เปลี่ยนภาพไอคอนของแท็บ (Favicon) เฉพาะหน้านี้ ตรงนี้ครับ */}
      <link rel="icon" type="image/jpeg" href="https://iili.io/nchwsNs.png" />
      {/* ========================================== */}
      
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300..700&display=swap');
        @import url('https://midsummer-reverie.github.io/font-face/ophelia.css');

        :root{
          --bg0:#05140b; --bg1:#0b2e17;
          --text:#eefeff; --muted:#9dcba9; --ice:#bcfacb; --frost:#7fffaa;
          --line:rgba(180,255,200,.26); --line-soft:rgba(180,255,200,.14);
          --amber:#f2d15a; --amber-d:#c9a62c;
          --panel:linear-gradient(160deg,rgba(150,255,180,.12),rgba(70,210,100,.05));
          --card-bg:linear-gradient(165deg,#124a22 0%,#0b2615 55%,#081c10 100%);
          --sans:'Google Sans','Noto Sans Thai',system-ui,-apple-system,'Segoe UI',sans-serif;
          --display:'ophelia','Noto Serif Thai',Georgia,serif;
        }
        
        /* แก้ปัญหาสีขาวตอน Overscroll ในมือถือ */
        html, body {
          background-color: var(--bg0);
          margin: 0;
        }
        
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        html{scroll-padding-top:env(safe-area-inset-top,0px)}
        
        /* สไตล์สำหรับหน้าโหลดเฉพาะ Fairies */
        .merfolk-loader {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: radial-gradient(circle at 50% 40%, #0b2e17, #05140b 80%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--ice);
          font-family: var(--sans);
          transition: opacity 0.8s ease, visibility 0.8s ease;
        }
        .merfolk-loader.fade-out {
          opacity: 0;
          visibility: hidden;
        }
        .merfolk-loader .ring {
          width: 64px;
          height: 64px;
          border: 3px solid rgba(180, 255, 200, 0.1);
          border-top-color: var(--frost);
          border-radius: 50%;
          animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          margin-bottom: 20px;
          box-shadow: 0 0 20px rgba(127, 255, 169, 0.2);
        }
        .merfolk-loader p {
          font-size: 15px;
          letter-spacing: 0.05em;
          animation: pulseText 2s ease-in-out infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulseText {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; text-shadow: 0 0 10px rgba(188, 255, 214, 0.5); }
        }

        .merfolk-wrapper {
          margin:0;min-height:100dvh;color:var(--text);font-family:var(--sans);font-size:15px;line-height:1.65;
          background:
            radial-gradient(900px 520px at 88% -8%,rgba(86,255,136,.18),transparent 62%),
            radial-gradient(700px 520px at -5% 42%,rgba(60,225,175,.08),transparent 62%),
            linear-gradient(180deg,var(--bg1),var(--bg0) 70%);
          background-attachment:fixed;
          padding:env(safe-area-inset-top,0px) 0 0;
          word-break:normal;overflow-wrap:break-word;line-break:auto;
        }
        .merfolk-wrapper::before{
          content:"";position:fixed;inset:0;pointer-events:none;opacity:.7;
          background-image:
            radial-gradient(1.5px 1.5px at 12% 18%,#cfffce,transparent),
            radial-gradient(1px 1px at 78% 12%,#fff,transparent),
            radial-gradient(1.5px 1.5px at 62% 34%,#a9ffc4,transparent),
            radial-gradient(1px 1px at 28% 52%,#fff,transparent),
            radial-gradient(1.5px 1.5px at 90% 64%,#cfffce,transparent),
            radial-gradient(1px 1px at 8% 82%,#fff,transparent),
            radial-gradient(1.5px 1.5px at 48% 90%,#a9ffc4,transparent);
        }
        
        [hidden]{display:none!important}
        button{font:inherit;color:inherit;cursor:pointer}
        p,.sk-d,.ab p,.hint,.none{text-wrap:pretty}
        h1,h2,h3,.nm,.sk-n,.sw-t{text-wrap:balance}
        :focus-visible{outline:2px solid var(--ice);outline-offset:2px}
        .disp{font-family:var(--display);font-weight:400}

        .wrap{position:relative;max-width:1200px;margin:0 auto;padding:18px 16px calc(120px + env(safe-area-inset-bottom,0px))}
        @media(min-width:900px){ .merfolk-wrapper{font-size:16px} .wrap{padding:28px 28px calc(120px + env(safe-area-inset-bottom,0px))}}

        .fade-enter { animation: fadeEnter 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes fadeEnter {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .head h1{margin:0;font-family:var(--display);font-weight:400;font-size:clamp(36px,9vw,56px);line-height:1.05;letter-spacing:.02em;color:#fff}
        .head p{margin:4px 0 0;color:var(--muted);font-size:14px}
        .orn{display:flex;align-items:center;gap:10px;margin:16px 0 18px;color:var(--ice)}
        .orn::before,.orn::after{content:"";height:1px;flex:1;background:linear-gradient(90deg,transparent,var(--line),transparent)}
        .orn svg{width:14px;height:14px;fill:currentColor;opacity:.9}

        .hex{
          --c:12px;border:0;padding:9px 20px 9px 16px;display:inline-flex;align-items:center;gap:8px;white-space:nowrap;
          font-weight:600;font-size:14px;color:#2a1604;
          background:linear-gradient(180deg,#ffeba8,var(--amber) 55%,var(--amber-d));
          clip-path:polygon(var(--c) 0,calc(100% - var(--c)) 0,100% 50%,calc(100% - var(--c)) 100%,var(--c) 100%,0 50%);
          min-height:42px;transition:filter .15s;
        }
        .hex:hover{filter:brightness(1.08)}
        .hex:active{filter:brightness(.92)}
        .hex svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}

        .chips{display:flex;gap:8px;overflow-x:auto;padding:2px 0 14px;scrollbar-width:none}
        .chips::-webkit-scrollbar{display:none}
        .chip{flex:none;white-space:nowrap;display:inline-flex;align-items:center;border:1px solid var(--line);background:rgba(120,235,150,.1);border-radius:999px;padding:6px 15px;font-size:13px;color:var(--ice);min-height:36px}
        .chip[aria-pressed="true"]{background:var(--ice);color:#081c10;border-color:var(--ice);font-weight:600}

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
        .tag{display:inline-flex;align-items:center;white-space:nowrap;font-size:12px;line-height:1.5;padding:2px 10px;border-radius:999px;border:1px solid var(--line);color:var(--ice);background:rgba(120,235,150,.1)}
        .tag.r-ธรรมดา{color:#c3e6cf;border-color:#87ad93}
        .tag.r-กลาง{color:#8fe3b2;border-color:#4cae69}
        .tag.r-สูง{color:#b3ffc9;border-color:#6fdb8c}
        .tag.r-ตำนาน{color:#ffea8a;border-color:#d6bc43}
        .tag.r-เทพเจ้า{color:#fff;border-color:#fff;background:linear-gradient(90deg,rgba(255,246,160,.35),rgba(170,255,210,.35));box-shadow:0 0 10px rgba(255,246,190,.35)}
        .tag.pact{color:#ffd9a8;border-color:rgba(242,166,90,.6);background:rgba(242,166,90,.1)}
        .none{color:var(--muted);font-size:13px}

        .who{display:flex;align-items:center;gap:14px}
        .av{flex:none;width:52px;height:52px;border-radius:50%;overflow:hidden;border:2px solid rgba(255,255,255,.7);box-shadow:0 0 0 3px rgba(130,255,170,.18),0 0 14px rgba(120,255,170,.25)}
        .av img{width:100%;height:100%;object-fit:cover;object-position:50% 18%;display:block}
        .rk{display:flex;align-items:center;gap:10px;font-family:var(--display);font-size:16px;line-height:1.2;color:var(--ice)}
        .rk b{font-family:var(--sans);font-size:32px;font-weight:500;color:#fff;margin:0;line-height:1}

        .ab{display:flex;gap:10px;padding:10px 0;border-top:1px solid var(--line-soft)}
        .ab:first-of-type{border-top:0}
        .ab::before{content:"";flex:none;width:7px;height:7px;margin-top:9px;transform:rotate(45deg);background:var(--frost);box-shadow:0 0 8px var(--frost)}
        .ab p{margin:0 0 4px}
        .ab p:last-child{margin:0}
        .note{font-size:13.5px;padding:6px 12px;border-radius:0 10px 10px 0;margin:6px 0 0}
        .note.warn{color:#ffd9a8;background:rgba(242,166,90,.1);border-left:3px solid var(--amber)}
        .note.trait{color:#d6ffd6;background:rgba(127,255,169,.12);border-left:3px solid var(--frost)}
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
        .sk-h{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:6px 12px}
        .sk-n{flex:1 1 auto;font-weight:600;color:#fff;line-height:1.45}
        .sk-c{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:6px}
        .cn{display:inline-flex;align-items:center;gap:5px;white-space:nowrap;padding:2px 11px;border-radius:999px;border:1px solid var(--line);background:rgba(120,235,150,.1);font-size:13.5px;line-height:1.5;color:#fff}
        .cn em{font-style:normal;color:var(--frost);font-size:12px}
        .cn b{font-weight:600}
        .cn small{font-weight:400;color:var(--muted);font-size:12px}
        .sk-d{margin-top:6px;color:var(--muted);font-size:14px;line-height:1.55}
        .sk-d p{margin:0}
        .sk-d p + p{margin-top:4px}
        .sk-d em{font-style:normal;color:var(--frost);font-size:12px;margin-right:4px}

        .bar{height:6px;border-radius:6px;background:rgba(150,255,180,.15);overflow:hidden;margin-top:4px}
        .bar i{display:block;height:100%;border-radius:6px}
        .bar.atk i{background:linear-gradient(90deg,#ff9a7a,#ffd08a)}
        .bar.def i{background:linear-gradient(90deg,#8ceb8c,#bcfacb)}
        .two{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:12px}
        .stat{font-size:13px;color:var(--muted)}
        .stat b{color:#fff;font-size:16px;margin-left:4px}
        .owners{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
        .owner{display:inline-flex;align-items:center;white-space:nowrap;border:1px solid var(--line);background:rgba(120,235,150,.1);color:var(--ice);border-radius:999px;padding:4px 13px;font-size:13px;min-height:32px}
        .owner:hover{border-color:var(--ice)}
        .foot{margin-top:18px;text-align:center;font-family:var(--display);font-size:13px;color:var(--muted);letter-spacing:.12em}

        .nav{
          position:fixed;left:50%;transform:translateX(-50%);bottom:calc(10px + env(safe-area-inset-bottom,0px));
          width:min(560px,calc(100% - 20px));display:flex;justify-content:space-between;gap:2px;padding:6px;z-index:20;
          background:rgba(8,28,16,.82);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);
          border:1px solid var(--line);border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.4);
        }
        .nav button{flex:1;background:none;border:0;border-radius:999px;padding:7px 2px 6px;display:flex;flex-direction:column;align-items:center;gap:1px;color:var(--muted);font-size:11px;line-height:1.3}
        .nav svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
        .nav button[aria-current="true"]{color:#fff;background:linear-gradient(180deg,rgba(130,255,170,.35),rgba(90,240,130,.18));box-shadow:inset 0 0 0 1px var(--line)}

        .pgrid{display:block}
        #capture.list{background:none;border:0;padding:0}
        #capture.person{background:var(--card-bg);border:1px solid var(--line);border-radius:26px;overflow:hidden;padding:0 0 18px;max-width:600px;margin:0 auto}
        .bar-top{display:flex;justify-content:space-between;align-items:center;max-width:600px;margin:0 auto 12px}
        .back{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:rgba(8,28,16,.9);border-radius:999px;padding:8px 16px 8px 12px;font-size:14px;color:var(--ice);min-height:42px}
        .back svg{width:16px;height:16px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
        .hero{position:relative;aspect-ratio:4/5;max-height:640px;width:100%;overflow:hidden;background:#081c10}
        .hero img{width:100%;height:100%;object-fit:cover;object-position:50% 15%;display:block}
        .hero.noimg{aspect-ratio:auto;height:190px;display:grid;place-items:center}
        .hero.noimg .glow{width:96px;height:96px;border-radius:50%;border:3px solid rgba(255,255,255,.75);box-shadow:0 0 0 8px rgba(130,255,170,.15),0 0 40px rgba(120,255,170,.4)}
        .hero::after{content:"";position:absolute;inset:auto 0 0 0;height:55%;background:linear-gradient(180deg,transparent,#081c10 92%)}
        .hero-t{position:absolute;left:18px;right:18px;bottom:6px;z-index:2}
        .hero-t h2{margin:0 0 4px;font-family:var(--display);font-weight:400;font-size:clamp(22px,6.4vw,32px);line-height:1.2;color:#fff;overflow-wrap:break-word;text-shadow:0 2px 14px rgba(0,0,0,.6)}
        .pbody{padding:0 18px}
        .swatch{display:inline-flex;align-items:center;gap:8px}
        .swatch i{width:14px;height:14px;border-radius:50%;border:1.5px solid rgba(255,255,255,.8)}

        @media(min-width:900px){
          .pgrid.two{display:grid;grid-template-columns:minmax(0,600px) minmax(0,1fr);gap:24px;align-items:start}
          .pgrid.two #capture.person{margin:0}
          .bar-top{margin-left:0}
          #calc{position:static;top:calc(16px + env(safe-area-inset-top,0px))}
        }

        #calc{margin-top:16px}
        @media(min-width:900px){#calc{margin-top:0}}
        #calc h3{display:flex;align-items:center;gap:8px;font-size:18px}
        #calc h3 svg{width:20px;height:20px;stroke:var(--frost);fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
        .hint{color:var(--muted);font-size:13px;margin:2px 0 0}
        .num{width:100%;min-height:44px;background:rgba(8,28,16,.7);border:1px solid var(--line);border-radius:12px;color:#fff;padding:0 12px;font:inherit;font-size:16px}
        .num:disabled{opacity:.4}
        .num::placeholder{color:rgba(157,220,176,.6)}
        .cs{display:grid;grid-template-columns:1fr 104px;gap:10px;align-items:center;border-top:1px solid var(--line-soft);padding:2px 0}
        .sec-h + .cs{border-top:0}
        .sw{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:48px;cursor:pointer}
        .sw.line{border-top:1px solid var(--line-soft)}
        .sw input{position:absolute;opacity:0;pointer-events:none}
        .sw .tg{flex:none;order:-1;width:46px;height:26px;border-radius:99px;background:rgba(150,255,180,.2);border:1px solid var(--line);position:relative;transition:background .15s}
        .sw .tg::after{content:"";position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:#dfffe9;transition:transform .15s}
        .sw input:checked + .tg{background:var(--frost)}
        .sw input:checked + .tg::after{transform:translateX(20px);background:#fff}
        .sw input:focus-visible + .tg{outline:2px solid var(--ice);outline-offset:2px}
        .sw .sw-t{flex:1;line-height:1.4}
        .sw .sw-t small{display:block;color:var(--muted);font-size:12px}
        .sw.off{opacity:.45;cursor:not-allowed}
        .bf{display:grid;grid-template-columns:auto 1fr 44px;gap:8px;align-items:center;margin-bottom:8px}
        .seg{display:flex;border:1px solid var(--line);border-radius:12px;overflow:hidden}
        .seg button{border:0;background:none;width:44px;min-height:44px;font-size:20px;line-height:1;color:var(--muted)}
        .seg button[aria-pressed="true"]{background:var(--ice);color:#081c10;font-weight:700}
        .ico{min-height:44px;border:1px solid var(--line);background:none;border-radius:12px;color:var(--muted);display:grid;place-items:center}
        .ico svg{width:16px;height:16px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round}
        .add{margin-top:2px;border:1px dashed var(--line);background:none;border-radius:12px;min-height:44px;width:100%;color:var(--ice)}
        .out{margin-top:18px;border-top:1px solid var(--line);padding-top:14px}
        .st{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:3px 0;font-size:14px;color:var(--muted)}
        .st b{color:var(--text);font-weight:500}
        .total{display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding:12px 14px;border-radius:16px;background:linear-gradient(160deg,rgba(130,255,170,.28),rgba(80,240,120,.12));border:1px solid var(--line)}
        .total span{color:var(--ice)}
        .total b{font-family:var(--sans);font-weight:500;font-size:40px;line-height:1.1;color:#fff;text-shadow:0 0 18px rgba(130,255,170,.6)}

        #demo{margin:0 0 12px;padding:8px 14px;border-radius:12px;background:rgba(242,166,90,.12);border:1px solid rgba(242,166,90,.4);color:#ffd9a8;font-size:13px}
        #toast{position:fixed;left:50%;bottom:calc(92px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:60;background:#eaffef;color:#081c10;padding:8px 18px;border-radius:999px;font-size:14px;font-weight:500;opacity:0;pointer-events:none;transition:opacity .2s}
        #toast.on{opacity:1}
        @media(prefers-reduced-motion:reduce){*{transition:none!important}}
      `}} />

      <div className="merfolk-wrapper">
        <div className={`merfolk-loader ${!isLoading ? 'fade-out' : ''}`}>
          <div className="ring"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>

        <div className="wrap">
          <div id="demo" hidden>กำลังแสดงข้อมูลตัวอย่าง เพราะยังเชื่อมต่อฐานข้อมูลไม่ได้ (/api/fairy2026)</div>
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