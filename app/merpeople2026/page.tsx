"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";

export default function MerpeoplePage() {
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
        {power_name:'แมงกะพรุนกล่อง',description:'มีรยางค์ยาวที่สามารถรัดตัวเป้าหมาย และสามารถปล่อยพิษที่ทำให้เกิดอาการชา ไปจนถึงหายใจลำบากและหมดสติ หากเป้าหมายมีขนาดใหญ่หรือแข็งแกร่งมากประสิทธิภาพของพลังจะลดลง'},
        {power_name:'ปลากระเบนไฟฟ้า',description:'ปล่อยคลื่นกระแสไฟฟ้าตรงหาเป้าหมาย กระแสไฟฟ้าที่แฝงไปกับคลื่นจะแล่นเข้าช็อตระบบประสาทส่วนกลางโดยตรง ทำให้กล้ามเนื้อหดตัวอย่างรุนแรงจนเกิดอาการชา อัมพาตเฉียบพลัน ขยับตัวไม่ได้'},
        {power_name:'ปลาหมึกเลียนแบบ',description:'เลียนแบบการเคลื่อนไหวและรูปร่างของเป้าหมาย โดยการเปลี่ยนสี ผิวหนัง และรูปร่างให้มีลักษณะเดียวกับเป้าหมาย'},
        {power_name:'กั้งตั๊กแตนเจ็ดสี',description:'มีความเร็วของหมัดเร็วถึงแปดสิบกิโลเมตรต่อชั่วโมง ความเร็วและความรุนแรงทำให้ศัตรูยากที่จะหลบหลีกใช้ทำลายเกราะหรือพื้นผิวที่มีความแข็งแรงมากได้ โดยการใช้หมัดตนเองจะไม่ได้รับความเสียหาย นอกจากนี้หากใช้ความสามารถในน้ำ หมัดที่ชกจะทำให้น้ำร้อนขึ้นมาจนเป็นฟองอากาศจำนวนมากไปแตกใส่ตัวศัตรู ทำให้ได้รับความเสียหายจากหมัดโดยตรงรวมไปถึงฟองอากาศ'}],
      amulets:[
        {amulet_name:'สร้อยสีทันดร',abilities:['จะทำให้ร่างกายไม่มีทางเกิดอาการขาดน้ำได้ นอกจากว่าจะถูกไฟคลอกร่างกาย','ช่วยป้องกันไม่ให้เกิดเรื่องการโดนน้ำแล้วทำให้เปลี่ยนจากขาเป็นหางในทันที','สามารถเลือกเปลี่ยนจากขาเป็นหางได้เมื่ออยู่ในน้ำ']},
        {amulet_name:'สร้อยวารีนิรันดร',abilities:[
          'เมื่อชาวเงือกผู้สวมใส่กำลังตกอยู่ในอันตรายจากเปลวเพลิง จะสร้างเกราะกำบังน้ำรอบกายทันที แต่จะต้องใช้เวลาในการประจุพลังใหม่ 3 วัน',
          'เพิ่มโอกาสในการโน้มน้าวและกลายเป็นเพื่อนกับสัตว์ได้ง่ายขึ้น',
          'กลายร่างกลายเป็นมวลน้ำ ซึ่งแยกความหนาแน่นออกจากน้ำอื่น ๆ โดยสิ้นเชิง ใช้ได้ 1 ครั้ง/อิเวนต์\n\n**เมื่อสลายร่างแล้วจะต้องพยายามทำให้มวลน้ำนั้นอยู่เกาะติดกัน หากมวลน้ำแตกตัวหรือกลับคืนไม่ครบถ้วน จะส่งผลร้ายแรงเมื่อคืนกลับร่างเดิม',
          'สามารถเปลี่ยนแปลงอุณหภูมิของน้ำที่ควบคุมอยู่ได้โดยฉับพลัน\n\nสามารถแช่แข็งให้กลายเป็นน้ำแข็งที่แข็งแกร่งดุจเหล็กเพื่อสร้างอาวุธชั่วคราว เช่น หอกน้ำแข็ง สะพานน้ำแข็ง หยุดการเคลื่อนไหวของศัตรู หรือเป็นโล่ป้องกันได้\nทำให้น้ำเดือดพล่านเพื่อสร้างความเสียหายทางกายภาพแก่ศัตรู หรือใช้เป็นโล่กำบังโดยที่ตนเองและพันธมิตรไม่ได้รับผลกระทบ',
          'สามารถสร้างคมวารี กลั่นน้ำให้บางคล้ายกับใบดาบ เพื่อเฉือนตัดผ่านเป้าหมายได้ราวกับการตัดกระดาษ',
          'พลังวารีคืนสภาพ สามารถล้างสถานะผิดปกติใด ๆ ไม่ว่าจะเป็นคำสาปหรือสถานะผิดปกติ ซึ่งเกิดจากผู้ที่อยู่ในระดับเดียวกันหรือต่ำกว่าตนเองได้ ใช้ได้ 1 ครั้งต่อบท']}],
      ranks:[{"rank": "0.0", "rank_name": "-", "combat_abilities": {"คลื่นเสียงความถี่สูง": {"จำนวน (ตัว/โพสต์)": "5", "ทิศทาง/ความรุนแรง": "เป็นเสียงหวีดความถี่สูง"}, "ใช้เขี้ยวและกรงเล็บ (ตัว/โพสต์)": 5}, "utility_abilities": {"รักษาอาการบาดเจ็บของตนเองหรือผู้อื่น": {"ระดับอาการ": "เล็กน้อย", "จำนวน (คน/ครั้ง)": "1", "จำนวน (ครั้ง/วัน)": "1"}}}, {"rank": "1.0", "rank_name": "สุ้มเสียงธารา", "combat_abilities": {"คลื่นเสียงความถี่สูง": {"จำนวน (ครั้ง/วัน)": "3", "จำนวน (ตัว/โพสต์)": "8", "ทิศทาง/ความรุนแรง": "ไปด้านหน้า"}, "ใช้เขี้ยวและกรงเล็บ (ตัว/โพสต์)": 7}, "utility_abilities": {"ใช้เสียงสะท้อนสำรวจโดยรอบ (ครั้ง/วัน)": 2, "รักษาอาการบาดเจ็บของตนเองหรือผู้อื่น": {"ระดับอาการ": "เล็กน้อย", "จำนวน (คน/ครั้ง)": "1", "จำนวน (ครั้ง/วัน)": "1"}}}, {"rank": "2.0", "rank_name": "มัจฉานคร", "combat_abilities": {"การโจมตีระเบิดรอบตัว": {"ลักษณะ": "เปล่งเสียงความถี่สูงแบบฉับพลัน", "จำนวน (ครั้ง/วัน)": "3", "จำนวน (ตัว/โพสต์)": "6", "ผลกระทบต่อศัตรู": "สร้างความเจ็บปวด รบกวนประสาทสัมผัสของศัตรู"}, "คลื่นเสียงความถี่สูง": {"จำนวน (ครั้ง/วัน)": "4", "จำนวน (ตัว/โพสต์)": "10", "ทิศทาง/ความรุนแรง": "รุนแรงมากขึ้น"}, "ใช้เขี้ยวและกรงเล็บ (ตัว/โพสต์)": 9}, "utility_abilities": {"เสียงเพรียกจากไซเรน (ขอคำใบ้)": {"ประสิทธิภาพคำใบ้": "ไม่มีประโยชน์ - ต่ำ", "จำนวน(ครั้ง/คน/อิเวนต์)": "1"}, "ใช้เสียงสะท้อนสำรวจโดยรอบ (ครั้ง/วัน)": 3, "รักษาอาการบาดเจ็บของตนเองหรือผู้อื่น": {"ระดับอาการ": "เล็กน้อย", "จำนวน (คน/ครั้ง)": "1", "จำนวน (ครั้ง/วัน)": "1"}}}, {"rank": "3.0", "rank_name": "อาภรณ์นที", "combat_abilities": {"การโจมตีระเบิดรอบตัว": {"ลักษณะ": "ระเบิดคลื่นเสียง ระยะใกล้", "จำนวน (ครั้ง/วัน)": "3", "จำนวน (ตัว/โพสต์)": "8", "ผลกระทบต่อศัตรู": "สร้างแรงกระแทกจนศัตรูกระเด็นออกจากตำแหน่ง"}, "คลื่นเสียงความถี่สูง": {"จำนวน (ครั้ง/วัน)": "5", "จำนวน (ตัว/โพสต์)": "12", "ทิศทาง/ความรุนแรง": "สร้างความเสียหายต่อร่างกายโดยตรง"}, "ใช้เขี้ยวและกรงเล็บ (ตัว/โพสต์)": 12}, "utility_abilities": {"เสียงเพรียกจากไซเรน (ขอคำใบ้)": {"ประสิทธิภาพคำใบ้": "ต่ำ - ปานกลาง", "จำนวน(ครั้ง/คน/อิเวนต์)": "1"}, "สะกดจิตหรือโน้มน้าวใจเป้าหมาย": {"จำนวน (คน/ครั้ง)": "1", "จำนวน (ครั้ง/วัน)": "2", "ลักษณะการใช้งาน": "แฝงพลังลงไปในน้ำเสียงเพื่อโน้มน้าวความรู้สึก การตัดสินใจของเป้าหมาย"}, "ใช้เสียงสะท้อนสำรวจโดยรอบ (ครั้ง/วัน)": 4, "รักษาอาการบาดเจ็บของตนเองหรือผู้อื่น": {"ระดับอาการ": "ปานกลาง", "จำนวน (คน/ครั้ง)": "1", "จำนวน (ครั้ง/วัน)": "1"}}}, {"rank": "4.0", "rank_name": "วารีมัสยา", "combat_abilities": {"โจมตีด้วยกระแสน้ำ": {"ลักษณะ": "กวาดศัตรูเป็นแนว / ผลักเป้าหมายที่เหลือออกจากตำแหน่ง", "จำนวน (ครั้ง/วัน)": "4", "จำนวน (ตัว/โพสต์)": "8"}, "โจมตีด้วยแรงดันน้ำ": {"ลักษณะ": "พุ่งออกไปเจาะ/กระแทกร่างศัตรู", "จำนวน (ครั้ง/วัน)": "4", "จำนวน (ตัว/โพสต์)": "10"}, "การโจมตีระเบิดรอบตัว": {"ลักษณะ": "ระเบิดคลื่นเสียง ระยะใกล้", "จำนวน (ครั้ง/วัน)": "3", "จำนวน (ตัว/โพสต์)": "8", "ผลกระทบต่อศัตรู": "สร้างแรงกระแทกจนศัตรูกระเด็นออกจากตำแหน่ง"}, "คลื่นเสียงความถี่สูง": {"จำนวน (ครั้ง/วัน)": "6", "จำนวน (ตัว/โพสต์)": "15", "ทิศทาง/ความรุนแรง": "พลังทำลายสูง"}, "สร้างเกราะป้องกัน (ครั้ง/วัน)": "3", "ใช้เขี้ยวและกรงเล็บ (ตัว/โพสต์)": 16}, "utility_abilities": {"ควบคุมมวลน้ำ": "เล็กน้อย", "สร้างน้ำขึ้นจากพลัง": "เล็กน้อย", "เสียงเพรียกจากไซเรน (ขอคำใบ้)": {"ประสิทธิภาพคำใบ้": "ต่ำ - ปานกลาง", "จำนวน(ครั้ง/คน/อิเวนต์)": "1"}, "สะกดจิตหรือโน้มน้าวใจเป้าหมาย": {"จำนวน (คน/ครั้ง)": "1", "จำนวน (ครั้ง/วัน)": "2", "ลักษณะการใช้งาน": "สะกดจิตผ่านเสียง", "ระยะเวลาที่มีผล(ชม.)": "1"}, "ใช้เสียงสะท้อนสำรวจโดยรอบ (ครั้ง/วัน)": 5, "รักษาอาการบาดเจ็บของตนเองหรือผู้อื่น": {"ระดับอาการ": "ปานกลาง", "จำนวน (คน/ครั้ง)": "1", "จำนวน (ครั้ง/วัน)": "1"}, "มองดูสิ่งของ คน วัตถุที่เคยเห็นผ่านผิวน้ำ (ครั้ง/วัน)": 1}}, {"rank": "5.0", "rank_name": "มีนาทองคำ", "combat_abilities": {"โจมตีด้วยกระแสน้ำ": {"ลักษณะ": "ใช้โอบรัดร่างกายศัตรู\nเพิ่มแรงดันเพื่อบีบรัด กระแทก หรือเหวี่ยงเป้าหมายได้", "จำนวน (ครั้ง/วัน)": "4", "จำนวน (ตัว/โพสต์)": "10"}, "โจมตีด้วยแรงดันน้ำ": {"ลักษณะ": "ระเบิดออกไปรอบตัวเป็นวงกว้าง", "จำนวน (ครั้ง/วัน)": "4", "จำนวน (ตัว/โพสต์)": "12"}, "การโจมตีระเบิดรอบตัว": {"ลักษณะ": "ระเบิดแรงดันน้ำ", "จำนวน (ครั้ง/วัน)": "4", "จำนวน (ตัว/โพสต์)": "12", "ผลกระทบต่อศัตรู": "สร้างแรงกระแทกรุนแรงต่อศัตรูบริเวณใกล้เคียง"}, "คลื่นเสียงความถี่สูง": {"จำนวน (ครั้ง/วัน)": "7", "จำนวน (ตัว/โพสต์)": "20", "ทิศทาง/ความรุนแรง": "สร้างแรงสั่นสะเทือนต่อร่างกายของเป้าหมายโดยตรง"}, "สร้างเกราะป้องกัน (ครั้ง/วัน)": "4", "ใช้เขี้ยวและกรงเล็บ (ตัว/โพสต์)": 20, "ส่งคลื่นเสียงผ่านมวลน้ำ ทำให้แหล่งน้ำสั่นสะเทือนรุนแรง": {"จำนวน (ครั้ง/วัน)": "4", "จำนวน (ตัว/โพสต์)": "15"}}, "utility_abilities": {"ควบคุมมวลน้ำ": "ปานกลาง", "สร้างภาพลวงตา": {"จำนวน (คน/ครั้ง)": "1", "จำนวน (ครั้ง/วัน)": "2"}, "สร้างน้ำขึ้นจากพลัง": "มากขึ้น", "เสียงเพรียกจากไซเรน (ขอคำใบ้)": {"ประสิทธิภาพคำใบ้": "ปานกลาง - ปานกลางค่อนสูง", "จำนวน(ครั้ง/คน/อิเวนต์)": "1"}, "สะกดจิตหรือโน้มน้าวใจเป้าหมาย": {"จำนวน (คน/ครั้ง)": "1", "จำนวน (ครั้ง/วัน)": "3", "ลักษณะการใช้งาน": "สะกดจิตผ่านเสียง", "ระยะเวลาที่มีผล(ชม.)": "2"}, "ใช้เสียงสะท้อนสำรวจโดยรอบ (ครั้ง/วัน)": 6, "รักษาอาการบาดเจ็บของตนเองหรือผู้อื่น": {"ระดับอาการ": "ปานกลางค่อนไปสาหัส", "จำนวน (คน/ครั้ง)": "1", "จำนวน (ครั้ง/วัน)": "1"}, "มองดูสิ่งของ คน วัตถุที่เคยเห็นผ่านผิวน้ำ (ครั้ง/วัน)": 2}}],
      conditions:[
        {skill_name:'มองดูสิ่งของ คน วัตถุที่เคยเห็นผ่านผิวน้ำ', condition_text:'ต้องร่ายคาถา อควาสเปคูลุม ออสเทนเด ทุกครั้งที่ใช้'}
      ],
      merfolk:[
        ['Rowena T. Frost',5,'#0067a5','สร้อยวารีนิรันดร','Melisandre','ฝูงผีเสื้อจรกาหนอนยี่โถ','เทพเจ้า',null],
        ['Violette C. Leclaire',5,'#9b90c8','สร้อยวารีนิรันดร','Cepheus','เสือขาว','ตำนาน','แมงกะพรุนกล่อง'],
        ['Lucine F. Varner',5,'#AB978E','สร้อยวารีนิรันดร','Lestyn','วาฬเพชฌฆาต','ตำนาน','ปลากระเบนไฟฟ้า'],
        ['Ralph E. Aquaborne',5,'#00A36C','สร้อยวารีนิรันดร','Rome','กวางเรนเดียร์เผือก','เทพเจ้า','ปลาหมึกเลียนแบบ'],
        ['Floyd R. Frost',5,'#4e0000','สร้อยวารีนิรันดร','Nalu','วาฬเพชฌฆาต','ตำนาน','กั้งตั๊กแตนเจ็ดสี'],
        ['Genevieve V. Frost',4,'#f5bf55','สร้อยวารีนิรันดร','Wyntellaferianmerinder Tristanelliste','วาฬเพชฌฆาต','ตำนาน',null],
        ['Royce K. Aquaborne',4,'#23395D','สร้อยสีทันดร',null,null,null,null],
        ['Ray Marmoris',4,'#6495ED','สร้อยวารีนิรันดร','Sage','เสือโคร่ง','สูง',null],
        ['Marine Pearlquoise',4,'#708090','สร้อยวารีนิรันดร',null,null,null,null],
        ['Blaze C. Seymour',3,'#abb6c8',null,null,null,null,null],
        ['Quorlan Sam',3,'#708090','สร้อยวารีนิรันดร','Cuptunmomotaro','เสือขาว','ตำนาน',null],
        ['Allison Schauss',3,'#550000','สร้อยวารีนิรันดร',null,null,null,null],
        ['Beryl C. Seymour',3,'#708090',null,null,null,null,null],
        ['Zane Marmoris',2,'#ffffff',null,null,null,null,null],
        ['Madelynn Aquaborne',2,'#ffffff',null,null,null,null,null]
      ].map((a,i)=>({id:i+1,name:a[0],rank:String(Number(a[1])),tail_color:a[2],amulet_name:a[3],spirit_animal_name:a[4],spirit_animal_type:a[5],spirit_animal_rarity:a[6],pact_power_name:a[7],image_url:i===0?'https://i.pinimg.com/1200x/20/5b/e6/205be65c45cf9d5267136083a2daba68.jpg':null}))
    };

    /* ==================================================================== */
    const GROUP_NAMES = { combat:'ต่อสู้', other:'อื่น ๆ' };
    const SKILL_ORDER = [
      'โจมตีด้วยกระแสน้ำ','โจมตีด้วยแรงดันน้ำ','การโจมตีระเบิดรอบตัว','คลื่นเสียงความถี่สูง','ส่งคลื่นเสียงผ่านมวลน้ำ','ใช้เขี้ยวและกรงเล็บ','สร้างเกราะป้องกัน',
      'ควบคุมมวลน้ำ','สร้างน้ำขึ้นจากพลัง','สร้างภาพลวงตา','สะกดจิต','เสียงเพรียกจากไซเรน','ใช้เสียงสะท้อน','มองดูสิ่งของ','รักษาอาการบาดเจ็บ'
    ];
    const COUNT_ORDER = ['ครั้ง/วัน','ตัว/โพสต์'];   
    const PLAIN_LABELS = ['ลักษณะ','ลักษณะการใช้งาน','ทิศทาง/ความรุนแรง']; 
    const POWER_UNIT = 'ตัว/โพสต์';                 

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
      merfolk:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-7l-3-3M12 15l3-3M15 8c0 1.5-1 3-3 3s-3-1.5-3-3 1.5-3 3-3 3 1.5 3 3zM4 22h16M2 12h2M20 12h2M12 2v2"/></svg>',
      rank:'<svg viewBox="0 0 24 24"><path d="M12 3l9 4.5-9 4.5-9-4.5z"/><path d="M3 12l9 4.5 9-4.5"/><path d="M3 16.5L12 21l9-4.5"/></svg>',
      amulet:'<svg viewBox="0 0 24 24"><path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18M9 4l-1 5 4 11 4-11-1-5"/></svg>',
      spirit:'<svg viewBox="0 0 24 24"><circle cx="6.5" cy="10" r="1.8"/><circle cx="10" cy="6" r="1.8"/><circle cx="14" cy="6" r="1.8"/><circle cx="17.5" cy="10" r="1.8"/><path d="M12 12c-3 0-5 3-5 5 0 2 2 2.5 5 2.5s5-.5 5-2.5c0-2-2-5-5-5z"/></svg>',
      pact:'<svg viewBox="0 0 24 24"><path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></svg>'
    };
    const TABS = [
      {id:'merfolk', label:'ชาวเงือก', title:'รายชื่อชาวเงือก', en:'Merpeople'},
      {id:'rank', label:'ระดับขั้น', title:'ความสามารถตามระดับขั้น', en:'Ranks'},
      {id:'amulet', label:'เครื่องราง', title:'เครื่องรางประจำเผ่าพันธุ์', en:'Amulets'},
      {id:'spirit', label:'สัตว์แฝง', title:'โบนัสสัตว์แฝงตามระดับความหายาก', en:'Spirit Animals'},
      {id:'pact', label:'พันธสัญญา', title:'พันธสัญญาแห่งชีวิตใต้สมุทร', en:'Oceanbond Powers'}
    ];

    let DATA: any, tab = 'merfolk', rankFilter = 'all';
    let M: any = {};

    function index(){
      DATA.merfolk.sort((a:any,b:any)=>Number(b.rank)-Number(a.rank)||a.id-b.id);
      DATA.ranks.sort((a:any,b:any)=>Number(b.rank)-Number(a.rank));
      M.rank = Object.fromEntries(DATA.ranks.map((r:any)=>[rk(r.rank),r]));
      M.amulet = Object.fromEntries(DATA.amulets.map((a:any)=>[a.amulet_name,a]));
      M.rarity = Object.fromEntries(DATA.rarities.map((r:any)=>[r.rarity,r]));
      M.pact = Object.fromEntries(DATA.pacts.map((p:any)=>[p.power_name,p]));
      M.person = Object.fromEntries(DATA.merfolk.map((p:any)=>[p.id,p]));
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
    const avatar = (m:any) => `<span class="av" style="background:${esc(m.tail_color)}">${m.image_url?`<img src="${esc(m.image_url)}" alt="" loading="lazy" ${IMG_ATTR}>`:''}</span>`;
    
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
      const p = s.counts.find((c:any)=>c.unit===POWER_UNIT && !c.label);
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

    function viewMerfolk(){
      const ranks = [...new Set(DATA.merfolk.map((m:any)=>rk(m.rank)))];
      const chips = ['all',...ranks].map(r=>`<button class="chip" type="button" data-filter="${r}" aria-pressed="${rankFilter===r}">${r==='all'?'ทั้งหมด':'Rank '+r}</button>`).join('');
      const list = ranks.filter(r=>rankFilter==='all'||rankFilter===r).map(r=>{
        const people = DATA.merfolk.filter((m:any)=>rk(m.rank)===r);
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
        <div class="who"><div class="rk"><b>${rk(r.rank)}</b>Rank</div><h3>${esc(rname(r.rank_name))}</h3></div>
        ${skillBlock(r)}</div>`).join('')+`</div>`;
    }
    function viewAmulet(){
      return `<div class="pcols">`+DATA.amulets.map((a:any)=>{
        const wearers = DATA.merfolk.filter((m:any)=>m.amulet_name===a.amulet_name);
        return `<div class="panel"><h3>${esc(a.amulet_name)}</h3><div class="sub">${a.abilities.length} ความสามารถ</div>
          <div style="margin-top:8px">${a.abilities.map(abilityHTML).join('')}</div>
          <div class="sec-h" style="margin-top:16px;">ผู้สวมใส่ (${wearers.length})</div>
          <div class="owners" style="margin-top:4px">${wearers.map(personChip).join('')||'<span class="none">ยังไม่มี</span>'}</div></div>`;
      }).join('')+`</div>`;
    }
    function viewSpirit(){
      return `<div class="pcols">`+DATA.rarities.slice().sort((a:any,b:any)=>(b.atk_bonus+b.def_bonus)-(a.atk_bonus+a.def_bonus)).map((r:any)=>{
        const owners = DATA.merfolk.filter((m:any)=>m.spirit_animal_rarity===r.rarity);
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
        const owners = DATA.merfolk.filter((m:any)=>m.pact_power_name===p.power_name);
        return `<div class="panel"><h3>${esc(p.power_name)}</h3>
          <div style="margin-top:8px">${richBlock(p.description)}</div>
          <div style="margin-top:auto; padding-top:16px;">
            ${owners.length?`<div class="sec-h">ผู้ทำพันธสัญญา</div><div class="owners" style="margin-top:4px">${owners.map(personChip).join('')}</div>`:''}
          </div></div>`;
      }).join('')+`</div>`;
    }
    const VIEWS:any = {merfolk:viewMerfolk,rank:viewRank,amulet:viewAmulet,spirit:viewSpirit,pact:viewPact};

    function viewPerson(m:any){
      const r = M.rank[rk(m.rank)], am = M.amulet[m.amulet_name], ra = M.rarity[m.spirit_animal_rarity], pc = M.pact[m.pact_power_name];
      const hero = m.image_url
        ? `<div class="hero"><img src="${esc(m.image_url)}" alt="${esc(m.name)}" ${IMG_ATTR}>`
        : `<div class="hero noimg"><span class="glow" style="background:${esc(m.tail_color)}"></span>`;
      return hero + `<div class="hero-t"><h2>${esc(m.name)}</h2>
          <div class="rk"><b>${rk(m.rank)}</b><span style="font-family: var(--sans);">${esc(rname(r?.rank_name))}</span></div></div></div>
        <div class="pbody">
        <div class="owners"><span class="tag swatch"><i style="background:${esc(m.tail_color)}"></i>สีหาง ${esc(m.tail_color)}</span></div>
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
        <div class="foot">Merpeople</div></div>`;
    }

    const CALC_EXCLUDE = ['สร้างเกราะป้องกัน'];   
    const calcSkills = (r:any) => skillsOf(r).combat.filter((s:any)=>!CALC_EXCLUDE.some(x=>s.name.startsWith(x)));
    let CALC:any = {pid:null, skills:{}, amulet:false, spirit:false, buffs:[]};
    function calcReset(m:any){
      CALC = {pid:m.id, skills:{}, amulet:false, spirit:false, buffs:[]};
      calcSkills(M.rank[rk(m.rank)]).forEach((s:any)=>{ CALC.skills[s.id] = {on:false, power: s.power!=null ? String(s.power) : ''}; });
    }
    function calcRun(m:any){
      const ra = M.rarity[m.spirit_animal_rarity], steps = [];
      let base = 0;
      calcSkills(M.rank[rk(m.rank)]).forEach((s:any)=>{ const c = CALC.skills[s.id]; if(c && c.on) base += toNum(c.power); });
      steps.push(['พลังจากสกิลที่เลือก', base]);
      let cur = base;
      if(CALC.amulet){ cur *= 2; steps.push(['×2 จากเครื่องรางอัพเกรดเมื่ออยู่ใกล้แหล่งน้ำ', cur]); }
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
      const sk = calcSkills(M.rank[rk(m.rank)]), ra = M.rarity[m.spirit_animal_rarity];
      // ตรวจสอบว่าชาวเงือกมีสร้อยวารีนิรันดร์หรือไม่ เพื่อปิดการใช้งานสวิตช์ถ้าไม่มี
      const hasSpirit = !!(m.spirit_animal_name && ra);
      const hasAmulet = (m.amulet_name === 'สร้อยวารีนิรันดร');

      return `<h3>${ICON.calc}คำนวณพลังโจมตี</h3>
        <p class="hint">เลือกสกิลที่จะใช้ในโพสต์นั้น ๆ สามารถเลือกเพิ่มบัฟจากเผ่าอื่นด้วยตัวเองได้</p>
        <div class="sec-h" style="margin-top:14px">สกิลที่ใช้ (ต่อสู้)</div>
        ${sk.length?sk.map((s:any)=>{ const c = CALC.skills[s.id] || {on:false,power:''}; return `
          <div class="cs"><label class="sw"><input type="checkbox" data-c="skill" data-id="${esc(s.id)}" ${c.on?'checked':''}><span class="tg"></span>
            <span class="sw-t">${esc(s.name)}${s.counts.length?`<small>${esc(s.counts.map(countText).join(', '))}</small>`:''}</span></label>
            <input class="num" inputmode="decimal" placeholder="พลัง" data-c="power" data-id="${esc(s.id)}" value="${esc(c.power)}" ${c.on?'':'disabled'} aria-label="พลังของ ${esc(s.name)}"></div>`; }).join(''):'<div class="none">ไม่มีสกิลต่อสู้</div>'}
        <div class="sec-h" style="margin-top:18px">ตัวเลือก</div>
        
        <label class="sw ${hasAmulet?'':'off'}"><input type="checkbox" data-c="amulet" ${CALC.amulet&&hasAmulet?'checked':''} ${hasAmulet?'':'disabled'}><span class="tg"></span>
          <span class="sw-t">×2 จากเครื่องรางอัพเกรดเมื่ออยู่ใกล้แหล่งน้ำ<small>${hasAmulet?'สร้อยวารีนิรันดร':(m.amulet_name?esc(m.amulet_name):'ไม่มีเครื่องราง')}</small></span></label>
          
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
        document.title = m.name + ' · Merpeople - Elysian Curse 2026';
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

      document.title = 'Merpeople - Elysian Curse 2026';
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
        await Promise.all(Array.from(imgs).map((img: any) => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
        }));

        const ratio = Math.max(1, Math.min(3, 12000 / node.scrollHeight));
        
        const blob = await htmlToImage.toBlob(node, {
          pixelRatio: ratio, 
          cacheBust: true, 
          backgroundColor: '#0b1538',
          style: {
            margin: '0',
          },
          onclone: (clonedDoc: any) => {
            const clonedCapture = clonedDoc.getElementById('capture');
            if (clonedCapture) {
               clonedCapture.style.borderRadius = '0';
               clonedCapture.style.border = 'none';

               const watermark = clonedDoc.createElement('div');
               watermark.innerHTML = '© vivalavivie 2026';
               watermark.style.cssText = 'text-align: center; color: rgba(127,169,255,0.7); padding: 16px; font-size: 13px; font-family: var(--sans); border-top: 1px dashed rgba(180,205,255,0.2); margin-top: 10px; letter-spacing: 0.5px;';
               
               const pbody = clonedCapture.querySelector('.pbody');
               if(pbody) {
                 pbody.appendChild(watermark);
                 const oldFoot = pbody.querySelector('.foot');
                 if(oldFoot) oldFoot.style.display = 'none';
               }
            }
          }
        });
        
        const fileName = name.replace(/[^\w\u0E00-\u0E7F-]+/g,'_') + '.png';
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
      else if(d.act==='save'){ const m = M.person[personId() as number]; saveNode($('#capture'), m ? m.name : 'merfolk'); }
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
        const r = await fetch('/api/merpeople2026'); if(!r.ok) throw new Error(String(r.status));
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
      <link rel="icon" type="image/jpeg" href="https://iili.io/nc75EYB.png" />
      {/* ========================================== */}
      
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300..700&display=swap');
        @import url('https://midsummer-reverie.github.io/font-face/ophelia.css');

        :root{
          --bg0:#050a1f; --bg1:#0c1840;
          --text:#eef3ff; --muted:#9db0dc; --ice:#bcd6ff; --frost:#7fa9ff;
          --line:rgba(180,205,255,.26); --line-soft:rgba(180,205,255,.14);
          --amber:#f2a65a; --amber-d:#c9772c;
          --panel:linear-gradient(160deg,rgba(150,180,255,.17),rgba(70,100,210,.09));
          --card-bg:linear-gradient(165deg,#12235e 0%,#0b1538 55%,#08102b 100%);
          --sans:'Google Sans','Noto Sans Thai',system-ui,-apple-system,'Segoe UI',sans-serif;
          --display:'ophelia','Noto Serif Thai',Georgia,serif;
        }
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        html{scroll-padding-top:env(safe-area-inset-top,0px)}
        
        /* สไตล์สำหรับหน้าโหลดเฉพาะ Merpeople */
        .merfolk-loader {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: radial-gradient(circle at 50% 40%, #0c1840, #050a1f 80%);
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
          border: 3px solid rgba(180, 205, 255, 0.1);
          border-top-color: var(--frost);
          border-radius: 50%;
          animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          margin-bottom: 20px;
          box-shadow: 0 0 20px rgba(127, 169, 255, 0.2);
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
          50% { opacity: 1; text-shadow: 0 0 10px rgba(188, 214, 255, 0.5); }
        }

        .merfolk-wrapper {
          margin:0;min-height:100dvh;color:var(--text);font-family:var(--sans);font-size:15px;line-height:1.65;
          background:
            radial-gradient(900px 520px at 88% -8%,rgba(86,136,255,.38),transparent 62%),
            radial-gradient(700px 520px at -5% 42%,rgba(60,175,225,.18),transparent 62%),
            linear-gradient(180deg,var(--bg1),var(--bg0) 70%);
          background-attachment:fixed;
          padding:env(safe-area-inset-top,0px) 0 0;
          word-break:normal;overflow-wrap:break-word;line-break:auto;
        }
        .merfolk-wrapper::before{
          content:"";position:fixed;inset:0;pointer-events:none;opacity:.7;
          background-image:
            radial-gradient(1.5px 1.5px at 12% 18%,#cfe0ff,transparent),
            radial-gradient(1px 1px at 78% 12%,#fff,transparent),
            radial-gradient(1.5px 1.5px at 62% 34%,#a9c4ff,transparent),
            radial-gradient(1px 1px at 28% 52%,#fff,transparent),
            radial-gradient(1.5px 1.5px at 90% 64%,#cfe0ff,transparent),
            radial-gradient(1px 1px at 8% 82%,#fff,transparent),
            radial-gradient(1.5px 1.5px at 48% 90%,#a9c4ff,transparent);
        }
        
        [hidden]{display:none!important}
        button{font:inherit;color:inherit;cursor:pointer}
        p,.sk-d,.ab p,.hint,.none{text-wrap:pretty}
        h1,h2,h3,.nm,.sk-n,.sw-t{text-wrap:balance}
        :focus-visible{outline:2px solid var(--ice);outline-offset:2px}
        .disp{font-family:var(--display);font-weight:400}

        .wrap{position:relative;max-width:1080px;margin:0 auto;padding:18px 16px calc(120px + env(safe-area-inset-bottom,0px))}
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
          background:linear-gradient(180deg,#ffc58a,var(--amber) 55%,var(--amber-d));
          clip-path:polygon(var(--c) 0,calc(100% - var(--c)) 0,100% 50%,calc(100% - var(--c)) 100%,var(--c) 100%,0 50%);
          min-height:42px;transition:filter .15s;
        }
        .hex:hover{filter:brightness(1.08)}
        .hex:active{filter:brightness(.92)}
        .hex svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}

        .chips{display:flex;gap:8px;overflow-x:auto;padding:2px 0 14px;scrollbar-width:none}
        .chips::-webkit-scrollbar{display:none}
        .chip{flex:none;white-space:nowrap;display:inline-flex;align-items:center;border:1px solid var(--line);background:rgba(120,150,235,.1);border-radius:999px;padding:6px 15px;font-size:13px;color:var(--ice);min-height:36px}
        .chip[aria-pressed="true"]{background:var(--ice);color:#0a1740;border-color:var(--ice);font-weight:600}

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
        .tag{display:inline-flex;align-items:center;white-space:nowrap;font-size:12px;line-height:1.5;padding:2px 10px;border-radius:999px;border:1px solid var(--line);color:var(--ice);background:rgba(120,150,235,.1)}
        .tag.r-ธรรมดา{color:#c3cfe6;border-color:#8793ad}
        .tag.r-กลาง{color:#8fe3d6;border-color:#4cae9f}
        .tag.r-สูง{color:#c9b3ff;border-color:#8c6fdb}
        .tag.r-ตำนาน{color:#ffd48a;border-color:#d6a043}
        .tag.r-เทพเจ้า{color:#fff;border-color:#fff;background:linear-gradient(90deg,rgba(255,226,160,.35),rgba(170,210,255,.35));box-shadow:0 0 10px rgba(255,236,190,.35)}
        .tag.pact{color:#ffd9a8;border-color:rgba(242,166,90,.6);background:rgba(242,166,90,.1)}
        .none{color:var(--muted);font-size:13px}

        .who{display:flex;align-items:center;gap:14px}
        .av{flex:none;width:52px;height:52px;border-radius:50%;overflow:hidden;border:2px solid rgba(255,255,255,.7);box-shadow:0 0 0 3px rgba(130,170,255,.18),0 0 14px rgba(120,170,255,.25)}
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
        .note.trait{color:#d6e6ff;background:rgba(127,169,255,.12);border-left:3px solid var(--frost)}
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
        .cn{display:inline-flex;align-items:center;gap:5px;white-space:nowrap;padding:2px 11px;border-radius:999px;border:1px solid var(--line);background:rgba(120,150,235,.1);font-size:13.5px;line-height:1.5;color:#fff}
        .cn em{font-style:normal;color:var(--frost);font-size:12px}
        .cn b{font-weight:600}
        .cn small{font-weight:400;color:var(--muted);font-size:12px}
        .sk-d{margin-top:6px;color:var(--muted);font-size:14px;line-height:1.55}
        .sk-d p{margin:0}
        .sk-d p + p{margin-top:4px}
        .sk-d em{font-style:normal;color:var(--frost);font-size:12px;margin-right:4px}

        .bar{height:6px;border-radius:6px;background:rgba(150,180,255,.15);overflow:hidden;margin-top:4px}
        .bar i{display:block;height:100%;border-radius:6px}
        .bar.atk i{background:linear-gradient(90deg,#ff9a7a,#ffd08a)}
        .bar.def i{background:linear-gradient(90deg,#6fa8ff,#9fe3ff)}
        .two{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:12px}
        .stat{font-size:13px;color:var(--muted)}
        .stat b{color:#fff;font-size:16px;margin-left:4px}
        .owners{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
        .owner{display:inline-flex;align-items:center;white-space:nowrap;border:1px solid var(--line);background:rgba(120,150,235,.1);color:var(--ice);border-radius:999px;padding:4px 13px;font-size:13px;min-height:32px}
        .owner:hover{border-color:var(--ice)}
        .foot{margin-top:18px;text-align:center;font-family:var(--display);font-size:13px;color:var(--muted);letter-spacing:.12em}

        .nav{
          position:fixed;left:50%;transform:translateX(-50%);bottom:calc(10px + env(safe-area-inset-bottom,0px));
          width:min(560px,calc(100% - 20px));display:flex;justify-content:space-between;gap:2px;padding:6px;z-index:20;
          background:rgba(14,28,78,.82);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);
          border:1px solid var(--line);border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.4);
        }
        .nav button{flex:1;background:none;border:0;border-radius:999px;padding:7px 2px 6px;display:flex;flex-direction:column;align-items:center;gap:1px;color:var(--muted);font-size:11px;line-height:1.3}
        .nav svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
        .nav button[aria-current="true"]{color:#fff;background:linear-gradient(180deg,rgba(130,170,255,.35),rgba(90,130,240,.18));box-shadow:inset 0 0 0 1px var(--line)}

        .pgrid{display:block}
        #capture.list{background:none;border:0;padding:0}
        #capture.person{background:var(--card-bg);border:1px solid var(--line);border-radius:26px;overflow:hidden;padding:0 0 18px;max-width:600px;margin:0 auto}
        .bar-top{display:flex;justify-content:space-between;align-items:center;max-width:600px;margin:0 auto 12px}
        .back{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:rgba(14,28,78,.9);border-radius:999px;padding:8px 16px 8px 12px;font-size:14px;color:var(--ice);min-height:42px}
        .back svg{width:16px;height:16px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
        .hero{position:relative;aspect-ratio:4/5;max-height:640px;width:100%;overflow:hidden;background:#0b1538}
        .hero img{width:100%;height:100%;object-fit:cover;object-position:50% 15%;display:block}
        .hero.noimg{aspect-ratio:auto;height:190px;display:grid;place-items:center}
        .hero.noimg .glow{width:96px;height:96px;border-radius:50%;border:3px solid rgba(255,255,255,.75);box-shadow:0 0 0 8px rgba(130,170,255,.15),0 0 40px rgba(120,170,255,.4)}
        .hero::after{content:"";position:absolute;inset:auto 0 0 0;height:55%;background:linear-gradient(180deg,transparent,#0b1538 92%)}
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
        .num{width:100%;min-height:44px;background:rgba(8,16,43,.7);border:1px solid var(--line);border-radius:12px;color:#fff;padding:0 12px;font:inherit;font-size:16px}
        .num:disabled{opacity:.4}
        .num::placeholder{color:rgba(157,176,220,.6)}
        .cs{display:grid;grid-template-columns:1fr 104px;gap:10px;align-items:center;border-top:1px solid var(--line-soft);padding:2px 0}
        .sec-h + .cs{border-top:0}
        .sw{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:48px;cursor:pointer}
        .sw.line{border-top:1px solid var(--line-soft)}
        .sw input{position:absolute;opacity:0;pointer-events:none}
        .sw .tg{flex:none;order:-1;width:46px;height:26px;border-radius:99px;background:rgba(150,180,255,.2);border:1px solid var(--line);position:relative;transition:background .15s}
        .sw .tg::after{content:"";position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:#dfe9ff;transition:transform .15s}
        .sw input:checked + .tg{background:var(--frost)}
        .sw input:checked + .tg::after{transform:translateX(20px);background:#fff}
        .sw input:focus-visible + .tg{outline:2px solid var(--ice);outline-offset:2px}
        .sw .sw-t{flex:1;line-height:1.4}
        .sw .sw-t small{display:block;color:var(--muted);font-size:12px}
        .sw.off{opacity:.45;cursor:not-allowed}
        .bf{display:grid;grid-template-columns:auto 1fr 44px;gap:8px;align-items:center;margin-bottom:8px}
        .seg{display:flex;border:1px solid var(--line);border-radius:12px;overflow:hidden}
        .seg button{border:0;background:none;width:44px;min-height:44px;font-size:20px;line-height:1;color:var(--muted)}
        .seg button[aria-pressed="true"]{background:var(--ice);color:#0a1740;font-weight:700}
        .ico{min-height:44px;border:1px solid var(--line);background:none;border-radius:12px;color:var(--muted);display:grid;place-items:center}
        .ico svg{width:16px;height:16px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round}
        .add{margin-top:2px;border:1px dashed var(--line);background:none;border-radius:12px;min-height:44px;width:100%;color:var(--ice)}
        .out{margin-top:18px;border-top:1px solid var(--line);padding-top:14px}
        .st{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:3px 0;font-size:14px;color:var(--muted)}
        .st b{color:var(--text);font-weight:500}
        .total{display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding:12px 14px;border-radius:16px;background:linear-gradient(160deg,rgba(130,170,255,.28),rgba(80,120,240,.12));border:1px solid var(--line)}
        .total span{color:var(--ice)}
        .total b{font-family:var(--sans);font-weight:500;font-size:40px;line-height:1.1;color:#fff;text-shadow:0 0 18px rgba(130,170,255,.6)}

        #demo{margin:0 0 12px;padding:8px 14px;border-radius:12px;background:rgba(242,166,90,.12);border:1px solid rgba(242,166,90,.4);color:#ffd9a8;font-size:13px}
        #toast{position:fixed;left:50%;bottom:calc(92px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:60;background:#eaf1ff;color:#0a1740;padding:8px 18px;border-radius:999px;font-size:14px;font-weight:500;opacity:0;pointer-events:none;transition:opacity .2s}
        #toast.on{opacity:1}
        @media(prefers-reduced-motion:reduce){*{transition:none!important}}
      `}} />

      {/* 3. โครงสร้าง HTML (ใช้ className แทน class ตามแบบฉบับ React) */}
      <div className="merfolk-wrapper">
        
        {/* หน้าโหลดเฉพาะ Merpeople (จะค่อยๆ จางหายไปเมื่อโหลดเสร็จ) */}
        <div className={`merfolk-loader ${!isLoading ? 'fade-out' : ''}`}>
          <div className="ring"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>

        <div className="wrap">
          <div id="demo" hidden>กำลังแสดงข้อมูลตัวอย่าง เพราะยังเชื่อมต่อฐานข้อมูลไม่ได้ (/api/merpeople2026)</div>
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