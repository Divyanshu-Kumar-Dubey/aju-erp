import { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Star, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const AcademicMenu = () => {
  return (
    <div className="submenu-container">
      <div className="submenu-item group">
        <span>Student Related</span>
        <ChevronRight size={16} />
        <div className="nested-submenu">
          <Link to="/student-information">Student Information <Star size={14} /></Link>
          <a href="#">Student Complete Detail <Star size={14} /></a>
          <a href="#">No Dues Form Generation <Star size={14} /></a>
          <a href="#">Online Payment <Star size={14} /></a>
          <a href="#">Apply For No Dues <Star size={14} /></a>
          <a href="#">Print Fees Receipt <Star size={14} /></a>
        </div>
      </div>
    </div>
  );
};

const ExaminationMenu = () => {
  return (
    <div className="submenu-container">
      <div className="submenu-item group">
        <span>Student Related</span>
        <ChevronRight size={16} />
        <div className="nested-submenu">
          <a href="#">Regular Exam Registration <Star size={14} /></a>
          <a href="#">BackLog Exam Registration <Star size={14} /></a>
          <a href="#">Student Admit Card/Hall Ticket <Star size={14} /></a>
        </div>
      </div>
    </div>
  );
};

const ELearningMenu = () => {
  return (
    <div className="submenu-container">
      <div className="submenu-item group">
        <span>Transactions</span>
        <ChevronRight size={16} />
        <div className="nested-submenu">
          <a href="#">Select Course <Star size={14} /></a>
        </div>
      </div>
      <div className="submenu-item group">
        <span>View</span>
        <ChevronRight size={16} />
        <div className="nested-submenu">
          <a href="#">View Student Announcement <Star size={14} /></a>
          <a href="#">Access e-Library <Star size={14} /></a>
          <a href="#">View Syllabus <Star size={14} /></a>
          <a href="#">View Lecture Notes <Star size={14} /></a>
          <a href="#">View Student Test <Star size={14} /></a>
          <a href="#">View Student Assignment <Star size={14} /></a>
        </div>
      </div>
    </div>
  );
};

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="logo-circle">JGI</div>
        <div className="logo-text">
          <span className="logo-title">ARKA JAIN</span>
          <span className="logo-subtitle">University</span>
          <span className="logo-location">Jharkhand</span>
        </div>
      </div>
      
      <div className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </div>
      
      <ul className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <li 
          onMouseEnter={() => setActiveMenu('academic')}
          onMouseLeave={() => setActiveMenu(null)}
          className={activeMenu === 'academic' ? 'active-nav' : ''}
        >
          ACADEMIC <ChevronDown size={14} className="dropdown-icon" />
          {activeMenu === 'academic' && <AcademicMenu />}
        </li>
        <li 
          onMouseEnter={() => setActiveMenu('examination')}
          onMouseLeave={() => setActiveMenu(null)}
          className={activeMenu === 'examination' ? 'active-nav' : ''}
        >
          EXAMINATION <ChevronDown size={14} className="dropdown-icon" />
          {activeMenu === 'examination' && <ExaminationMenu />}
        </li>
        <li 
          onMouseEnter={() => setActiveMenu('elearning')}
          onMouseLeave={() => setActiveMenu(null)}
          className={activeMenu === 'elearning' ? 'active-nav' : ''}
        >
          E- LEARNING <ChevronDown size={14} className="dropdown-icon" />
          {activeMenu === 'elearning' && <ELearningMenu />}
        </li>
      </ul>

      <div className="navbar-actions">
        <a href="#" className="library-link">Library</a>
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Search" />
        </div>
        <div className="profile-img">
          <img src="https://i.pravatar.cc/150?u=arka" alt="Profile" />
        </div>
      </div>
    </nav>
  );
}
