import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Dreamscape Archive", // ชื่อเว็บที่จะขึ้นบนแท็บ
  description: "vivalavivie's space",
  // 🌟 เพิ่มส่วน icons ตรงนี้เข้าไป
  icons: {
    icon: "https://iili.io/COq7vYx.png", // ใส่ลิงก์รูปโลโก้ที่ต้องการ
    apple: "https://iili.io/COq7vYx.png", // สำหรับแสดงผลตอนแชร์หรือเซฟลงหน้าจอมือถือ
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}