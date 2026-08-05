"use client";

import React from 'react';

export default function Loading() {
  return (
    <div className="cute-loading-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@500;700&display=swap');
        
        .cute-loading-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 15% 20%, #e9d5ff 0%, transparent 50%), 
                      radial-gradient(circle at 85% 80%, #bae6fd 0%, transparent 50%), 
                      linear-gradient(135deg, #f3e8ff 0%, #e0f2fe 100%);
          font-family: 'Google Sans', sans-serif;
          overflow: hidden;
          z-index: 9999;
        }

        /* กล่องข้อความตรงกลาง */
        .loading-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255, 255, 255, 0.6);
          padding: 40px 60px;
          border-radius: 30px;
          border: 2px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 20px 50px rgba(168, 85, 247, 0.15);
          backdrop-filter: blur(12px);
          animation: floatBox 3s ease-in-out infinite;
        }

        .loading-text {
          font-size: 28px;
          font-weight: 700;
          color: #6b21a8;
          margin-top: 16px;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* แอนิเมชันของข้อความและไอคอนหมุนๆ */
        .spinner {
          font-size: 40px;
          animation: spinStar 2s linear infinite;
          display: inline-block;
        }

        .dots::after {
          content: '';
          animation: loadingDots 1.5s infinite steps(4, end);
        }

        /* แอนิเมชันลอยไปมาของกล่องตรงกลาง */
        @keyframes floatBox {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes spinStar {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes loadingDots {
          0% { content: ''; }
          25% { content: '.'; }
          50% { content: '..'; }
          75% { content: '...'; }
        }

        /* =========================================
           ✨ อิโมจิลอยละล่อง (Floating Emojis)
           ========================================= */
        .floating-emojis {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .emoji {
          position: absolute;
          bottom: -100px;
          animation: floatUp ease-in infinite;
          opacity: 0;
        }

        /* กำหนดขนาด ตำแหน่ง และความเร็วให้อิโมจิแต่ละตัวแบบสุ่มๆ */
        .emoji:nth-child(1) { left: 10%; font-size: 30px; animation-duration: 6s; animation-delay: 0s; }
        .emoji:nth-child(2) { left: 25%; font-size: 45px; animation-duration: 8s; animation-delay: 2s; }
        .emoji:nth-child(3) { left: 40%; font-size: 25px; animation-duration: 5s; animation-delay: 1s; }
        .emoji:nth-child(4) { left: 55%; font-size: 50px; animation-duration: 7s; animation-delay: 3s; }
        .emoji:nth-child(5) { left: 70%; font-size: 35px; animation-duration: 6.5s; animation-delay: 0.5s; }
        .emoji:nth-child(6) { left: 85%; font-size: 40px; animation-duration: 9s; animation-delay: 2.5s; }
        .emoji:nth-child(7) { left: 5%; font-size: 20px; animation-duration: 7s; animation-delay: 4s; }
        .emoji:nth-child(8) { left: 95%; font-size: 28px; animation-duration: 6s; animation-delay: 1.5s; }

        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.8) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-120vh) scale(1.2) rotate(360deg);
            opacity: 0;
          }
        }
      `}} />

      {/* Layer 1: อิโมจิลอยเป็น Background */}
      <div className="floating-emojis">
        <div className="emoji">🌸</div>
        <div className="emoji">✨</div>
        <div className="emoji">☁️</div>
        <div className="emoji">💖</div>
        <div className="emoji">🎀</div>
        <div className="emoji">🪄</div>
        <div className="emoji">🫧</div>
        <div className="emoji">🦋</div>
      </div>

      {/* Layer 2: กล่องแจ้งสถานะโหลด */}
      <div className="loading-content">
        <div className="spinner">✨</div>
        <div className="loading-text">
          Loading<span className="dots"></span>
        </div>
      </div>
    </div>
  );
}