import { memo, useState } from 'react';
import { createPortal } from 'react-dom';
import './Widgets.css';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, TrendingUp, Megaphone, Clock, AlertCircle, X } from 'lucide-react';
import AttendancePopup from './AttendancePopup';

import { useStudentSession } from '../../data/studentStore';

function KPICards() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const student = useStudentSession();
  
  // Dynamic value logic
  const theoryAtt = student?.attendance?.theory ?? 12.9;
  const pendingAssignments = student?.assignments?.pending ?? 0;
  const totalAssignments = student?.assignments?.total ?? 5;
  const activeNotices = student?.announcements?.length ?? 4;
  const daysSinceLogin = student?.lastLoginDays ?? 0;

  // Progress logic
  const attProgress = theoryAtt / 100;
  const assignmentProgress = Math.min(1, Math.max(0, (totalAssignments - pendingAssignments) / totalAssignments));
  const noticeProgress = Math.min(1, activeNotices / 10);
  const loginProgress = Math.max(0, 1 - (daysSinceLogin / 30));

  // Shared color logic: Green (Good), Orange (Moderate), Red (Low/Bad)
  const getGradient = (type) => {
    switch (type) {
      case 'attendance':
        return theoryAtt >= 75 ? 'linear-gradient(135deg, #10b981, #06b6d4)' :
               theoryAtt >= 50 ? 'linear-gradient(135deg, #f59e0b, #ef4444)' :
                                 'linear-gradient(135deg, #ef4444, #be123c)';
      case 'assignments':
        return assignmentProgress >= 0.8 ? 'linear-gradient(135deg, #10b981, #06b6d4)' :
               assignmentProgress >= 0.4 ? 'linear-gradient(135deg, #f59e0b, #ef4444)' :
                                           'linear-gradient(135deg, #ef4444, #be123c)';
      case 'announcements':
        // For notices: 0-2 (Green), 3-5 (Orange), >5 (Red)
        return activeNotices <= 2 ? 'linear-gradient(135deg, #10b981, #06b6d4)' :
               activeNotices <= 5 ? 'linear-gradient(135deg, #f59e0b, #ef4444)' :
                                    'linear-gradient(135deg, #ef4444, #be123c)';
      case 'login':
        return daysSinceLogin <= 1 ? 'linear-gradient(135deg, #10b981, #06b6d4)' :
               daysSinceLogin <= 7 ? 'linear-gradient(135deg, #f59e0b, #ef4444)' :
                                     'linear-gradient(135deg, #ef4444, #be123c)';
      default:
        return 'linear-gradient(135deg, #6366f1, #8b5cf6)';
    }
  };

  const kpis = [
    {
      label: 'Attendance',
      value: `${theoryAtt}%`,
      subtext: `Overall Theory Classes`,
      icon: BookOpen,
      gradient: getGradient('attendance'),
      alert: theoryAtt < 75,
      progress: attProgress,
    },
    {
      label: 'Assignments',
      value: pendingAssignments.toString(),
      subtext: pendingAssignments === 0 ? 'No pending assignments' : `${pendingAssignments} pending assignments`,
      icon: TrendingUp,
      gradient: getGradient('assignments'),
      alert: assignmentProgress < 0.4,
      progress: assignmentProgress,
    },
    {
      label: 'Announcements',
      value: activeNotices.toString(),
      subtext: 'Active notices this month',
      icon: Megaphone,
      gradient: getGradient('announcements'),
      alert: activeNotices > 5,
      progress: noticeProgress,
    },
    {
      label: 'Last Login',
      value: daysSinceLogin === 0 ? 'Just Now' : `${daysSinceLogin} days ago`,
      subtext: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      icon: Clock,
      gradient: getGradient('login'),
      alert: daysSinceLogin > 7,
      progress: loginProgress,
    },
  ];

  return (
    <>
      <div className="kpi-grid">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              className="kpi-card"
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={kpi.label === 'Attendance' ? () => setIsModalOpen(true) : undefined}
              style={{ cursor: kpi.label === 'Attendance' ? 'pointer' : 'default' }}
            >
              <div className="kpi-top">
                <div className="kpi-icon-wrap" style={{ background: kpi.gradient }}>
                  <Icon size={22} color="white" />
                </div>
                {kpi.alert && (
                  <div className="kpi-alert">
                    <AlertCircle size={14} />
                    <span>Low</span>
                  </div>
                )}
              </div>
              <div className="kpi-value">{kpi.value}</div>
              <div className="kpi-label">{kpi.label}</div>
              <div className="kpi-sub">{kpi.subtext}</div>
              <div className="kpi-bar-wrap">
                <motion.div
                  className="kpi-bar"
                  style={{ background: kpi.gradient }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: kpi.progress }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div 
              className="modal-overlay" 
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <motion.div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: '16px',
                  width: '90%',
                  maxWidth: '600px',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  position: 'relative',
                  padding: '20px'
                }}
              >
                <div className="modal-header">
                  <h2><BookOpen size={20} color="var(--brand-navy)" /> Subject-wise Attendance</h2>
                  <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                    <X size={20} />
                  </button>
                </div>
                <AttendancePopup />
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

export default memo(KPICards);
