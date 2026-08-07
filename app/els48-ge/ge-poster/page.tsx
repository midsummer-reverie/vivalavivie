"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import Link from "next/link";

const defaultPosterData = {
  bgUrl: "",
  bgX: 50,
  bgY: 50,
  bgZoom: 100,
  nickname: "NICKNAME",
  fullName: "FULL NAME",
  team: "ELS48 Team Eclipse",
  alignment: "left" as "left" | "center" | "right",
  nameStyle: "glassy" as "glassy" | "glow" | "solid",
  color1: "#ffffff",
  color2: "#0d9488",
  infoColor: "#ffffff",
  nicknameSize: 220,
  // SVG Jelly needs a small negative correction to match the normal text line-height.
  verticalJellyGap: -54,
  infoSize: 24,
};

type PosterData = typeof defaultPosterData;

const posterWidth = 1123;
const posterHeight = 1587;

const waitForImage = async (image: HTMLImageElement) => {
  if (!image.complete || image.naturalWidth === 0) {
    await new Promise<void>((resolve, reject) => {
      image.addEventListener("load", () => resolve(), { once: true });
      image.addEventListener("error", () => reject(new Error("Background image failed to load.")), { once: true });
    });
  }
  try {
    await image.decode();
  } catch {
    // decode() is not available in every browser; a complete image is sufficient.
  }
};

export default function ELS48PosterMakerV2() {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [posterData, setPosterData] = useState<PosterData>(defaultPosterData);
  const [bgSource, setBgSource] = useState("");
  const [bgLoaded, setBgLoaded] = useState(false);

  const teams = ["ELS48 Team Eclipse", "ELS48 Team Lumina", "ELS48 Team Starlight", "ELS48 Team Trainee"];

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedData = localStorage.getItem("els48-ge-poster-data");
      if (savedData) setPosterData({ ...defaultPosterData, ...JSON.parse(savedData) });
    } catch {
      localStorage.removeItem("els48-ge-poster-data");
    }
  }, []);

  useEffect(() => {
    if (isMounted) localStorage.setItem("els48-ge-poster-data", JSON.stringify(posterData));
  }, [isMounted, posterData]);

  useEffect(() => {
    if (!posterData.bgUrl.trim()) {
      setBgSource("");
      setBgLoaded(false);
      return;
    }

    const controller = new AbortController();
    setBgLoaded(false);
    setBgSource("");
    const loadBackground = async () => {
      try {
        const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(posterData.bgUrl)}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Proxy failed");
        const data = await response.json();
        if (!data.base64) throw new Error("Proxy returned no image data");
        if (!controller.signal.aborted) setBgSource(data.base64);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Background proxy error:", error);
          setBgSource(posterData.bgUrl);
        }
      }
    };
    void loadBackground();
    return () => controller.abort();
  }, [posterData.bgUrl]);

  const handleChange = <K extends keyof PosterData>(field: K, value: PosterData[K]) => {
    setPosterData((previous) => ({ ...previous, [field]: value }));
  };

  const handleReset = () => {
    if (window.confirm("ต้องการล้างข้อมูลทั้งหมดและเริ่มใหม่ใช่หรือไม่?")) {
      localStorage.removeItem("els48-ge-poster-data");
      setPosterData(defaultPosterData);
      setBgSource("");
      setBgLoaded(false);
    }
  };

  const handleExportImage = async () => {
    const poster = posterRef.current;
    if (!poster || isExporting) return;
    setIsExporting(true);
    try {
      await document.fonts.ready;
      await Promise.all(Array.from(poster.querySelectorAll("img")).map(waitForImage));
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      const dataUrl = await htmlToImage.toPng(poster, {
        quality: 1,
        pixelRatio: 1.5,
        width: posterWidth,
        height: posterHeight,
        canvasWidth: posterWidth,
        canvasHeight: posterHeight,
        backgroundColor: "#000000",
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `ELS48_Poster_${posterData.nickname || "Member"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Export error:", error);
      alert("ไม่สามารถ Export ภาพได้ กรุณารอให้รูปพื้นหลังโหลดเสร็จแล้วลองใหม่อีกครั้ง");
    } finally {
      setIsExporting(false);
    }
  };

  if (!isMounted) return null;

  const baseNickStyle: React.CSSProperties = {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    textTransform: "uppercase",
    lineHeight: posterData.alignment === "center" ? "1.1" : "0.85",
    fontSize: `${posterData.nicknameSize}px`,
    letterSpacing: posterData.alignment === "center" ? "8px" : "0px",
  };

  const JellyText = ({ text }: { text: string }) => {
    const uid = useId().replace(/:/g, "");
    const fontSize = posterData.nicknameSize;
    const letterSpacing = posterData.alignment === "center" ? 8 : 0;
    const width = Math.max(fontSize * 0.76 * Math.max(text.length, 1) + letterSpacing * Math.max(text.length - 1, 0) + 48, fontSize * 0.84);
    const height = fontSize * 1.12;
    const y = fontSize * 0.84;
    const centerX = width / 2;
    const isJelly = posterData.nameStyle === "glassy";

    if (!isJelly) {
      return (
        <span style={{ ...baseNickStyle, color: posterData.color1, textShadow: posterData.nameStyle === "glow" ? `0 0 4px ${posterData.color2}, 0 0 12px ${posterData.color2}` : undefined }}>
          {text}
        </span>
      );
    }

    return (
      <svg aria-label={text} role="img" width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", overflow: "visible", filter: "drop-shadow(0 8px 12px rgba(0,0,0,.18))" }}>
        <defs>
          <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity=".78" />
            <stop offset="24%" stopColor={posterData.color1} stopOpacity=".18" />
            <stop offset="60%" stopColor={posterData.color1} stopOpacity=".06" />
            <stop offset="100%" stopColor={posterData.color1} stopOpacity=".18" />
          </linearGradient>
          <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity=".82" />
            <stop offset="46%" stopColor={posterData.color1} stopOpacity=".68" />
            <stop offset="100%" stopColor={posterData.color1} stopOpacity=".42" />
          </linearGradient>
          <filter id={`${uid}-jelly`} x="-22%" y="-35%" width="144%" height="175%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.3" result="softEdge" />
            <feSpecularLighting in="softEdge" surfaceScale="5" specularConstant="1.15" specularExponent="18" lightingColor="#ffffff" result="specular">
              <fePointLight x="-120" y="-180" z="220" />
            </feSpecularLighting>
            <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularIn" />
            <feColorMatrix in="specularIn" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .82 0" result="highlight" />
            <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor={posterData.color1} floodOpacity=".22" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="highlight" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={`${uid}-shine`} x="-15%" y="-25%" width="130%" height="150%"><feGaussianBlur stdDeviation=".55" /></filter>
        </defs>
        <g filter={`url(#${uid}-jelly)`} paintOrder="stroke fill">
          <text x={centerX} y={y} textAnchor="middle" style={{ ...baseNickStyle, fontSize, letterSpacing, fill: `url(#${uid}-body)`, stroke: posterData.color1, strokeOpacity: .32, strokeWidth: 5.5, strokeLinejoin: "round" }}>{text}</text>
          <text x={centerX} y={y} textAnchor="middle" style={{ ...baseNickStyle, fontSize, letterSpacing, fill: "transparent", stroke: `url(#${uid}-rim)`, strokeWidth: 2.4, strokeLinejoin: "round" }}>{text}</text>
        </g>
        <text x={centerX} y={y - 2.5} textAnchor="middle" style={{ ...baseNickStyle, fontSize, letterSpacing, fill: "transparent", stroke: "rgba(255,255,255,.58)", strokeWidth: .8, strokeLinejoin: "round" }} filter={`url(#${uid}-shine)`}>{text}</text>
      </svg>
    );
  };

  const renderNameOverlay = () => {
    const infoStyle: React.CSSProperties = { fontFamily: "'Poppins', sans-serif", color: posterData.infoColor, textTransform: "uppercase" };
    if (posterData.alignment === "center") {
      return <div style={{ position: "absolute", bottom: "80px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 20 }}>
        <div style={{ ...infoStyle, fontSize: `${posterData.infoSize}px`, letterSpacing: "8px", fontWeight: 600 }}>{posterData.fullName}</div>
        <div style={{ ...infoStyle, fontSize: `${posterData.infoSize * .8}px`, letterSpacing: "6px", fontWeight: 500, marginBottom: "10px" }}>{posterData.team}</div>
        <JellyText text={posterData.nickname} />
      </div>;
    }
    const isRight = posterData.alignment === "right";
    return <div style={{ position: "absolute", top: "50%", [isRight ? "right" : "left"]: "60px", transform: "translateY(-50%)", display: "flex", flexDirection: isRight ? "row-reverse" : "row", alignItems: "center", zIndex: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {posterData.nickname.split("").map((char, index) => (
          <div key={`${char}-${index}`} style={{ marginTop: index === 0 || posterData.nameStyle !== "glassy" ? 0 : `${posterData.verticalJellyGap}px` }}>
            <JellyText text={char} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", writingMode: "vertical-rl", [isRight ? "marginRight" : "marginLeft"]: "30px" }}>
        <span style={{ ...infoStyle, fontSize: `${posterData.infoSize}px`, letterSpacing: "8px", fontWeight: 600 }}>{posterData.fullName}</span>
        <span style={{ ...infoStyle, fontSize: `${posterData.infoSize * .8}px`, letterSpacing: "6px", fontWeight: 500 }}>{posterData.team}</span>
      </div>
    </div>;
  };

  return <div className="els-page-wrapper">
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;600;700&family=Poppins:wght@400;500;600;700;800&display=swap');
      
      @keyframes elsPageFadeIn {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .els-page-wrapper{
        min-height:100vh;margin:0;padding:2vw 4vw;
        background:linear-gradient(135deg,#ccfbf1,#e0f2fe 50%,#dcfce7);
        background-attachment:fixed;overflow-x:hidden;
        animation: elsPageFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      .els-page-wrapper *{box-sizing:border-box}.els-page-wrapper,.glass-panel,button,input,select,.back-btn{font-family:'Google Sans',sans-serif!important;color:#115e59}.poster-container,.poster-container *{font-family:'Poppins',sans-serif!important}.wide-w{max-width:1700px;margin:0 auto;width:100%}.split-layout{display:grid;grid-template-columns:480px 1fr;gap:24px;align-items:start}@media(max-width:1200px){.split-layout{grid-template-columns:1fr}}.back-btn{display:inline-flex;align-items:center;margin-bottom:20px;text-decoration:none;font-weight:700;background:rgba(255,255,255,.6);border:2px solid rgba(255,255,255,.8);padding:8px 16px;border-radius:12px}.glass-panel{background:rgba(255,255,255,.65);border:1px solid rgba(255,255,255,.7);border-radius:20px;padding:24px;backdrop-filter:blur(16px);box-shadow:0 10px 40px rgba(13,148,136,.1)}.left-panel{position:sticky;top:20px;max-height:calc(100vh - 40px);overflow-y:auto;display:flex;flex-direction:column;gap:24px}.right-panel{display:flex;flex-direction:column;gap:20px;min-width:0;background:#e2e8f0;align-items:center;padding:0 20px 40px;border:1px solid #cbd5e1}.custom-scrollbar::-webkit-scrollbar{width:6px}.custom-scrollbar::-webkit-scrollbar-thumb{background:rgba(13,148,136,.4);border-radius:10px}.form-group{display:flex;flex-direction:column;gap:6px;margin-bottom:12px}.form-label{font-weight:700;color:#0d9488;font-size:.9rem}.glass-input{width:100%;padding:10px 14px;border-radius:8px;border:1px solid #5eead4;background:rgba(255,255,255,.9);outline:none;font-size:.95rem}.section-box{background:rgba(255,255,255,.6);border:1px solid #5eead4;border-radius:14px;padding:16px}.section-title{font-size:1.05rem;font-weight:700;color:#0d9488;margin:0 0 16px;border-bottom:1px solid rgba(94,234,212,.5);padding-bottom:8px}.btn-export{background:linear-gradient(135deg,#0d9488,#115e59);color:#fff!important;border:0;padding:14px;border-radius:12px;font-weight:bold;font-size:1.1rem;cursor:pointer;box-shadow:0 4px 12px rgba(13,148,136,.4)}.btn-export:disabled{opacity:.6;cursor:wait}.btn-reset{background:rgba(239,68,68,.1);color:#ef4444!important;border:1px solid rgba(239,68,68,.3);padding:8px 16px;border-radius:8px;font-weight:bold;font-size:.9rem;cursor:pointer}.preview-scale-wrapper{transform:scale(.65);transform-origin:top center;margin-bottom:-45%}@media(max-width:1400px){.preview-scale-wrapper{transform:scale(.5);margin-bottom:-65%}}input[type=range]{-webkit-appearance:none;width:100%;background:transparent}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;height:16px;width:16px;border-radius:50%;background:#0d9488;cursor:pointer;margin-top:-6px}input[type=range]::-webkit-slider-runnable-track{width:100%;height:4px;background:#99f6e4;border-radius:2px}.style-btn{flex:1;padding:8px;border:1px solid #5eead4;background:rgba(255,255,255,.6);border-radius:8px;cursor:pointer;font-weight:600;color:#0d9488;text-align:center}.style-btn.active{background:#0d9488;color:#fff!important;border-color:#0d9488}
    `}} />
    <div className="wide-w">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Link className="back-btn" href="/els48-ge">← กลับไปหน้าหลัก</Link><button className="btn-reset" onClick={handleReset}>🗑️ ล้างข้อมูลทั้งหมด</button></div>
      <div className="split-layout">
        <div className="glass-panel left-panel custom-scrollbar">
          <div className="section-box"><h3 className="section-title">🖼️ พื้นหลังโปสเตอร์</h3><div className="form-group"><label className="form-label">URL รูปภาพ</label><input type="text" className="glass-input" placeholder="https://..." value={posterData.bgUrl} onChange={(event) => handleChange("bgUrl", event.target.value)} /></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "12px" }}>{([['bgX','แกน X'],['bgY','แกน Y']] as const).map(([field,label]) => <div className="form-group" key={field}><label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}><span>{label}</span><span>{posterData[field]}%</span></label><input type="range" min="0" max="100" value={posterData[field]} onChange={(event) => handleChange(field, Number(event.target.value))} /></div>)}</div><div className="form-group" style={{ marginTop: "8px" }}><label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}><span>ซูม (Scale)</span><span>{posterData.bgZoom}%</span></label><input type="range" min="50" max="300" value={posterData.bgZoom} onChange={(event) => handleChange("bgZoom", Number(event.target.value))} /></div></div>
          <div className="section-box"><h3 className="section-title">📝 ข้อมูลเมมเบอร์</h3><div className="form-group"><label className="form-label">ชื่อเล่น (Nickname)</label><input type="text" className="glass-input" value={posterData.nickname} onChange={(event) => handleChange("nickname", event.target.value)} /></div><div className="form-group"><label className="form-label">ชื่อเต็ม (Full Name)</label><input type="text" className="glass-input" value={posterData.fullName} onChange={(event) => handleChange("fullName", event.target.value)} /></div><div className="form-group"><label className="form-label">ทีม (Team)</label><select className="glass-input" value={posterData.team} onChange={(event) => handleChange("team", event.target.value)}><option value="">-- เลือกทีม --</option>{teams.map((team) => <option key={team} value={team}>{team}</option>)}</select></div></div>
          <div className="section-box"><h3 className="section-title">🎨 จัดการสไตล์และเลย์เอาต์</h3><div className="form-group" style={{ marginBottom: "16px" }}><label className="form-label">การจัดวาง (Alignment)</label><div style={{ display: "flex", gap: "8px" }}>{([['center','กลางล่าง'],['left','แนวตั้ง (ซ้าย)'],['right','แนวตั้ง (ขวา)']] as const).map(([value,label]) => <button key={value} className={`style-btn ${posterData.alignment === value ? "active" : ""}`} onClick={() => handleChange("alignment", value)}>{label}</button>)}</div></div><div className="form-group" style={{ marginBottom: "16px" }}><label className="form-label">สไตล์ชื่อเล่น (Name Style)</label><div style={{ display: "flex", gap: "8px" }}>{([['glassy','Jelly'],['glow','เรืองแสง'],['solid','สีทึบ']] as const).map(([value,label]) => <button key={value} className={`style-btn ${posterData.nameStyle === value ? "active" : ""}`} onClick={() => handleChange("nameStyle", value)}>{label}</button>)}</div></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}><div className="form-group"><label className="form-label">สีชื่อเล่น</label><input type="color" className="glass-input" style={{ padding: "2px", height: "42px" }} value={posterData.color1} onChange={(event) => handleChange("color1", event.target.value)} /></div><div className="form-group"><label className="form-label">สีชื่อเต็ม/ทีม</label><input type="color" className="glass-input" style={{ padding: "2px", height: "42px" }} value={posterData.infoColor} onChange={(event) => handleChange("infoColor", event.target.value)} /></div>{posterData.nameStyle === "glow" && <div className="form-group" style={{ gridColumn: "1 / -1" }}><label className="form-label">สีเรืองแสง</label><input type="color" className="glass-input" style={{ padding: "2px", height: "42px" }} value={posterData.color2} onChange={(event) => handleChange("color2", event.target.value)} /></div>}</div><div className="form-group" style={{ marginTop: "16px" }}><label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}><span>ขนาดชื่อเล่น</span><span>{posterData.nicknameSize}px</span></label><input type="range" min="80" max="400" value={posterData.nicknameSize} onChange={(event) => handleChange("nicknameSize", Number(event.target.value))} /></div><div className="form-group" style={{ marginTop: "8px" }}><label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}><span>ขนาดชื่อเต็ม/ทีม</span><span>{posterData.infoSize}px</span></label><input type="range" min="14" max="50" value={posterData.infoSize} onChange={(event) => handleChange("infoSize", Number(event.target.value))} /></div></div>
          {posterData.alignment !== "center" && posterData.nameStyle === "glassy" && <div className="section-box"><h3 className="section-title">↕️ ระยะตัวอักษร Jelly แนวตั้ง</h3><div className="form-group"><label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}><span>ระยะห่างระหว่างตัวอักษร</span><span>{posterData.verticalJellyGap}px</span></label><input type="range" min="-140" max="100" value={posterData.verticalJellyGap} onChange={(event) => handleChange("verticalJellyGap", Number(event.target.value))} /></div></div>}
        </div>
        <div className="glass-panel right-panel"><div style={{ position: "sticky", top: 0, zIndex: 50, width: "100%", display: "flex", justifyContent: "center", padding: "20px 0", background: "linear-gradient(180deg,#e2e8f0 70%,transparent)" }}><button className="btn-export" disabled={isExporting || Boolean(bgSource && !bgLoaded)} onClick={handleExportImage} style={{ padding: "14px 30px", fontSize: "1.15rem" }}>{isExporting ? "กำลังสร้างไฟล์..." : "📸 บันทึกเป็นรูปภาพ (Export)"}</button></div><div className="preview-scale-wrapper"><div ref={posterRef} className="poster-container" style={{ width: `${posterWidth}px`, height: `${posterHeight}px`, backgroundColor: "#000", boxShadow: "0 10px 40px rgba(0,0,0,.5)", position: "relative", overflow: "hidden" }}>{bgSource && <img crossOrigin="anonymous" src={bgSource} alt="Background" onLoad={() => setBgLoaded(true)} onError={() => setBgLoaded(false)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${posterData.bgX}% ${posterData.bgY}%`, transform: `scale(${posterData.bgZoom / 100})`, transformOrigin: `${posterData.bgX}% ${posterData.bgY}%`, zIndex: 1 }} />}<div style={{ position: "absolute", inset: "0 0 auto", height: "80px", background: "linear-gradient(90deg,#34b1b2,#165e5f)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "28px", fontWeight: 500, letterSpacing: "6px", zIndex: 30, boxShadow: "0 4px 15px rgba(0,0,0,.2)" }}>ELS48 SENBATSU GENERAL ELECTION 2026</div>{renderNameOverlay()}<div style={{ position: "absolute", bottom: "20px", left: "30px", color: "#fff", fontSize: "14px", fontWeight: 600, opacity: .8, zIndex: 20 }}>© ELS48 Official</div></div></div></div>
      </div>
    </div>
  </div>;
}