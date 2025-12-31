import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Home } from './pages/Home';
import { ChecklistDetail } from './pages/ChecklistDetail';
import { History } from './pages/History';
import { Templates } from './pages/Templates';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      {/* ヘッダー */}
      <header className="header">
        <h1>
          <span className="header-icon">🏕️</span>
          Camp Checklist
        </h1>
      </header>

      {/* メインコンテンツ */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checklist/:id" element={<ChecklistDetail />} />
        <Route path="/history" element={<History />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>

      {/* ボトムナビゲーション */}
      <nav className="bottom-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📋</span>
          <span className="nav-label">リスト</span>
        </NavLink>
        <NavLink to="/templates" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📦</span>
          <span className="nav-label">テンプレート</span>
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📚</span>
          <span className="nav-label">履歴</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">設定</span>
        </NavLink>
      </nav>
    </BrowserRouter>
  );
}

export default App;
