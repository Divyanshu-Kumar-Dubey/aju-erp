
import './Widgets.css';
import { BarChart2 } from 'lucide-react';
import { useStudentSession } from '../../data/studentStore';

export default function AttendancePopup() {
  const student = useStudentSession();
  const subjects = student?.attendance?.subjects || [];
  const baseTheory = student?.attendance?.theory ?? 75;

  let rows = [];

  if (subjects.length > 0) {
    rows = subjects.map(sub => {
      const pct = sub.total > 0 ? Math.round((sub.attended / sub.total) * 100) : 0;
      return {
        subject: sub.code || 'N/A',
        name: sub.name || 'Unknown',
        lectures: sub.attended || 0,
        total: sub.total || 0,
        pct
      };
    });
  } else {
    // Fallback for existing students without the subjects array in localStorage
    rows = [
      { subject: 'CSC34198', name: 'Data Structures', lectures: Math.round(31 * Math.max(0, baseTheory - 5) / 100), total: 31, pct: Math.max(0, baseTheory - 5) },
      { subject: 'CSC35091', name: 'Operating Systems', lectures: Math.round(31 * Math.min(100, baseTheory + 2) / 100), total: 31, pct: Math.min(100, baseTheory + 2) },
      { subject: 'CSC35102', name: 'Computer Networks', lectures: Math.round(31 * baseTheory / 100), total: 31, pct: baseTheory },
      { subject: 'CSC34120', name: 'Database Systems', lectures: Math.round(31 * Math.max(0, baseTheory - 8) / 100), total: 31, pct: Math.max(0, baseTheory - 8) },
    ];
  }

  const getColor = (pct) => {
    if (pct < 30) return 'var(--accent-red)';
    if (pct < 75) return 'var(--accent-amber)';
    return 'var(--accent-green)';
  };

  return (
    <div className="widget-card">
      <div className="widget-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BarChart2 size={18} color="var(--accent-primary)" />
          <span className="widget-title">Subject-wise Attendance Details</span>
        </div>
        <span className="widget-badge">Semester 5</span>
      </div>
      <div className="widget-body-inner">
        <table className="att-table">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject</th>
              <th>Lectures</th>
              <th>Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  No subject attendance data available.
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={i}>
                  <td><span className="code-badge">{r.subject}</span></td>
                  <td>{r.name}</td>
                  <td className="lectures-cell">{r.lectures} / {r.total}</td>
                  <td>
                    <div className="pct-cell">
                      <div className="mini-bar-wrap">
                        <div className="mini-bar" style={{ width: `${r.pct}%`, background: getColor(r.pct) }} />
                      </div>
                      <span style={{ color: getColor(r.pct), fontWeight: 600 }}>{r.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
