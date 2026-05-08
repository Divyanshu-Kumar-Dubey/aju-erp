import React, { useState } from 'react';
import { User, MapPin, GraduationCap, Printer, Info, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import BottomNav from '../components/layout/BottomNav';
import PersonalInfo from '../components/student-info/PersonalInfo';
import AddressInfo from '../components/student-info/AddressInfo';
import DASAInfo from '../components/student-info/DASAInfo';
import QualificationInfo from '../components/student-info/QualificationInfo';
import OtherInfo from '../components/student-info/OtherInfo';
import PrintReport from '../components/student-info/PrintReport';
import './StudentInformation.css';

export default function StudentInformation() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const offset = collapsed ? 72 : 260;

  const tabs = [
    { id: 'personal', label: 'Personal Details', icon: <User size={16} color="#f59e0b" /> },
    { id: 'address', label: 'Address Details', icon: <MapPin size={16} color="#f59e0b" /> },
    { id: 'dasa', label: 'DASA Student Information', icon: <Info size={16} color="#f59e0b" /> },
    { id: 'qualification', label: 'Qualification Details', icon: <GraduationCap size={16} color="#f59e0b" /> },
    { id: 'other', label: 'Other Information', icon: <ClipboardList size={16} color="#f59e0b" /> },
    { id: 'print', label: 'Print', icon: <Printer size={16} color="#f59e0b" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfo />;
      case 'address':
        return <AddressInfo />;
      case 'dasa':
        return <DASAInfo />;
      case 'qualification':
        return <QualificationInfo />;
      case 'other':
        return <OtherInfo />;
      case 'print':
        return <PrintReport />;
      default:
        return <PersonalInfo />;
    }
  };

  const getActiveTabDetails = () => tabs.find(tab => tab.id === activeTab) || tabs[0];

  return (
    <div className="layout-root">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      
      <div className="main-content" style={{ marginLeft: offset }}>
        <TopBar collapsed={collapsed} onMenuOpen={() => setMobileOpen(true)} />

        <div className="dashboard-content si-page-root">
          <div className="si-container-box">
            
            <div className="si-main-header">
              <User size={22} color="#0056b3" />
              <span>STUDENT INFORMATION</span>
            </div>

            <div className="si-content-flex">
              {/* Left Vertical Menu */}
              <div className="si-sidebar">
                <div className="si-sidebar-title">
                  Click To Open Respective Information
                </div>
                <ul className="si-menu">
                  {tabs.map((tab) => (
                    <li
                      key={tab.id}
                      className={activeTab === tab.id ? 'active' : ''}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.icon} {tab.label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Form Area */}
              <div className="si-form-area">
                <div className="si-form-header">
                  <div className="sf-left">
                    <div className="sf-icon-circle">
                      {getActiveTabDetails().icon && React.cloneElement(getActiveTabDetails().icon, { size: 18, color: "#0056b3" })}
                    </div>
                    <div className="sf-title-group">
                      <h3>{getActiveTabDetails().label}</h3>
                      <p>View and manage your {getActiveTabDetails().label.toLowerCase()}</p>
                    </div>
                  </div>
                  {activeTab !== 'print' && (
                    <div className="sf-right">
                      <span className="mandatory-note">Note: * Marked fields are mandatory</span>
                    </div>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                  >
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav onMenuOpen={() => setMobileOpen(true)} />
    </div>
  );
}
