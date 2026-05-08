import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, ClipboardList, GraduationCap, ChevronDown,
  ChevronRight, Star, Settings, LogOut, Menu, X,
} from 'lucide-react';
import { useStudentSession, clearStudentSession } from '../../data/studentStore';
import './Sidebar.css';

const navItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/dashboard',
  },
  {
    icon: BookOpen,
    label: 'Academic',
    children: [
      { label: 'Student Information', path: '/student-information' },
      { label: 'Student Complete Detail', path: '/student-complete-detail' },
      { label: 'Result', path: '/result' },
      { label: 'No Dues Form Generation', path: '/no-dues-form' },
      { label: 'Online Payment', path: '/online-payment' },
      { label: 'Apply For No Dues' },
      { label: 'Print Fees Receipt' },
    ],
  },
  {
    icon: ClipboardList,
    label: 'Examination',
    children: [
      { label: 'Regular Exam Registration' },
      { label: 'BackLog Exam Registration' },
      { label: 'Admit Card / Hall Ticket' },
    ],
  },
  {
    icon: GraduationCap,
    label: 'E-Learning',
    children: [
      { label: 'Select Course' },
      { label: 'View Announcement' },
      { label: 'Access e-Library' },
      { label: 'View Syllabus' },
      { label: 'View Lecture Notes' },
      { label: 'View Student Test' },
      { label: 'View Assignment' },
      { label: 'Feedback' },
    ],
  },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, onClose }) {
  const [openMenus, setOpenMenus] = useState({});
  const navigate = useNavigate();

  const student = useStudentSession();

  const toggleMenu = (label) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = () => {
    clearStudentSession();
    navigate('/login');
  };

  return (
    <>
      {/* Overlay backdrop for mobile */}
      {mobileOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <motion.aside
        className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
      {/* Header */}
      <div className="sidebar-header">
        <motion.div
          className="sidebar-logo"
          animate={{ scale: collapsed ? 0.85 : 1 }}
        >
          <div className="logo-circle">JGI</div>
          {!collapsed && (
            <motion.div
              className="logo-info"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <span className="logo-name">ARKA JAIN</span>
              <span className="logo-sub">University</span>
            </motion.div>
          )}
        </motion.div>
        <button className="collapse-btn" onClick={onClose || (() => setCollapsed(!collapsed))}>
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const hasChildren = !!item.children;
          const isOpen = openMenus[item.label];

          return (
            <div key={item.label} className="nav-group">
              {hasChildren ? (
                <button
                  className={`nav-item ${isOpen ? 'nav-item-open' : ''}`}
                  onClick={() => toggleMenu(item.label)}
                >
                  <div className="nav-icon-wrap">
                    <Icon size={20} />
                  </div>
                  {!collapsed && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      <ChevronDown size={16} className={`nav-chevron ${isOpen ? 'rotated' : ''}`} />
                    </>
                  )}
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
                >
                  <div className="nav-icon-wrap">
                    <Icon size={20} />
                  </div>
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                </NavLink>
              )}

              {hasChildren && !collapsed && (
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className="nav-submenu"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      {item.children.map((child) => (
                        <NavLink key={child.label} to={child.path || '#'} className="submenu-link">
                          <ChevronRight size={13} />
                          <span>{child.label}</span>
                          <Star size={11} className="sub-star" />
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="sidebar-footer">
        <NavLink to="/profile" className="sidebar-user" style={{ textDecoration: 'none' }}>
          <div className="avatar">
            <img src={student?.image || "https://i.pravatar.cc/150?u=arka"} alt="Student" loading="lazy" decoding="async" />
            <div className="avatar-status" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="user-info"
            >
              <span className="user-name">{student?.name || "Ansh Kumar"}</span>
              <span className="user-roll">Roll: {student?.rollNo || "CSE/2023/001"}</span>
            </motion.div>
          )}
        </NavLink>
        {!collapsed && (
          <div className="sidebar-user-actions">
            <NavLink to="/profile" className="user-action-btn" title="Settings"><Settings size={16} /></NavLink>
            <button className="user-action-btn logout-btn" title="Sign Out" onClick={handleLogout}><LogOut size={16} /></button>
          </div>
        )}
      </div>
    </motion.aside>
    </>
  );
}
