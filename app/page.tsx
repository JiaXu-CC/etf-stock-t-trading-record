import { HomeClient } from "@/components/HomeClient";

export default function HomePage() {
  return (
    <div className="app-shell">
      <main className="app-container">
        <header className="app-header">
          <div className="app-title-group">
            <div className="app-title">ETF/个股 做T交易记录</div>
            <div className="app-subtitle">个人本地小工具 · 数据存于浏览器</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="pill-badge">
              <span className="pill-dot" />
              <span>仅前端 · localStorage</span>
            </div>
          </div>
        </header>

        <HomeClient />
      </main>
    </div>
  );
}

