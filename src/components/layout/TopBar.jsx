import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Sun, Moon, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStudentSession } from '../../data/studentStore';
import './TopBar.css';

// All searchable items from the sidebar — keep in sync with Sidebar.jsx navItems
const ALL_PAGES = [
  { label: 'Dashboard', path: '/dashboard', category: 'Main' },
  { label: 'Student Information', path: '/student-information', category: 'Academic' },
  { label: 'Student Complete Detail', path: '/student-complete-detail', category: 'Academic' },
  { label: 'No Dues Form Generation', path: '/no-dues-form', category: 'Academic' },
  { label: 'Online Payment', path: null, category: 'Academic' },
  { label: 'Apply For No Dues', path: null, category: 'Academic' },
  { label: 'Print Fees Receipt', path: null, category: 'Academic' },
  { label: 'Regular Exam Registration', path: null, category: 'Examination' },
  { label: 'BackLog Exam Registration', path: null, category: 'Examination' },
  { label: 'Admit Card / Hall Ticket', path: null, category: 'Examination' },
  { label: 'Select Course', path: null, category: 'E-Learning' },
  { label: 'View Announcement', path: null, category: 'E-Learning' },
  { label: 'Access e-Library', path: null, category: 'E-Learning' },
  { label: 'View Syllabus', path: null, category: 'E-Learning' },
  { label: 'View Lecture Notes', path: null, category: 'E-Learning' },
  { label: 'View Student Test', path: null, category: 'E-Learning' },
  { label: 'View Assignment', path: null, category: 'E-Learning' },
  { label: 'Feedback', path: null, category: 'E-Learning' },
  { label: 'Profile', path: '/profile', category: 'Account' },
];

export default function TopBar({ collapsed }) {
  const leftOffset = collapsed ? 72 : 260;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // Dark mode — read saved preference or system preference
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('aju_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme attribute to <html> whenever isDark changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('aju_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const student = useStudentSession();
  const studentName = student?.name || 'Ansh Kumar';
  const studentAvatar = student?.image || 'https://i.pravatar.cc/150?u=arka';
  const studentRole = student ? `${student.degree || 'MCA'} · ${student.department || 'Dept. of IT'}` : 'B.Tech · Sem 5';

  // Filter results on query change
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const q = query.toLowerCase();
    const filtered = ALL_PAGES.filter(p =>
      p.label.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
    setResults(filtered);
    setIsOpen(true);
    setActiveIdx(-1);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (item) => {
    setQuery('');
    setIsOpen(false);
    if (item.path) navigate(item.path);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = results[activeIdx >= 0 ? activeIdx : 0];
      if (item) handleSelect(item);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <header className="topbar" style={{ left: leftOffset }}>
      <div className="topbar-left">
        <div className="topbar-breadcrumb">
          <span className="breadcrumb-home">Dashboard</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">Overview</span>
        </div>
      </div>
      <div className="topbar-right">
        {/* ── Search ── */}
        <div className="topbar-search-wrapper" ref={wrapperRef}>
          <div className={`topbar-search ${isOpen && results.length > 0 ? 'search-open' : ''}`}>
            <Search size={16} className="search-ico" />
            <input
              type="text"
              placeholder="Search anything..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => results.length > 0 && setIsOpen(true)}
              autoComplete="off"
            />
            {query && (
              <button className="search-clear" onClick={() => { setQuery(''); setIsOpen(false); }}>×</button>
            )}
          </div>

          {isOpen && results.length > 0 && (
            <div className="search-dropdown">
              {results.map((item, i) => (
                <button
                  key={i}
                  className={`search-result-item ${i === activeIdx ? 'active' : ''} ${!item.path ? 'disabled' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setActiveIdx(i)}
                >
                  <div className="result-info">
                    <span className="result-label">{item.label}</span>
                    <span className="result-category">{item.category}</span>
                  </div>
                  {item.path && <ArrowRight size={14} className="result-arrow" />}
                  {!item.path && <span className="result-soon">Soon</span>}
                </button>
              ))}
            </div>
          )}

          {isOpen && results.length === 0 && query.trim() && (
            <div className="search-dropdown search-empty">
              <p>No results for &quot;<strong>{query}</strong>&quot;</p>
            </div>
          )}
        </div>

        <button className="topbar-btn" title="Notifications">
          <Bell size={18} />
          <span className="notif-dot" />
        </button>
        <button className={`topbar-btn theme-btn${isDark ? ' theme-dark' : ''}`} title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'} onClick={toggleTheme}>
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <Link to="/profile" className="topbar-avatar" style={{ textDecoration: 'none' }}>
          <img src={studentAvatar} alt="user" />
          <div className="topbar-user-info">
            <span className="topbar-name">{studentName}</span>
            <span className="topbar-semester">{studentRole}</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
