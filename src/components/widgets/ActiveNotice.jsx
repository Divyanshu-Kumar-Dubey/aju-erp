
import './Widgets.css';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

const notices = [
  { month: 'FEB', day: '18', tag: 'ED Notice', color: '#6366f1', desc: 'Notice regarding Class attendance and campus discipline for all enrolled students.' },
  { month: 'FEB', day: '26', tag: 'ENG Notice', color: '#10b981', desc: 'BA-English 4th & 6th Semester students — Internal Exam begins from 17th March 2026.' },
  { month: 'MAR', day: '11', tag: 'FD Mid-Term', color: '#f59e0b', desc: 'Fashion Design — Notice Regarding Sem 4 & 6 mid-term Examination schedule.' },
  { month: 'MAR', day: '14', tag: 'JMC Notice', color: '#ec4899', desc: 'JMC notice regarding mid-term examination for sem 4 & 6. Venue updated.' },
];

export default function ActiveNotice() {
  return (
    <div className="widget-card">
      <div className="widget-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bell size={18} color="var(--accent-amber)" />
          <span className="widget-title">Active Notices</span>
        </div>
        <span className="widget-badge">{notices.length} New</span>
      </div>
      <div className="widget-body-inner notice-scroll">
        {notices.map((n, i) => (
          <motion.div
            key={i}
            className="notice-row"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ x: 4 }}
          >
            <div className="notice-date-pill" style={{ background: `${n.color}22`, borderColor: `${n.color}66`, color: n.color }}>
              <span className="pill-day">{n.day}</span>
              <span className="pill-month">{n.month}</span>
            </div>
            <div className="notice-info">
              <span className="notice-tag" style={{ color: n.color }}>{n.tag}</span>
              <p className="notice-desc">{n.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
