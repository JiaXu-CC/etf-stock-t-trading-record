import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ETF T 交易记录工具",
  description: "个人使用的 ETF T 交易记录小工具（本地运行，仅前端）",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

