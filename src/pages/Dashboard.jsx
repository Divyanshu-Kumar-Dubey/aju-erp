import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import BottomNav from '../components/layout/BottomNav';
import KPICards from '../components/widgets/KPICards';
import ActiveNotice from '../components/widgets/ActiveNotice';
import TimeTable from '../components/widgets/TimeTable';
import TasksPanel from '../components/widgets/TasksPanel';
import QuickAccess from '../components/widgets/QuickAccess';
import { useStudentSession } from '../data/studentStore';
import './Dashboard.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
};

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const offset = collapsed ? 72 : 260;
  
  const student = useStudentSession();
  const firstName = student?.name ? student.name.split(' ')[0] : 'Ansh';

  const today = useMemo(() => new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), []);

  return (
    <div className="dash-root">
      <Helmet>
        <title>Dashboard | AJU ERP — Arka Jain University</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <TopBar collapsed={collapsed} onMenuOpen={() => setMobileOpen(true)} />

      <motion.main
        className="dash-main"
        style={{ marginLeft: offset }}
        animate={{ marginLeft: offset }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Page Header */}
        <div className="dash-page-header">
          <div>
            <motion.h1
              className="dash-title"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Student Dashboard
            </motion.h1>
            <motion.p
              className="dash-subtitle"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Welcome back, {firstName}! Here&apos;s what&apos;s happening today.
            </motion.p>
          </div>
          <motion.div
            className="dash-date-badge"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="date-text">{today}</span>
            <span className="date-time">Recently Logged In</span>
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div className="dash-content" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants}>
            <KPICards />
          </motion.div>

          <div className="dash-grid-main">
            <motion.div variants={itemVariants} className="col-left">
              <TimeTable />
            </motion.div>
            <motion.div variants={itemVariants} className="col-right">
              <QuickAccess />
              <ActiveNotice />
              <TasksPanel />
            </motion.div>
          </div>
        </motion.div>
      </motion.main>

      <footer className="dash-footer" style={{ marginLeft: offset }}>
        Designed &amp; Developed by <span>MasterSoft ERP</span> · Copyright © 2026 Arka Jain University
      </footer>

      {/* Mobile bottom navigation bar */}
      <BottomNav onMenuOpen={() => setMobileOpen(true)} />
    </div>
  );
}
