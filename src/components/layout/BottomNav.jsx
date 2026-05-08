import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, User, Menu, Bell } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav({ onMenuOpen }) {
  return (
    <nav className="bottom-nav">
      <NavLink
        to="/dashboard"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <div className="bottom-nav-icon"><LayoutDashboard size={22} /></div>
        <span className="bottom-nav-label">Home</span>
      </NavLink>

      <NavLink
        to="/student-information"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <div className="bottom-nav-icon"><BookOpen size={22} /></div>
        <span className="bottom-nav-label">Academic</span>
      </NavLink>

      {/* Hamburger — opens the full sidebar as a drawer */}
      <button className="bottom-nav-item" onClick={onMenuOpen}>
        <div className="bottom-nav-icon">
          <span className="bottom-nav-notif" />
          <Bell size={22} />
        </div>
        <span className="bottom-nav-label">Alerts</span>
      </button>

      <button className="bottom-nav-item" onClick={onMenuOpen}>
        <div className="bottom-nav-icon"><Menu size={22} /></div>
        <span className="bottom-nav-label">Menu</span>
      </button>

      <NavLink
        to="/profile"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <div className="bottom-nav-icon"><User size={22} /></div>
        <span className="bottom-nav-label">Profile</span>
      </NavLink>
    </nav>
  );
}
