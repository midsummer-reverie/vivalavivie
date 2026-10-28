"use client";

import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// ============================================================
// 🖥️ ScaledPreview: จำลองหน้าจอ Desktop จริง แล้วย่อทั้ง iframe
// ทำให้ vw / vh / % / px ย่อตามสัดส่วนเดียวกัน เหมือนที่เห็นบนเว็บจริง
// ============================================================
const BOARD_WIDTH = 900; // ความกว้างบอร์ดจริงบนเว็บ
const REF_WIDTHS = [1920, 1440, 1280]; // ความกว้างหน้าจอ Desktop ที่ให้เลือกจำลอง

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function ScaledPreview({ html }: { html: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [refWidth, setRefWidth] = useState(1280); // จอจำลองเริ่มต้น
  const [zoom, setZoom] = useState(100);
  const [fitted, setFitted] = useState(false); // ซ่อนกรอบจนกว่าจะซูมแบบ "พอดีบอร์ด" ครั้งแรกเสร็จ กันภาพกระตุก

  // จุดกึ่งกลางของมุมมองแนวนอน (สัดส่วน 0-1 ของความกว้างจอจำลอง) ใช้ซูมเข้าตรงกลาง
  const centerRatio = useRef(0.5);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const clampZoom = (v: number) => Math.min(200, Math.max(25, Math.round(v)));
  const scale = zoom / 100;
  const sizerW = refWidth * scale;
  const sizerWRef = useRef(sizerW);
  sizerWRef.current = sizerW;

  // พอดีบอร์ด = ให้บอร์ด (900px) กว้างเต็มกรอบ / ทั้งจอ = เห็นหน้าจอจำลองทั้งความกว้าง
  const fitBoardZoom = size.w ? clampZoom((size.w / BOARD_WIDTH) * 100) : 100;
  const fitScreenZoom = size.w ? clampZoom((size.w / refWidth) * 100) : 100;

  // ค่าเริ่มต้น: เมื่อเปิดพรีวิวและวัดขนาดกรอบได้ ให้ซูมแบบ "พอดีบอร์ด" ครั้งเดียว
  useEffect(() => {
    if (fitted || !size.w) return;
    centerRatio.current = 0.5;
    setZoom(clampZoom((size.w / BOARD_WIDTH) * 100));
    setFitted(true);
  }, [size.w, fitted]);

  // ซูม/เปลี่ยนจอ/ปรับขนาดกรอบ แล้วคงจุดกึ่งกลางเดิมไว้ (แนวนอน)
  useIsoLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el || !size.w) return;
    const cw = el.clientWidth;
    el.scrollLeft = sizerW > cw ? Math.max(0, centerRatio.current * sizerW - cw / 2) : 0;
  }, [sizerW, size.w]);

  const handleScroll = () => {
    const el = wrapRef.current;
    if (!el) return;
    const cw = el.clientWidth;
    centerRatio.current = sizerWRef.current > cw ? (el.scrollLeft + cw / 2) / sizerWRef.current : 0.5;
  };

  // สูง = ความสูงกรอบ / scale เพื่อให้ vh สัมพันธ์กับสิ่งที่เห็น
  const iframeHeight = size.h ? size.h / scale : 0;

  const srcDoc = useMemo(() => `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  ::-webkit-scrollbar{width:6px;height:6px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:rgba(168,85,247,.4);border-radius:10px}
  ::-webkit-scrollbar-thumb:hover{background:rgba(168,85,247,.6)}
  html,body{margin:0;padding:0;min-height:100%;background:#131313;font-family:sans-serif}
  body{display:flex;justify-content:center;align-items:flex-start}
  #board{width:${BOARD_WIDTH}px;max-width:100%;padding:40px 20px;box-sizing:border-box}
  #board img,#board video{max-width:100%;height:auto}
</style></head>
<body><div id="board">${html}</div>
<script>
  // ซูมแล้วให้จุดกึ่งกลางแนวตั้งของมุมมองคงที่ (iframe ถูกปรับความสูงตามระดับซูม)
  (function(){
    var cy = window.innerHeight / 2 + window.scrollY;
    window.addEventListener('scroll', function(){ cy = window.scrollY + window.innerHeight / 2; }, { passive: true });
    window.addEventListener('resize', function(){ window.scrollTo(window.scrollX, Math.max(0, cy - window.innerHeight / 2)); });
  })();
</script>
</body></html>`, [html]);

  const lightBtn = (active: boolean): React.CSSProperties => ({ color: active ? undefined : '#d4d4d8' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, minWidth: 0, width: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '6px 10px', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', background: '#1c1c1c', flexShrink: 0 }}>
        <span style={{ color: '#a1a1aa', fontSize: '0.75rem' }}>จอ:</span>
        {REF_WIDTHS.map(w => (
          <button key={w} className={`toggle-btn ${refWidth === w ? 'active' : ''}`} style={lightBtn(refWidth === w)} onClick={() => setRefWidth(w)}>
            {w}px
          </button>
        ))}

        <div style={{ width: 1, height: 16, background: '#3f3f46', margin: '0 4px' }} />

        <span style={{ color: '#a1a1aa', fontSize: '0.75rem' }}>ซูม:</span>
        <button className="toggle-btn" style={{ color: '#d4d4d8' }} onClick={() => setZoom(z => clampZoom(z - 5))} title="ซูมออก">−</button>
        <input
          type="range" min={25} max={200} step={5} value={zoom}
          onChange={e => setZoom(Number(e.target.value))}
          style={{ width: 110, accentColor: '#a855f7' }}
        />
        <button className="toggle-btn" style={{ color: '#d4d4d8' }} onClick={() => setZoom(z => clampZoom(z + 5))} title="ซูมเข้า">+</button>
        <span style={{ color: '#e4e4e7', fontSize: '0.75rem', minWidth: 36, textAlign: 'right' }}>{zoom}%</span>
        <button className={`toggle-btn ${zoom === 100 ? 'active' : ''}`} style={lightBtn(zoom === 100)} onClick={() => setZoom(100)}>100%</button>
        <button className={`toggle-btn ${zoom === fitBoardZoom ? 'active' : ''}`} style={lightBtn(zoom === fitBoardZoom)} onClick={() => { centerRatio.current = 0.5; setZoom(fitBoardZoom); }} title="ให้บอร์ดกว้างเต็มกรอบ (ตัวโค้ดใหญ่ที่สุด)">พอดีบอร์ด</button>
        <button className={`toggle-btn ${zoom === fitScreenZoom ? 'active' : ''}`} style={lightBtn(zoom === fitScreenZoom)} onClick={() => { centerRatio.current = 0.5; setZoom(fitScreenZoom); }} title="เห็นหน้าจอจำลองทั้งความกว้าง">ทั้งจอ</button>
      </div>

      <div
        ref={wrapRef}
        className="custom-scrollbar"
        onScroll={handleScroll}
        style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%', overflowX: 'auto', overflowY: 'hidden', background: '#131313', visibility: fitted ? 'visible' : 'hidden' }}
      >
        <div style={{ position: 'relative', width: sizerW, height: size.h, margin: '0 auto' }}>
          <iframe
            title="Live Preview"
            srcDoc={srcDoc}
            sandbox="allow-scripts allow-popups"
            style={{
              position: 'absolute', top: 0, left: 0, border: 0, background: '#131313',
              width: refWidth,
              height: iframeHeight,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Helpers (ไม่ต้องใช้ state จึงอยู่นอก component)
// ============================================================
const rep = (s: string, key: string, val: any) => (key ? s.split(key).join(String(val ?? "")) : s);
const escapeRegex = (s: string) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

// 🌟 ฟังก์ชันใหม่สำหรับแกะ Dropdown Options อย่างชาญฉลาด
const parseDropdownOptions = (optionsStr: string) => {
  if (!optionsStr) return [];
  // 💡 ทริค: ถ้าเจอเคาะบรรทัด ถือว่าใช้บรรทัดแบ่ง (ลูกน้ำข้างในจะไม่พัง) แต่ถ้าไม่เจอ ใช้ลูกน้ำแบ่งแบบเดิม
  const separator = optionsStr.includes('\n') ? /\r?\n/ : /,/;
  
  return optionsStr.split(separator).map(opt => {
    const parts = opt.split('=');
    const label = parts[0].trim();
    if (!label) return null;

    if (parts.length >= 2) {
      // เอาหลัง = มารวมกัน (ไม่ trim) เพื่อคงช่องว่างด้านหน้าไว้ (เช่น " yellow")
      let val = parts.slice(1).join('=');
      val = val.replace(/\r$/, ''); // ป้องกัน \r ติดมาจากการขึ้นบรรทัดใหม่
      return { label, value: val };
    }
    return { label, value: label };
  }).filter(Boolean) as {label: string, value: string}[];
};

// ============================================================
// 🖼️ Image helpers
// รองรับทั้งฟิลด์ชนิด image และ image_url
// ============================================================
type SizeMode = 'cover' | 'contain' | 'auto' | 'percent' | 'percent_both' | 'px';
type PosMode = 'percent' | 'keyword' | 'px';
type KeyX = 'left' | 'center' | 'right';
type KeyY = 'top' | 'center' | 'bottom';

interface ImgData {
  url: string;
  posMode: PosMode;   // percent = 50% 50% | keyword = left top | px = 20px 30px
  x: number;          // ใช้เมื่อ posMode = percent (%) หรือ px
  y: number;
  kx: KeyX;           // ใช้เมื่อ posMode = keyword
  ky: KeyY;
  zoom: number;       // ความกว้าง (%) หรือ px ตามโหมด
  zoomH?: number;     // ความสูง (%) ใช้เฉพาะโหมด percent_both (ถ้าไม่ระบุ = เท่ากับความกว้าง)
  sizeMode: SizeMode;
  repeat: string;
}

const KEY_X: KeyX[] = ['left', 'center', 'right'];
const KEY_Y: KeyY[] = ['top', 'center', 'bottom'];

const POS_MODES: { value: PosMode; label: string }[] = [
  { value: 'percent', label: '% (50% 50%)' },
  { value: 'keyword', label: 'คำสั่ง (left, top…)' },
  { value: 'px', label: 'พิกเซล (px)' },
];

const SIZE_MODES: { value: SizeMode; label: string }[] = [
  { value: 'percent', label: 'กว้าง %' },
  { value: 'percent_both', label: 'กว้าง+สูง %' },
  { value: 'px', label: 'พิกเซล (px)' },
  { value: 'cover', label: 'cover' },
  { value: 'contain', label: 'contain' },
  { value: 'auto', label: 'auto' },
];

const REPEAT_OPTIONS = [
  { value: 'no-repeat', label: 'no-repeat' },
  { value: 'repeat', label: 'repeat' },
  { value: 'repeat-x', label: 'repeat-x' },
  { value: 'repeat-y', label: 'repeat-y' },
  { value: '', label: 'ไม่ใส่' },
];

const makeImg = (o: any = {}): ImgData => ({
  url: "", posMode: 'percent', x: 50, y: 50, kx: 'center', ky: 'center',
  zoom: 100, sizeMode: 'percent', repeat: 'no-repeat',
  ...(o || {}),
});

const cssUrl = (u: string) => `url('${String(u).trim().replace(/'/g, '%27').replace(/\\/g, '%5C')}')`;

const imgSizeCss = (d: ImgData): string => {
  switch (d.sizeMode) {
    case 'cover': case 'contain': case 'auto': return d.sizeMode;
    case 'percent_both': return `${d.zoom}% ${d.zoomH ?? d.zoom}%`;
    case 'px': return `${d.zoom}px`;
    default: return `${d.zoom}%`;
  }
};

const imgPosCss = (d: ImgData): string => {
  switch (d.posMode) {
    case 'keyword': return `${d.kx} ${d.ky}`;
    case 'px': return `${d.x}px ${d.y}px`;
    default: return `${d.x}% ${d.y}%`;
  }
};

const imgToCss = (d: ImgData) =>
  `${cssUrl(d.url)} ${imgPosCss(d)} / ${imgSizeCss(d)}${d.repeat ? ' ' + d.repeat : ''}`;

// Regex จับ: [url('VAR') | VAR] + [ตำแหน่ง] + [/ ขนาด] + [repeat]
// group1 = มี url( ครอบอยู่, group2 = ตำแหน่ง, group3 = ขนาด, group4 = repeat
const LEN = `-?\\d*\\.?\\d+(?:%|px|vw|vh|vmin|vmax|em|rem)?`;
const tok = (s: string) => `(?:${s})(?![\\w-])`;
const POS = tok(`center|left|right|top|bottom|${LEN}`);
const SIZE_TOK = tok(`${LEN}|auto`);
const bgRegex = (name: string) => {
  const n = escapeRegex(name);
  return new RegExp(
    `(?:(url\\(\\s*['"]?)${n}['"]?\\s*\\)|${n})` +
    `(?:\\s+(${POS}(?:\\s+${POS}){0,3})` +
    `(?:\\s*\\/\\s*(${tok('cover|contain')}|${SIZE_TOK}(?:\\s+${SIZE_TOK})?))?` +
    `((?:\\s+(?:no-repeat|repeat-x|repeat-y|repeat|space|round)(?![\\w-]))*))?`,
    'gi'
  );
};

// อ่านค่าตำแหน่ง/ซูม/repeat จากโค้ดต้นฉบับ เพื่อใช้เป็นค่าเริ่มต้น
const detectImgDefaults = (html: string, name: string): ImgData => {
  const d = makeImg();
  const m = html ? bgRegex(name).exec(html) : null;
  if (!m || !m[2]) return d;

  const isKw = (t: string) => /^(left|right|top|bottom|center)$/.test(t);
  const isPct = (t: string) => /^-?\d*\.?\d+%$/.test(t);
  const isPx = (t: string) => /^-?\d*\.?\d+px$/.test(t) || t === '0';
  const kwPct: any = { center: 50, left: 0, top: 0, right: 100, bottom: 100 };
  const toPct = (t: string) => kwPct[t] ?? (isPct(t) ? parseFloat(t) : NaN);

  const p = m[2].trim().toLowerCase().split(/\s+/);

  if (p.length <= 2) {
    if (p.every(isKw)) {
      // แบบคำสั่ง: center / left top / top left / center bottom ...
      d.posMode = 'keyword';
      if (p.length === 1) {
        if (p[0] === 'top' || p[0] === 'bottom') d.ky = p[0] as KeyY;
        else if (p[0] === 'left' || p[0] === 'right') d.kx = p[0] as KeyX;
      } else {
        const [a, b] = p;
        const vertFirst = a === 'top' || a === 'bottom' || b === 'left' || b === 'right';
        const hx = vertFirst ? b : a;
        const hy = vertFirst ? a : b;
        if ((KEY_X as string[]).includes(hx)) d.kx = hx as KeyX;
        if ((KEY_Y as string[]).includes(hy)) d.ky = hy as KeyY;
      }
    } else if (p.length === 2 && p.every(isPx)) {
      // แบบพิกเซล: 20px 30px
      d.posMode = 'px';
      d.x = parseFloat(p[0]);
      d.y = parseFloat(p[1]);
    } else if (p.length === 1) {
      const v = toPct(p[0]);
      if (!isNaN(v)) d.x = Math.round(v);
    } else {
      // แบบเปอร์เซ็นต์ (หรือผสมกับคำสั่ง เช่น center 20%)
      const vx = toPct(p[0]), vy = toPct(p[1]);
      if (!isNaN(vx)) d.x = Math.round(vx);
      if (!isNaN(vy)) d.y = Math.round(vy);
    }
  }
  // ตำแหน่งแบบอ้างอิงขอบ (right 10px bottom 20px) ยังไม่รองรับ → ใช้ค่าเริ่มต้น 50% 50%

  if (m[3]) {
    const s = m[3].trim().toLowerCase().split(/\s+/);
    if (['cover', 'contain', 'auto'].includes(s[0]) && s.length === 1) {
      d.sizeMode = s[0] as SizeMode;
    } else if (s[0].endsWith('%')) {
      d.zoom = parseFloat(s[0]);
      if (s.length > 1 && s[1].endsWith('%')) {
        d.sizeMode = 'percent_both';
        d.zoomH = parseFloat(s[1]);
      } else {
        d.sizeMode = 'percent';
      }
    } else if (s[0].endsWith('px')) {
      d.zoom = parseFloat(s[0]);
      d.sizeMode = 'px';
    }
  }

  // คง repeat ตามต้นฉบับ (ถ้าต้นฉบับไม่มี ก็ไม่ใส่)
  d.repeat = (m[4] || '').trim().split(/\s+/)[0] || '';
  return d;
};

// แปลงค่าที่ autosave ไว้ในรูปแบบเก่า (ไม่มี sizeMode) ให้เข้ากับระบบใหม่
const migrateImg = (saved: any, detected: ImgData): ImgData => {
  if (!saved || typeof saved !== 'object') return detected;
  if (saved.sizeMode !== undefined) return makeImg(saved);
  const untouched = saved.x === 50 && saved.y === 50 && saved.zoom === 100;
  return untouched
    ? { ...detected, url: saved.url || "" }
    : { ...detected, ...saved, sizeMode: 'percent' };
};

const isImageField = (f: any) => f?.type === 'image' || f?.type === 'image_url';

// ============================================================
// 🖼️ ImageFieldEditor: ตัวปรับรูปภาพแบบกะทัดรัด (ใช้กับฟิลด์ image / image_url)
// ============================================================
function ImageFieldEditor({ field, val, onChange, resetTo }: {
  field: any;
  val: any;
  onChange: (v: any) => void;
  resetTo: ImgData;
}) {
  const d = makeImg(val);
  const set = (patch: Partial<ImgData>) => onChange({ ...d, ...patch });
  const hasUrl = d.url.trim() !== '';
  const isPxSize = d.sizeMode === 'px';
  const isBoth = d.sizeMode === 'percent_both';
  const sizeNumeric = d.sizeMode === 'percent' || isBoth || isPxSize;
  const posPx = d.posMode === 'px';
  const sizeText = imgSizeCss(d);
  const posText = imgPosCss(d);
  const num = (v: string, cb: (n: number) => void) => { const n = parseFloat(v); if (!isNaN(n)) cb(n); };

  const onPosMode = (m: PosMode) => {
    const patch: Partial<ImgData> = { posMode: m };
    if (m === 'px' && d.posMode !== 'px') { patch.x = 0; patch.y = 0; }
    if (m === 'percent' && d.posMode === 'px') { patch.x = 50; patch.y = 50; }
    if (m === 'keyword' && d.posMode === 'percent') {
      patch.kx = d.x <= 33 ? 'left' : d.x >= 67 ? 'right' : 'center';
      patch.ky = d.y <= 33 ? 'top' : d.y >= 67 ? 'bottom' : 'center';
    }
    set(patch);
  };

  const onSizeMode = (m: SizeMode) => {
    const wasPx = d.sizeMode === 'px';
    const nextZoom = m === 'px' && !wasPx ? 500 : m !== 'px' && wasPx ? 100 : d.zoom;
    set({ sizeMode: m, zoom: nextZoom, zoomH: m === 'percent_both' ? (d.zoomH ?? nextZoom) : undefined });
  };

  const presets = isPxSize ? [200, 400, 600, 800, 1200] : [50, 100, 150, 200, 300];

  return (
    <div className="img-ed">
      {/* หัวข้อ + รีเซ็ต */}
      <div className="img-row">
        <span className="field-label" style={{ fontSize: '0.85rem', flex: 1, minWidth: 0 }}>
          {field.label}
          {field.type === 'image_url' && <span className="img-badge">BG</span>}
        </span>
        <button type="button" className="tool-btn img-reset" title="กลับไปใช้ตำแหน่ง/ซูมตามโค้ดต้นฉบับ" onClick={() => onChange({ ...resetTo, url: d.url })}>↺ รีเซ็ต</button>
      </div>

      <input type="url" className="glass-input" style={{ height: 30, padding: '4px 10px', fontSize: '0.85rem' }} placeholder="วางลิงก์รูปภาพ..." value={d.url} onChange={e => set({ url: e.target.value })} />

      {/* พรีวิวเล็ก + ค่า CSS */}
      {hasUrl && (
        <div className="img-row" style={{ alignItems: 'flex-start' }}>
          <div className="img-thumb" style={{
            backgroundImage: cssUrl(d.url),
            backgroundPosition: posText,
            backgroundSize: sizeText,
            backgroundRepeat: d.repeat || 'repeat',
          }} />
          <code className="img-code">{posText} / {sizeText}{d.repeat ? ' ' + d.repeat : ''}</code>
        </div>
      )}

      {/* เลือกรูปแบบ: ตำแหน่ง / ซูม / ซ้ำ */}
      <div className="img-grid3">
        <label className="img-cap">ตำแหน่ง
          <select className="img-mini" value={d.posMode} onChange={e => onPosMode(e.target.value as PosMode)}>
            {POS_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </label>
        <label className="img-cap">ซูม
          <select className="img-mini" value={d.sizeMode} onChange={e => onSizeMode(e.target.value as SizeMode)}>
            {SIZE_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </label>
        <label className="img-cap">ซ้ำรูป
          <select className="img-mini" value={d.repeat} onChange={e => set({ repeat: e.target.value })}>
            {REPEAT_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </label>
      </div>

      {/* ตำแหน่ง */}
      {d.posMode === 'keyword' ? (
        <div className="img-row">
          <div className="pos-pad">
            {KEY_Y.map(ky => KEY_X.map(kx => (
              <button
                type="button"
                key={`${kx}_${ky}`}
                className={`pos-cell ${d.kx === kx && d.ky === ky ? 'on' : ''}`}
                title={`${kx} ${ky}`}
                onClick={() => set({ kx, ky })}
              />
            )))}
          </div>
          <code className="img-code" style={{ flex: 'none' }}>{d.kx} {d.ky}</code>
        </div>
      ) : (
        <div className="img-grid2">
          {(['x', 'y'] as const).map(ax => (
            <div key={ax} className="img-row">
              <span className="img-lbl">{ax.toUpperCase()}</span>
              <input
                type="range" className="img-range"
                min={posPx ? -1000 : 0} max={posPx ? 1000 : 100} step={posPx ? 5 : 1}
                value={d[ax]}
                onChange={e => set({ [ax]: Number(e.target.value) } as any)}
              />
              <input type="number" className="img-mini img-num" value={d[ax]} onChange={e => num(e.target.value, n => set({ [ax]: n } as any))} />
              <span className="img-unit">{posPx ? 'px' : '%'}</span>
            </div>
          ))}
        </div>
      )}

      {/* ซูม (เฉพาะโหมดที่เป็นตัวเลข) */}
      {sizeNumeric && (
        <>
          <div className="img-row">
            <span className="img-lbl">{isBoth ? 'กว้าง' : 'ซูม'}</span>
            <input
              type="range" className="img-range"
              min={isPxSize ? 50 : 10} max={isPxSize ? 3000 : 500} step={isPxSize ? 10 : 1}
              value={d.zoom}
              onChange={e => set({ zoom: Number(e.target.value) })}
            />
            <input type="number" className="img-mini img-num" min={1} value={d.zoom} onChange={e => num(e.target.value, n => set({ zoom: Math.max(1, n) }))} />
            <span className="img-unit">{isPxSize ? 'px' : '%'}</span>
          </div>

          {isBoth && (
            <div className="img-row">
              <span className="img-lbl">สูง</span>
              <input
                type="range" className="img-range" min={10} max={500}
                value={d.zoomH ?? d.zoom}
                onChange={e => set({ zoomH: Number(e.target.value) })}
              />
              <input type="number" className="img-mini img-num" min={1} value={d.zoomH ?? d.zoom} onChange={e => num(e.target.value, n => set({ zoomH: Math.max(1, n) }))} />
              <span className="img-unit">%</span>
            </div>
          )}

          <div className="img-row" style={{ gap: 4, flexWrap: 'wrap' }}>
            {presets.map(z => (
              <button
                key={z} type="button" className="tool-btn img-chip"
                onClick={() => set(isBoth ? { zoom: z, zoomH: z } : { zoom: z })}
              >{z}{isPxSize ? 'px' : '%'}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function CodeDetail() {
  const params = useParams<{ id: string }>();
  const codeId = params?.id || '';

  const [code, setCode] = useState<any>(null);
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

  // State หลักที่อัปเดตทันทีที่พิมพ์
  const [fieldValues, setFieldValues] = useState<{ [key: string]: any }>({});
  
  // State ที่ชะลอการอัปเดต (Debounced) เพื่อไม่ให้พรีวิวกระพริบตอนพิมพ์
  const [debouncedFieldValues, setDebouncedFieldValues] = useState<{ [key: string]: any }>({});
  
  const [activeBlocks, setActiveBlocks] = useState<any[]>([]);
  const [debouncedActiveBlocks, setDebouncedActiveBlocks] = useState<any[]>([]);
  
  const [drafts, setDrafts] = useState<{ name: string; values: any; blocks: any[] }[]>([]);
  const [draftName, setDraftName] = useState("");
  const [selectedDraftIndex, setSelectedDraftIndex] = useState<number>(-1);

  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});
  const [selections, setSelections] = useState<{ [key: string]: { start: number, end: number } }>({});

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFieldValues(fieldValues);
      setDebouncedActiveBlocks(activeBlocks);
    }, 300);
    return () => clearTimeout(handler);
  }, [fieldValues, activeBlocks]);

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

            // ถ้าไม่ล็อก ปลดล็อกเลย / ถ้าล็อกต้องกรอกรหัส
            setIsUnlocked(!foundCode.isLocked);

            initFieldValues(foundCode);
            loadDraftsFromStorage(codeId);
          }
        }
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchCode();
  }, [codeId]);

  const getDropdownFirstOption = (optionsStr: string) => {
    const opts = parseDropdownOptions(optionsStr);
    return opts.length > 0 ? opts[0].value : "";
  };

  const initFieldValues = (codeData: any, forceReset: boolean = false) => {
    const initial: { [key: string]: any } = {};
    if (codeData.customFields && Array.isArray(codeData.customFields)) {
      codeData.customFields.forEach((field: any) => {
        if (isImageField(field)) {
          // อ่านค่าตั้งต้น (ตำแหน่ง/ซูม/repeat) จากโค้ดต้นฉบับ ทั้งชนิด image และ image_url
          initial[field.variableName] = detectImgDefaults(codeData.htmlCode, field.variableName);
        } else if (field.type === 'dropdown') {
          initial[field.variableName] = getDropdownFirstOption(field.options);
        } else {
          initial[field.variableName] = ""; 
        }
      });
    }

    if (!forceReset) {
      try {
        const autosave = localStorage.getItem(`code_autosave_${codeData.id}`);
        if (autosave) {
          const parsed = JSON.parse(autosave);
          const merged: { [key: string]: any } = { ...initial, ...(parsed.values || {}) };

          // แปลงค่ารูปภาพที่ autosave ไว้ในรูปแบบเก่าให้เข้ากับระบบใหม่
          (codeData.customFields || []).forEach((field: any) => {
            if (isImageField(field)) {
              merged[field.variableName] = migrateImg(parsed.values?.[field.variableName], initial[field.variableName]);
            }
          });

          setFieldValues(merged);
          setActiveBlocks(parsed.blocks || []);
          
          setTimeout(() => {
            Object.values(textareaRefs.current).forEach(el => autoResize(el));
          }, 100);
          return;
        }
      } catch (e) { console.error("Autosave load error:", e); }
    }

    setFieldValues(initial);
    setActiveBlocks([]);
  };

  useEffect(() => {
    if (!code || !codeId) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(`code_autosave_${codeId}`, JSON.stringify({
          values: fieldValues,
          blocks: activeBlocks
        }));
      } catch (e) { console.warn("Autosave skipped", e); }
    }, 1000); 
    return () => clearTimeout(timer);
  }, [fieldValues, activeBlocks, codeId, code]);

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

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === code?.lockPassword) {
      setIsUnlocked(true);
      setShowUnlockModal(false);
      setPasswordError(false);
      
      if (pendingAction) {
        setEditMode(pendingAction.mode);
        setViewMode(pendingAction.vMode);
        setPendingAction(null);
      }
    } else {
      setPasswordError(true);
    }
  };

  const handleModeSwitch = (mode: 'original' | 'customize', vMode: 'preview' | 'code') => {
    if (code?.isLocked && !isUnlocked && (mode === 'customize' || vMode === 'code')) {
      setPendingAction({ mode, vMode });
      setShowUnlockModal(true);
    } else {
      setEditMode(mode);
      setViewMode(vMode);
    }
  };

  const addBlock = (blockDef: any) => {
    const newBlock = { instanceId: `block_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, blockId: blockDef.id, placeholder: blockDef.placeholder, htmlTemplate: blockDef.html, fields: blockDef.fields, values: {} as any };
    if (blockDef.fields && Array.isArray(blockDef.fields)) {
      blockDef.fields.forEach((f: any) => {
        if (isImageField(f)) {
          newBlock.values[f.variableName] = detectImgDefaults(blockDef.html, f.variableName);
        } else if (f.type === 'dropdown') {
          newBlock.values[f.variableName] = getDropdownFirstOption(f.options);
        } else {
          newBlock.values[f.variableName] = "";
        }
      });
    }
    setActiveBlocks([...activeBlocks, newBlock]);
  };
  const removeBlock = (instanceId: string) => { if(confirm("ลบส่วนเสริมนี้ทิ้งใช่หรือไม่?")) setActiveBlocks(activeBlocks.filter(b => b.instanceId !== instanceId)); };
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newArr = [...activeBlocks];
    if (direction === 'up' && index > 0) [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
    else if (direction === 'down' && index < newArr.length - 1) [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
    setActiveBlocks(newArr);
  };
  const updateBlockValue = (instanceId: string, varName: string, val: any) => setActiveBlocks(prev => prev.map(b => b.instanceId === instanceId ? { ...b, values: { ...b.values, [varName]: val } } : b));
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
      .replace(/\[url=(.*?)\]([\s\S]*?)\[\/url\]/gi, '<a href="$1" target="_blank" style="color: #a855f7; text-decoration: underline;">$2</a>')
      .replace(/\[img\](.*?)\[\/img\]/gi, '<img src="$1" style="max-width: 100%; height: auto; border-radius: 8px;" />')
      .replace(/\[img=(.*?)\][\s\S]*?\[\/img\]/gi, '<img src="$1" style="max-width: 100%; height: auto; border-radius: 8px;" />')
      .replace(/\[yt\](.*?)\[\/yt\]/gi, '<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 8px; margin: 10px 0;"><iframe src="https://www.youtube.com/embed/$1" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border:0;" allowfullscreen></iframe></div>')
      .replace(/\[yt=(.*?)\][\s\S]*?\[\/yt\]/gi, '<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 8px; margin: 10px 0;"><iframe src="https://www.youtube.com/embed/$1" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border:0;" allowfullscreen></iframe></div>')
      .replace(/\[ytauto\](.*?)\[\/ytauto\]/gi, '<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 8px; margin: 10px 0;"><iframe src="https://www.youtube.com/embed/$1?autoplay=1" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border:0;" allow="autoplay" allowfullscreen></iframe></div>')
      .replace(/\[ytauto=(.*?)\][\s\S]*?\[\/ytauto\]/gi, '<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 8px; margin: 10px 0;"><iframe src="https://www.youtube.com/embed/$1?autoplay=1" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border:0;" allow="autoplay" allowfullscreen></iframe></div>')
      .replace(/\[hideyt\](.*?)\[\/hideyt\]/gi, '<iframe src="https://www.youtube.com/embed/$1?autoplay=1" style="width:0; height:0; border:0; display:none;" allow="autoplay"></iframe>')
      .replace(/\[hideyt=(.*?)\][\s\S]*?\[\/hideyt\]/gi, '<iframe src="https://www.youtube.com/embed/$1?autoplay=1" style="width:0; height:0; border:0; display:none;" allow="autoplay"></iframe>')
      .replace(/\[hr\]/gi, '<hr style="border: 0; border-top: 1px solid currentColor; opacity: 0.3; margin: 16px 0;" />');
      
    if (isForPreview) parsed = parsed.replace(/\n/g, '<br/>');
    return parsed;
  };

  const countWords = (text: string) => {
    if (!text || text.trim() === '') return 0;
    const clean = text.replace(/<[^>]*>?/gm, '').replace(/\[.*?\]/g, '').trim();
    if (!clean) return 0;
    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
      const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
      let count = 0;
      for (const segment of segmenter.segment(clean)) if (segment.isWordLike) count++;
      return count;
    }
    return clean.split(/\s+/).filter(Boolean).length;
  };

  const getFallbackColor = (field: any) => {
    const variation = code?.variations?.[activeVariation];
    let fallback = '#8b5cf6';
    if (field?.type === 'gradient') {
      fallback = field.options || 'linear-gradient(90deg, #d8b4fe, #bae6fd)';
    }

    if (variation && variation.replacements && field?.variableName) {
      const lines = variation.replacements.split('\n');
      const found = lines.find((l: string) => l.split('=')[0].trim() === field.variableName);
      if (found) {
        return found.substring(found.indexOf('=') + 1).trim() || fallback;
      }
    }
    return fallback;
  };

  const safeHex = (colorStr: string, defaultHex: string = '#000000') => {
    if (!colorStr) return defaultHex;
    if (colorStr.startsWith('rgb') || colorStr.startsWith('hsl') || colorStr.startsWith('var')) return colorStr;
    const match = colorStr.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/i);
    if (match) {
      let hex = match[0];
      if (hex.length === 4) { 
         hex = '#' + hex[1]+hex[1] + hex[2]+hex[2] + hex[3]+hex[3];
      }
      return hex;
    }
    return colorStr;
  };

  // 🔧 รับ fallbackValues เป็นพารามิเตอร์ (ไม่อ่าน state ตรง ๆ แล้ว) เพื่อให้ useMemo deps ถูกต้อง
  const checkConditionMatch = (field: any, allValues: any, contextFields: any[], fallbackValues: any = {}) => {
    if (!field.conditionVar || field.conditionVar.trim() === "") return true;
    
    let parentVal = allValues?.[field.conditionVar];
    if (parentVal === undefined) {
      parentVal = fallbackValues?.[field.conditionVar] ?? "";
    }
    
    if (parentVal === field.conditionVal) return true;

    const allAvailableFields = [...(contextFields || []), ...(code?.customFields || [])];
    
    const parentField = allAvailableFields.find((f: any) => f.variableName === field.conditionVar);
    if (parentField && parentField.type === 'dropdown' && parentField.options) {
      const optionsArray = parseDropdownOptions(parentField.options);
      for (const opt of optionsArray) {
        // opt.label หรือ opt.value ก็ต้องแมทช์ได้
        if (opt.value === parentVal && (opt.label === field.conditionVal || opt.value === field.conditionVal)) {
          return true;
        }
      }
    }
    
    return false;
  };

  // 🔧 ฟังก์ชันกลางสำหรับแทนค่าฟิลด์ (ใช้ทั้งฟิลด์หลักและ Blocks แทนโค้ดที่ซ้ำกันเดิม)
  const applyFields = (html: string, fields: any[], values: any, isForPreview: boolean, fallbackValues: any): string => {
    let out = html;
    const list = Array.isArray(fields) ? fields : [];
    const byLenDesc = (a: any, b: any) => b.variableName.length - a.variableName.length;

    // 1) Dropdown ก่อน (ชื่อยาวก่อน กันชื่อซ้อนทับกัน เช่น TITLE กับ TITLE2)
    list.filter(f => f.type === 'dropdown').sort(byLenDesc).forEach(field => {
      const val = values?.[field.variableName];
      // ถ้าค่าเป็น string (รวมถึง "") ก็ให้แทนที่ไปเลย
      if (typeof val === 'string') {
        out = rep(out, field.variableName, val);
      }
    });

    // 2) ฟิลด์อื่น ๆ: เรียงชื่อยาวก่อน แล้วถ้าชื่อเท่ากัน (ฟิลด์เงื่อนไขที่ใช้ตัวแปรเดียวกัน) ให้ตัวที่แสดงผลได้แทนก่อน
    const sorted = list.filter(f => f.type !== 'dropdown').sort((a, b) => {
      const lenDiff = byLenDesc(a, b);
      if (lenDiff !== 0) return lenDiff;
      const aVis = checkConditionMatch(a, values, fields, fallbackValues) ? 1 : 0;
      const bVis = checkConditionMatch(b, values, fields, fallbackValues) ? 1 : 0;
      return bVis - aVis;
    });

    sorted.forEach(field => {
      const name: string = field.variableName;
      const isVisible = checkConditionMatch(field, values, fields, fallbackValues);

      if (isImageField(field)) {
        const imgData = makeImg(values?.[name]);
        const hasUrl = isVisible && !!imgData.url && imgData.url.trim() !== '';
        const urlCss = hasUrl ? imgToCss(imgData) : "";
        const plainUrl = hasUrl ? imgData.url.trim() : "";

        // แทนตัวแปรที่มี suffix ก่อนตัวแปรหลักเสมอ ไม่งั้น VAR_URL จะกลายเป็น "<url>_URL"
        out = rep(out, `${name}_CSS`, urlCss);
        out = rep(out, `${name}_URL`, plainUrl);
        out = rep(out, `${name}_POS`, hasUrl ? imgPosCss(imgData) : "");
        out = rep(out, `${name}_X`, hasUrl ? (imgData.posMode === 'keyword' ? imgData.kx : imgData.x) : "");
        out = rep(out, `${name}_Y`, hasUrl ? (imgData.posMode === 'keyword' ? imgData.ky : imgData.y) : "");
        out = rep(out, `${name}_ZOOM`, hasUrl ? imgData.zoom : "");
        out = rep(out, `${name}_SIZE`, hasUrl ? imgSizeCss(imgData) : "");
        out = rep(out, `${name}_REPEAT`, hasUrl ? imgData.repeat : "");

        const nameRe = new RegExp(escapeRegex(name), 'i');

        out = out.replace(bgRegex(name), (m: string, wrap: string, pos: string) => {
          // มีตำแหน่ง/ขนาดต่อท้าย (เช่น 50% 50%/100% no-repeat, center/cover) → แทนทั้งชุดด้วยค่าที่ปรับ
          if (pos) return hasUrl ? urlCss : "";

          if (field.type === 'image_url') {
            if (!hasUrl) return "";
            return wrap ? cssUrl(imgData.url) : urlCss; // url(VAR) เฉย ๆ → ใส่แค่ url('...')
          }

          // ชนิด image ที่ไม่มีตำแหน่งต่อท้าย (เช่น <img src="VAR">) → แทนชื่อเป็น URL เฉย ๆ
          return m.replace(nameRe, () => plainUrl);
        });

      } else if (field.type === 'color' || field.type === 'gradient') {
        if (isVisible) {
          // ยังไม่กรอก = ไม่ใส่สี (ไม่มีสีตัวอย่าง)
          out = rep(out, name, values?.[name] || "");
        } else {
          out = rep(out, name, "");
        }

      } else {
        if (isVisible) {
          let textVal = values?.[name];
          if (textVal === undefined || textVal === null || textVal === "") {
            textVal = name;
          } else if (field.type === 'richtext' || field.type === 'roleplay') {
            textVal = isForPreview ? parseContent(textVal, true) : textVal;
          }
          out = rep(out, name, textVal);
        } else {
          out = rep(out, name, "");
        }
      }
    });

    return out;
  };

  const getRenderedHtml = (isForPreview: boolean = false) => {
    if (!code || !code.htmlCode) return "";
    let finalHtml: string = code.htmlCode;
    
    const currentValuesToUse = isForPreview ? debouncedFieldValues : fieldValues;
    const currentBlocksToUse = isForPreview ? debouncedActiveBlocks : activeBlocks;
    
    if (editMode === 'customize') {
      finalHtml = applyFields(finalHtml, code.customFields, currentValuesToUse, isForPreview, currentValuesToUse);

      if (currentBlocksToUse.length > 0) {
        const blocksByPlaceholder: { [key: string]: string[] } = {};
        
        currentBlocksToUse.forEach(block => {
          const blockHtml = applyFields(block.htmlTemplate || "", block.fields, block.values, isForPreview, currentValuesToUse);
          if (!blocksByPlaceholder[block.placeholder]) blocksByPlaceholder[block.placeholder] = [];
          blocksByPlaceholder[block.placeholder].push(blockHtml);
        });
        Object.keys(blocksByPlaceholder).forEach(ph => { finalHtml = rep(finalHtml, ph, blocksByPlaceholder[ph].join('\n')); });
      }

      // ล้าง placeholder ของ block ที่ไม่ได้ถูกเพิ่ม
      if (code.blocks && Array.isArray(code.blocks)) {
        code.blocks.forEach((b: any) => { if (b.placeholder) finalHtml = rep(finalHtml, b.placeholder, ""); });
      }

    } else {
      const variation = code.variations?.[activeVariation];
      if (variation) {
        if (variation.type === 'full_html' && variation.fullHtml) {
          finalHtml = variation.fullHtml;
        } else if (variation.replacements) {
          const lines = variation.replacements.split('\n');
          lines.forEach((line: string) => {
            const idx = line.indexOf('=');
            if (idx !== -1) {
              const k = line.substring(0, idx).trim();
              const v = line.substring(idx + 1).trim();
              if (k) finalHtml = rep(finalHtml, k, v);
            }
          });
        }
      }
      
      if (code.blocks && Array.isArray(code.blocks)) {
        code.blocks.forEach((b: any) => { if (b.placeholder) finalHtml = rep(finalHtml, b.placeholder, ""); });
      }
    }

    return finalHtml;
  };

  // 🔧 deps ครบแล้ว (เดิมขาดค่าที่ getRenderedHtml อ่านอยู่)
  const previewHtml = useMemo(
    () => getRenderedHtml(true),
    [debouncedFieldValues, debouncedActiveBlocks, code, editMode, activeVariation]
  );
  const codeHtml = useMemo(
    () => getRenderedHtml(false),
    [fieldValues, activeBlocks, code, editMode, activeVariation]
  );

  const handleCopy = () => {
    const exactCodeHtml = getRenderedHtml(false); 
    navigator.clipboard.writeText(exactCodeHtml).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error("Failed to copy text: ", err);
      alert("ไม่สามารถก๊อปปี้ได้ กรุณาลองใหม่อีกครั้ง");
    });
  };

  const renderFieldUI = (field: any, val: any, onChange: (v: any) => void, refKey: string, allValues: any, contextFields: any[]) => {
    
    if (!checkConditionMatch(field, allValues, contextFields, fieldValues)) {
      return null; 
    }

    if (field.type === 'dropdown') {
      const parsedOptions = parseDropdownOptions(field.options);
      
      // 🔧 แก้ปัญหา Placeholder: 
      // ถ้า val เป็น undefined/null จะใช้ "__PLACEHOLDER__" เพื่อโชว์บรรทัด '-- เลือก...'
      // ถ้าผู้ใช้เลือกชอยส์ "ซ่อน=" (ซึ่งทำให้ val="") มันจะไม่โดนมองข้าม
      const currentVal = val !== undefined && val !== null ? val : "__PLACEHOLDER__";

      return (
        <div key={refKey} className="field-group">
          <label className="field-label">{field.label}</label>
          <select 
            className="glass-input" 
            value={currentVal} 
            onChange={e => onChange(e.target.value)}
          >
            <option value="__PLACEHOLDER__" disabled>-- เลือก{field.label} --</option>
            {parsedOptions.map((opt: any, idx: number) => (
              <option key={`opt_${idx}`} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      );
    }
    
    // ระบบ Gradient (Linear / Radial)
    if (field.type === 'gradient') {
      const fallbackCol = getFallbackColor(field);
      let currentVal = val || fallbackCol;
      
      if (!currentVal || (!currentVal.includes('gradient') && !currentVal.startsWith('#') && !currentVal.startsWith('rgb') && !currentVal.startsWith('hsl'))) {
          currentVal = field.options || 'linear-gradient(90deg, #d8b4fe, #bae6fd)';
      }
      
      const isRadial = currentVal.includes('radial-gradient');
      const gradType = isRadial ? 'radial' : 'linear';
      
      const getAngleOrPosition = () => {
        if (isRadial) {
          const posMatch = currentVal.match(/circle at ([^,]+)/);
          return posMatch ? posMatch[1].trim() : 'center';
        } else {
          const angleMatch = currentVal.match(/(\d+)deg/);
          return angleMatch ? angleMatch[1] : '90';
        }
      };

      const extractColors = (): string[] => {
        const matches = currentVal.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b|(rgb|hsl)a?\([^)]+\)|[a-zA-Z]+/gi) || [];
        const colors = matches.filter((c: string) => c.startsWith('#') || c.startsWith('rgb') || c.startsWith('hsl'));
        return colors.length >= 2 ? colors : ['#d8b4fe', '#bae6fd'];
      };

      const colors = extractColors();
      const angleOrPos = getAngleOrPosition();

      const updateGradient = (newType: string, newAngleOrPos: string, newColors: string[]) => {
        if (newType === 'linear') {
          const safeAngle = newAngleOrPos === 'center' || newAngleOrPos.includes('%') ? '90' : newAngleOrPos.replace(/[^0-9]/g, '');
          onChange(`linear-gradient(${safeAngle || '90'}deg, ${newColors.join(', ')})`);
        } else if (newType === 'radial') {
          const safePos = newAngleOrPos.includes('deg') || !isNaN(Number(newAngleOrPos)) ? 'center' : newAngleOrPos;
          onChange(`radial-gradient(circle at ${safePos}, ${newColors.join(', ')})`);
        }
      };

      const handleColorChange = (index: number, newColor: string) => {
        const newColors = [...colors];
        newColors[index] = newColor;
        updateGradient(gradType, angleOrPos, newColors);
      };

      const handleAddColor = () => {
        const lastColor = colors[colors.length - 1];
        updateGradient(gradType, angleOrPos, [...colors, lastColor]);
      };

      const handleRemoveColor = (index: number) => {
        if (colors.length <= 2) return; 
        const newColors = colors.filter((color: string, i: number) => i !== index);
        updateGradient(gradType, angleOrPos, newColors);
      };

      return (
        <div key={refKey} className="field-group">
          <label className="field-label">{field.label}</label>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ 
              width: '40px', height: '36px', borderRadius: '6px', 
              background: val ? (currentVal.includes('gradient') ? currentVal : safeHex(currentVal)) : 'repeating-conic-gradient(#d4d4d8 0% 25%, #fff 0% 50%) 50% / 12px 12px', 
              border: '1px solid var(--color-accent-mute)', flexShrink: 0
            }} />
            <input 
              type="text" 
              className="glass-input" 
              placeholder={`เช่น linear-gradient(90deg, #000, #fff)`} 
              value={val || ''} 
              onChange={e => onChange(e.target.value)} 
            />
            {val ? <button className="tool-btn" onClick={() => onChange('')} title="ล้างสี" style={{ flexShrink: 0, height: '36px', padding: '0 10px' }}>ล้าง</button> : null}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px', background: 'rgba(255,255,255,0.4)', padding: '12px', borderRadius: '8px' }}>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>เครื่องมือ:</span>
              
              <select 
                className="glass-input" 
                style={{ width: '80px', padding: '2px 6px', height: '24px', fontSize: '0.75rem' }}
                value={gradType}
                onChange={(e) => updateGradient(e.target.value, angleOrPos, colors)}
              >
                <option value="linear">เส้นตรง</option>
                <option value="radial">วงกลม</option>
              </select>

              <div style={{ width: '1px', height: '16px', background: 'var(--color-accent-mute)', margin: '0 4px' }} />

              {gradType === 'linear' ? (
                <>
                  <input type="number" min="0" max="360" value={angleOrPos.replace(/[^0-9]/g, '') || 90} onChange={e => updateGradient('linear', e.target.value, colors)} className="glass-input" style={{ width: '60px', padding: '2px 6px', height: '24px', fontSize: '0.8rem' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>deg</span>
                </>
              ) : (
                <select 
                  className="glass-input" 
                  style={{ width: '100px', padding: '2px 6px', height: '24px', fontSize: '0.75rem' }}
                  value={angleOrPos}
                  onChange={(e) => updateGradient('radial', e.target.value, colors)}
                >
                  <option value="center">ตรงกลาง</option>
                  <option value="top">ด้านบน</option>
                  <option value="bottom">ด้านล่าง</option>
                  <option value="left">ซ้าย</option>
                  <option value="right">ขวา</option>
                  <option value="top left">ซ้ายบน</option>
                  <option value="top right">ขวาบน</option>
                  <option value="bottom left">ซ้ายล่าง</option>
                  <option value="bottom right">ขวาล่าง</option>
                </select>
              )}
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginTop: '4px' }}>
              {colors.map((color: string, index: number) => (
                <div key={`${refKey}_color_${index}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fff', padding: '2px 4px', borderRadius: '6px', border: '1px solid var(--color-accent-lighter)' }}>
                  <input 
                    type="color" 
                    value={safeHex(color, '#d8b4fe')} 
                    onChange={e => handleColorChange(index, e.target.value)} 
                    style={{ width: '20px', height: '20px', border: 'none', cursor: 'pointer', padding: 0, background: 'transparent' }} 
                  />
                  {colors.length > 2 && (
                    <button 
                      onClick={() => handleRemoveColor(index)} 
                      style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: '0 2px' }}
                      title="ลบสีนี้"
                    >
                      ×
                    </button>
                  )}
                  {index < colors.length - 1 && <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', marginLeft: '4px' }}>→</span>}
                </div>
              ))}
              
              <button 
                onClick={handleAddColor} 
                style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', lineHeight: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                title="เพิ่มสี"
              >
                +
              </button>
            </div>

          </div>
        </div>
      );
    }

    if (field.type === 'color') {
      const fallbackCol = getFallbackColor(field);
      const pickerVal = val ? safeHex(val, '#8b5cf6') : '#ffffff'; // ว่าง = ยังไม่ได้เลือกสี

      return (
        <div key={refKey} className="field-group">
          <label className="field-label">{field.label}</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="color" style={{ width: '40px', height: '36px', border: 'none', cursor: 'pointer', borderRadius: '6px' }} value={pickerVal} onChange={e => onChange(e.target.value)} />
            <input type="text" className="glass-input" placeholder={`เช่น ${fallbackCol}`} value={val || ''} onChange={e => onChange(e.target.value)} />
            {val ? <button className="tool-btn" onClick={() => onChange('')} title="ล้างสี" style={{ flexShrink: 0, height: '36px', padding: '0 10px' }}>ล้าง</button> : null}
          </div>
        </div>
      );
    }
    
    // ระบบ รูปภาพ และ ภาพพื้นหลัง(+url) ใช้ตัวควบคุมชุดเดียวกัน
    if (isImageField(field)) {
      // ค่ารีเซ็ต = ตำแหน่ง/ซูมตามโค้ดต้นฉบับ (หาจากโค้ดหลักหรือ Blocks)
      const srcHtml = [code.htmlCode, ...(code.blocks || []).map((b: any) => b.html)]
        .find((h: any) => typeof h === 'string' && bgRegex(field.variableName).test(h));
      return (
        <ImageFieldEditor
          key={refKey}
          field={field}
          val={val}
          onChange={onChange}
          resetTo={detectImgDefaults(srcHtml || '', field.variableName)}
        />
      );
    }

    if (field.type === 'richtext' || field.type === 'roleplay') {
      const isRp = field.type === 'roleplay';
      const textVal: string = val ?? "";

      return (
        <div key={refKey} className="field-group">
          <label className="field-label">{field.label}</label>
          <div className="editor-container">
            <div className="editor-toolbar">
              <div className="tb-group">
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => insertTag(refKey, textVal, onChange, '[b]', '[/b]')} title="ตัวหนา"><b>B</b></button>
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => insertTag(refKey, textVal, onChange, '[i]', '[/i]')} title="ตัวเอียง"><i>I</i></button>
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => insertTag(refKey, textVal, onChange, '[u]', '[/u]')} title="ขีดเส้นใต้"><u>U</u></button>
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => { const url = prompt("ระบุลิงก์ (URL):", "https://"); if(url) insertTag(refKey, textVal, onChange, `[url=${url}]`, '[/url]'); }} title="แทรกลิงก์">🔗</button>
              </div>
              <div className="tb-divider"></div>
              <div className="tb-group">
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => { const url = prompt("ระบุลิงก์รูปภาพ:"); if(url) insertTag(refKey, textVal, onChange, `[img]${url}[/img]`, ''); }} title="แทรกรูปภาพ">🖼️</button>
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => { const yt = prompt("รหัสวิดีโอ YouTube (เช่น dQw4w9WgXcQ):"); if(yt) insertTag(refKey, textVal, onChange, `[yt=${yt}]`, '[/yt]'); }} title="YouTube (ปกติ)">📺</button>
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => { const yt = prompt("รหัสวิดีโอ YouTube (เล่นอัตโนมัติ):"); if(yt) insertTag(refKey, textVal, onChange, `[ytauto=${yt}]`, '[/ytauto]'); }} title="YouTube (Auto)">▶️</button>
                <button className="tool-btn" onMouseDown={e => e.preventDefault()} onClick={() => { const yt = prompt("รหัสวิดีโอ YouTube (ซ่อนกล่อง + เล่นอัตโนมัติ):"); if(yt) insertTag(refKey, textVal, onChange, `[hideyt=${yt}]`, '[/hideyt]'); }} title="YouTube (ซ่อนกล่อง)">🎵</button>
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
                  <input type="color" id={`bg_${refKey}`} defaultValue="#fef08a" className="cp-input" title="สีไฮไลต์" />
                  <button className="tool-btn cp-btn" onMouseDown={e => e.preventDefault()} onClick={() => { const bg = (document.getElementById(`bg_${refKey}`) as HTMLInputElement).value; insertTag(refKey, textVal, onChange, `[bg=${bg}]`, '[/bg]'); }}>🖍️</button>
                </div>
                <div className="color-picker-group">
                  <input type="color" id={`color_${refKey}`} defaultValue="#4c1d95" className="cp-input" title="สีข้อความ" />
                  <button className="tool-btn cp-btn" onMouseDown={e => e.preventDefault()} onClick={() => { const color = (document.getElementById(`color_${refKey}`) as HTMLInputElement).value; insertTag(refKey, textVal, onChange, `[color=${color}]`, '[/color]'); }}>🎨</button>
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
            <textarea ref={el => { textareaRefs.current[refKey] = el; }} className="editor-textarea custom-scrollbar" placeholder={`พิมพ์${field.label}ที่นี่...`} value={textVal} onChange={e => { onChange(e.target.value); autoResize(e.target); }} onSelect={() => updateSelection(refKey)} onKeyUp={() => updateSelection(refKey)} onMouseUp={() => updateSelection(refKey)} />
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

  const isFullLocked = code.isLocked && !code.isCommission && !isUnlocked;

  return (
    <div className="code-detail-wrapper" style={themeVars}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;600;700&display=swap');
        
        /* ล็อก 100vh สำหรับ Desktop (No Scroll บนหน้าหลัก) */
        body { overflow: hidden !important; margin: 0; padding: 0; }
        
        .code-detail-wrapper { 
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          margin: 0; padding: 20px 2vw; 
          font-family: 'Google Sans', sans-serif; 
          color: var(--color-text-main); 
          background: radial-gradient(circle at 15% 20%, var(--bg-grad-1) 0%, transparent 50%), radial-gradient(circle at 85% 80%, var(--bg-grad-2) 0%, transparent 50%), linear-gradient(135deg, var(--bg-grad-3) 0%, var(--bg-grad-4) 100%); 
          display: flex; flex-direction: column;
          box-sizing: border-box;
        }

        .code-detail-wrapper * { box-sizing: border-box; }
        button, input, textarea, select { font-family: 'Google Sans', sans-serif !important; }
        
        .wide-w { 
          max-width: 1600px; margin: 0 auto; width: 100%; 
          flex: 1; display: flex; flex-direction: column; min-height: 0; 
        }

        .split-layout { 
          display: grid; 
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
          gap: 24px; 
          flex: 1; min-height: 0; align-items: stretch; 
        }
        
        .glass-panel-scrollable {
          min-width: 0;
          background: var(--glass-bg); 
          border: 1px solid rgba(255,255,255,0.7); 
          border-radius: 20px; 
          backdrop-filter: blur(16px); 
          box-shadow: 0 10px 40px rgba(139, 92, 246, 0.08);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .left-panel-inner { 
          flex: 1; 
          overflow-y: auto; 
          padding: 24px;
          display: flex; 
          flex-direction: column; 
          gap: 20px; 
        }

        .left-panel-content {
          padding-right: 8px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .right-panel { min-width: 0; overflow: hidden; height: 100%; display: flex; flex-direction: column; gap: 16px; min-height: 0; }

        .display-area { 
          background: #131313; border-radius: 12px; border: 1px solid var(--glass-border); 
          display: flex; flex-direction: column; flex: 1; min-height: 0; min-width: 0; overflow: hidden; position: relative;
        }
        
        .code-container { 
          padding: 24px; background: #131313; color: #e2e8f0; font-family: monospace !important; 
          font-size: 0.95rem; line-height: 1.6; margin: 0; flex: 1; min-height: 0; 
          overflow-y: auto; overflow-x: hidden; white-space: pre-wrap; word-break: break-all; 
        }

        .glass-panel { background: var(--glass-bg); border: 1px solid rgba(255,255,255,0.7); border-radius: 20px; padding: 24px; backdrop-filter: blur(16px); box-shadow: 0 10px 40px rgba(139, 92, 246, 0.08); }
        .back-btn { display: inline-flex; align-items: center; text-decoration: none; color: var(--color-text-main); font-weight: 600; background: rgba(255,255,255,0.45); border: 1px solid var(--glass-border); padding: 8px 16px; border-radius: 12px; backdrop-filter: blur(8px); transition: 0.2s;}
        .back-btn:hover { background: rgba(255,255,255,0.8); transform: translateX(-4px); }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.5); }

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

        .m-toggle-btn { flex: 1; background: transparent; border: none; padding: 6px 10px; border-radius: 8px; font-weight: 700; color: var(--color-secondary); cursor: pointer; font-size: 0.9rem; transition: 0.2s; white-space: nowrap; }
        .m-toggle-btn.active { background: #fff; color: var(--color-text-main); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

        .controls-row-right { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
        .view-toggles { display: flex; background: rgba(255,255,255,0.4); border-radius: 10px; padding: 2px; border: 1px solid var(--glass-border); margin-bottom: 8px; }
        
        .toggle-btn { background: transparent; border: none; padding: 4px 10px; border-radius: 8px; font-weight: 600; color: var(--color-secondary); cursor: pointer; font-size: 0.75rem; }
        .toggle-btn.active { background: #fff; color: var(--color-text-main); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

        .btn-copy { background: var(--glass-input); border: 1px solid var(--glass-border); padding: 4px 12px; border-radius: 10px; font-weight: 700; font-size: 0.75rem; color: var(--color-text-main); cursor: pointer; margin-left: auto; margin-bottom: 8px; white-space: nowrap; transition: 0.2s; }
        .btn-copy:hover { transform: scale(1.05); }

        .block-card { background: rgba(255,255,255,0.7); border: 2px dashed var(--color-accent-light); border-radius: 12px; padding: 16px; margin-bottom: 16px; position: relative; transition: 0.2s; }
        .block-card:hover { border-color: var(--color-accent); background: rgba(255,255,255,0.9); }
        .block-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(216,180,254,0.4); padding-bottom: 8px; }
        .block-title { font-weight: 700; color: var(--color-secondary); font-size: 1.05rem; display: flex; align-items: center; gap: 8px; }
        .block-actions { display: flex; gap: 6px; }
        .add-block-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; padding-top: 16px; border-top: 2px solid rgba(216,180,254,0.4); }
        .btn-add-block { background: var(--color-accent); color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 6px; }
        .btn-add-block:hover { background: #9333ea; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4); }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.4); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; z-index: 999; }
        .modal-content { background: var(--glass-bg); padding: 40px; border-radius: 24px; border: 1px solid var(--glass-border); box-shadow: 0 20px 40px rgba(0,0,0,0.2); text-align: center; max-width: 400px; width: 90%; position: relative; }
        .btn-close-modal { position: absolute; top: 16px; right: 16px; background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--color-primary); }

        /* ตัวปรับรูปภาพแบบกะทัดรัด */
        .img-ed { background: rgba(255,255,255,0.4); padding: 10px; border-radius: 10px; border: 1px dashed var(--color-accent-light); display: flex; flex-direction: column; gap: 6px; }
        .img-row { display: flex; align-items: center; gap: 6px; min-width: 0; }
        .img-grid3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
        .img-grid2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px 10px; }
        .img-cap { display: flex; flex-direction: column; gap: 2px; font-size: 0.68rem; font-weight: 700; color: var(--color-primary); min-width: 0; }
        .img-lbl { font-size: 0.7rem; font-weight: 700; color: var(--color-primary); min-width: 24px; flex-shrink: 0; }
        .img-unit { font-size: 0.7rem; color: var(--color-secondary); width: 16px; flex-shrink: 0; }
        .img-mini { height: 26px; padding: 0 6px; font-size: 0.78rem; border-radius: 6px; border: 1px solid var(--color-accent-light); background: var(--glass-input); color: var(--color-text-main); outline: none; min-width: 0; width: 100%; }
        .img-mini:focus { border-color: var(--color-accent); }
        .img-num { width: 54px; flex-shrink: 0; padding: 0 4px; }
        .img-range { flex: 1; min-width: 0; height: 16px; margin: 0; accent-color: var(--color-accent); }
        .img-badge { margin-left: 6px; font-size: 0.6rem; background: var(--color-accent-mute); color: #fff; padding: 1px 5px; border-radius: 4px; font-weight: 600; vertical-align: middle; }
        .img-reset { height: 24px; padding: 0 8px; font-size: 0.7rem; flex-shrink: 0; }
        .img-chip { padding: 0 7px; height: 20px; font-size: 0.68rem; min-width: 0; }
        .img-thumb { width: 72px; height: 44px; flex-shrink: 0; border-radius: 6px; border: 1px solid var(--color-accent-light); background-color: #e5e7eb; }
        .img-code { flex: 1; min-width: 0; font-size: 0.68rem; line-height: 1.35; color: var(--color-secondary); word-break: break-all; }
        .pos-pad { display: grid; grid-template-columns: repeat(3, 18px); grid-template-rows: repeat(3, 18px); gap: 2px; flex-shrink: 0; }
        .pos-cell { border: 1px solid var(--color-accent-light); background: #fff; border-radius: 4px; cursor: pointer; padding: 0; transition: 0.1s; }
        .pos-cell:hover { background: var(--color-accent-lighter); }
        .pos-cell.on { background: var(--color-accent); border-color: var(--color-accent); }

        /* ยกเว้นให้มือถือ Scroll ได้ปกติ */
        @media (max-width: 1024px) {
          body { overflow: auto !important; }
          .code-detail-wrapper { position: static; height: auto; min-height: 100vh; overflow: visible !important; }
          .wide-w { height: auto; display: block; }
          .split-layout { grid-template-columns: 1fr; display: block; }
          .glass-panel-scrollable { height: auto; margin-bottom: 24px; display: block; overflow: visible; }
          .left-panel-inner { overflow-y: visible; padding: 24px; }
          .right-panel { height: auto; }
          .display-area { min-height: 500px; height: 60vh; }
        }
      `}} />

      {showUnlockModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="btn-close-modal" onClick={() => setShowUnlockModal(false)}>✕</button>
            <h2 style={{ marginTop: 0, color: 'var(--color-primary)' }}>🔒 โค้ดจำกัดสิทธิ์การใช้งาน</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary)', marginBottom: '20px' }}>
              ต้องใส่รหัสผ่านเพื่อคัดลอกหรือปรับแต่ง
            </p>
            <form onSubmit={handleUnlockSubmit}>
              <input type="password" className="glass-input" style={{ textAlign: 'center', marginBottom: '16px' }} placeholder="ใส่รหัสผ่านที่นี่..." value={passwordInput} onChange={e => setPasswordInput(e.target.value)} autoFocus />
              {passwordError && <div style={{ color: 'var(--danger)', marginBottom: '10px', fontSize: '0.85rem' }}>รหัสผ่านไม่ถูกต้อง</div>}
              <button type="submit" className="tool-btn" style={{ padding: '10px 24px', margin: '0 auto', width: '100%', background: 'var(--color-primary)', color: '#fff' }}>ปลดล็อกเลย</button>
            </form>
          </div>
        </div>
      )}

      <div className="wide-w">
        
        {code && !isFullLocked && (
          <div className="glass-panel" style={{ padding: '16px 24px', borderRadius: '16px', marginBottom: '20px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
              <Link className="back-btn" href="/codes" style={{ margin: 0, padding: '6px 12px', fontSize: '0.85rem' }}>← กลับ</Link>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h1 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text-main)' }}>{code.name}</h1>
                  <span className="tag-type" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>{code.codeType}</span>
                  {code.eventTags?.map((tag: string) => <span key={`event_${tag}`} style={{ background: '#f59e0b', color: '#fff', padding: '2px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold' }}>🎯 {tag}</span>)}
                  {code.activityTags?.map((tag: string) => <span key={`tag_${tag}`} style={{ background: 'rgba(216, 180, 254, 0.4)', color: '#6b21a8', padding: '2px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold' }}>🏷️ {tag}</span>)}
                  {code.isCommission && <span style={{ fontSize: '0.7rem', background: '#fef08a', color: '#854d0e', padding: '2px 8px', borderRadius: '8px', fontWeight: 'bold' }}>💎 Private</span>}
                </div>
              </div>
            </div>
            
            {code.description && (
              <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--color-secondary)', background: 'rgba(255,255,255,0.5)', padding: '8px 14px', borderRadius: '8px', borderLeft: '4px solid var(--color-accent)', lineHeight: '1.5' }}>
                {code.description}
              </div>
            )}
          </div>
        )}

        {isFullLocked ? (
          <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '60px' }}>
            <Link className="back-btn" href="/codes" style={{ position: 'absolute', top: '20px', left: '20px' }}>← กลับ</Link>
            <h2>🔒 โค้ดนี้ถูกล็อกเป็นส่วนตัว</h2>
            <form onSubmit={handleUnlockSubmit} style={{ marginTop: '20px' }}>
              <input type="password" className="glass-input" style={{ maxWidth: '300px', textAlign: 'center', marginBottom: '16px' }} placeholder="ใส่รหัสผ่าน..." value={passwordInput} onChange={e => setPasswordInput(e.target.value)} autoFocus />
              {passwordError && <div style={{ color: 'var(--danger)', marginBottom: '10px', fontSize: '0.85rem' }}>รหัสผ่านไม่ถูกต้อง</div>}
              <div><button type="submit" className="tool-btn" style={{ padding: '10px 24px', margin: '0 auto' }}>ปลดล็อก</button></div>
            </form>
          </div>
        ) : (
          <div className="split-layout">
            
            {/* ================= กล่องซ้าย ================= */}
            <div className="glass-panel-scrollable">
              <div className="left-panel-inner custom-scrollbar">
                <div className="left-panel-content">
                  
                  <div style={{ display: 'flex', background: 'rgba(255,255,255,0.4)', borderRadius: '10px', padding: '2px', border: '1px solid var(--glass-border)', marginBottom: '8px', flexShrink: 0 }}>
                    <button className={`m-toggle-btn ${editMode === 'original' ? 'active' : ''}`} onClick={() => handleModeSwitch('original', viewMode)} style={{ fontSize: '0.8rem', padding: '6px' }}>👀 ดูตัวอย่าง</button>
                    <button className={`m-toggle-btn ${editMode === 'customize' ? 'active' : ''}`} onClick={() => handleModeSwitch('customize', viewMode)} style={{ fontSize: '0.8rem', padding: '6px' }}>{code.isLocked && !isUnlocked ? "🔒 ปรับแต่ง" : "✍️ ปรับแต่ง"}</button>
                  </div>

                  {editMode === 'customize' && isUnlocked && (
                    <div className="draft-row">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)' }}>💾 ระบบ Draft & Auto-save</span>
                        <button className="tool-btn" onClick={() => {
                          if(confirm("ล้างข้อมูลที่พิมพ์ค้างไว้ทั้งหมดและกลับไปเริ่มใหม่?")) {
                             localStorage.removeItem(`code_autosave_${codeId}`);
                             initFieldValues(code, true);
                          }
                        }} style={{ padding: '2px 8px', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'var(--danger-border)' }}>
                          🔄 เริ่มใหม่
                        </button>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input type="text" className="glass-input" style={{ padding: '6px 10px', fontSize: '0.9rem' }} placeholder="ตั้งชื่อดราฟต์เพื่อเซฟถาวร..." value={draftName} onChange={e => setDraftName(e.target.value)} />
                        <button className="tool-btn" onClick={handleSaveDraft} style={{ minWidth: '70px', padding: '0 12px' }}>บันทึก</button>
                      </div>
                      {drafts.length > 0 && (
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginTop: '4px' }}>
                          <select className="glass-input tb-select" style={{ flex: 1, minWidth: '150px', height: '32px', padding: '0 10px', fontSize: '0.9rem' }} value={selectedDraftIndex} onChange={e => setSelectedDraftIndex(Number(e.target.value))}>
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

                      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '12px', padding: '16px' }}>
                          <h4 style={{ margin: '0 0 8px 0', color: '#b91c1c', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>⚠️</span> Terms of Use
                          </h4>
                          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.8rem', color: '#7f1d1d', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <li>สามารถแก้ไขรายละเอียดยิบย่อยที่นอกเหนือจากที่กำหนดเอาไว้ เช่น แก้ไขขนาดฟอนต์ แก้ไขฟอนต์เนื้อความ ปรับแต่งระยะห่าง แต่ไม่อนุญาตให้คัดลอก ดัดแปลง แอบอ้างทุกกรณี</li>
                            <li>ไม่อนุญาตให้ลบเครดิตที่ติดอยู่กับโค้ดทุกกรณี</li>
                            <li>ใช้งานได้เฉพาะบนเว็บไซต์ <a href="https://roleplayth.com/" target="_blank" style={{ color: '#871f1f', fontWeight: 'bold', textDecoration: 'underline' }}>RoleplayTH</a> เท่านั้น</li>
                          </ul>
                        </div>

                        <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: '12px', padding: '16px' }}>
                          <h4 style={{ margin: '0 0 8px 0', color: '#854d0e', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>💡</span> คำแนะนำ
                          </h4>
                          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.8rem', color: '#713f12', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <li>โค้ดจะแสดงผลได้ดีที่สุดบนหน้าจอ Desktop (PC/Laptop) แต่จะไม่แตกหรือแหกหากใช้บนหน้าจออื่น ๆ</li>
                            <li>preview ใน editor นี้อาจมีความคลาดเคลื่อนของสเกลหรือตำแหน่งอยู่บ้าง หากนำไปใช้บนเว็บไซต์จะแสดงผลปกติ</li>
                          </ul>
                        </div>

                        <div style={{ background: 'rgba(216, 180, 254, 0.2)', border: '1px solid var(--color-accent-light)', borderRadius: '12px', padding: '16px' }}>
                          <h4 style={{ margin: '0 0 8px 0', color: 'var(--color-primary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>💬</span> พบปัญหาการใช้งาน?
                          </h4>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-main)', lineHeight: '1.6' }}>
                            หากพบปัญหาโค้ดพังหรือมีข้อสงสัย สามารถติดต่อได้ที่ <a href="https://discord.com/channels/848447153604919296/1138853513808580689" target="_blank" style={{ color: '#6b21a8', fontWeight: 'bold', textDecoration: 'underline' }}>Discord</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {editMode === 'customize' && isUnlocked && (
                    <div className="customizer-box">
                      <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.1rem' }}>✨ ปรับแต่งฟิลด์หลัก</h3>
                      {code.customFields && code.customFields.map((field: any, index: number) => 
                        renderFieldUI(field, fieldValues[field.variableName], (newVal) => setFieldValues(prev => ({ ...prev, [field.variableName]: newVal })), `cf_${index}`, fieldValues, code.customFields)
                      )}

                      {(code.blocks?.length > 0 || activeBlocks.length > 0) && (
                        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px dashed var(--color-accent-light)' }}>
                          <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-primary)', fontSize: '1.1rem' }}>🧱 เพิ่มส่วนเสริม (Blocks)</h3>
                          {activeBlocks.map((block, index) => {
                            const blockDef = code.blocks?.find((b: any) => b.id === block.blockId);
                            return (
                              <div key={block.instanceId} className="block-card">
                                <div className="block-header">
                                  <div className="block-title"><span style={{ background: 'var(--color-accent-light)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>#{index + 1}</span>{blockDef?.name || "ส่วนเสริม"}</div>
                                  <div className="block-actions">
                                    <button className="tool-btn" onClick={() => moveBlock(index, 'up')} disabled={index === 0} title="เลื่อนขึ้น">⬆️</button>
                                    <button className="tool-btn" onClick={() => moveBlock(index, 'down')} disabled={index === activeBlocks.length - 1} title="เลื่อนลง">⬇️</button>
                                    <button className="tool-btn" onClick={() => removeBlock(block.instanceId)} style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }} title="ลบส่วนนี้">🗑️</button>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                  {block.fields && Array.isArray(block.fields) && block.fields.map((field: any, fIndex: number) => renderFieldUI(field, block.values[field.variableName], (newVal) => updateBlockValue(block.instanceId, field.variableName, newVal), `${block.instanceId}_f_${fIndex}`, block.values, block.fields))}
                                </div>
                              </div>
                            )
                          })}
                          {code.blocks && code.blocks.length > 0 && (
                            <div className="add-block-row">
                              {code.blocks.map((blockDef: any) => (
                                <button key={blockDef.id} className="btn-add-block" onClick={() => addBlock(blockDef)}><span>➕ เพิ่ม {blockDef.name}</span></button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ================= กล่องขวา ================= */}
            <div className="glass-panel right-panel">
              <div className="controls-row-right">
                <div className="view-toggles">
                  <button className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`} onClick={() => handleModeSwitch(editMode, 'preview')}>✨ Live Preview</button>
                  {editMode === 'customize' && (
                    <button className={`toggle-btn ${viewMode === 'code' ? 'active' : ''}`} onClick={() => handleModeSwitch(editMode, 'code')}>
                      💻 HTML Code
                    </button>
                  )}
                </div>
                {editMode === 'customize' && (
                  <button className="btn-copy" onClick={handleCopy}>
                    {copied ? "✅ Copied!" : "📋 Copy"}
                  </button>
                )}
              </div>

              <div className="display-area">
                
                {viewMode === 'preview' ? (
                  <ScaledPreview html={previewHtml} />
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