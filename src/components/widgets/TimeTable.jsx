
import './Widgets.css';
import { Calendar } from 'lucide-react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const periods = [
  {
    time: 'P7 · 1:30–2:25',
    slots: ['CSC34198 – AKASH BHAGAT', 'CSC34198 – AKASH BHAGAT', 'CSC34199 – Arvind Pandey', 'CSC34198 – AKASH BHAGAT', 'CSC34198 – AKASH BHAGAT', '—'],
  },
  {
    time: 'P8 · 2:25–2:50',
    slots: ['—', '—', '—', '—', '—', '—'],
  },
  {
    time: 'P9 · 2:50–3:45',
    slots: ['CSC35091 – Arvind Pandey', 'CSC35091 – Arvind Pandey', 'CSC35091 – Arvind Pandey', 'CSC35091 – Arvind Pandey', 'CSC35091 – Arvind Pandey', '—'],
  },
];

export default function TimeTable() {
  const today = 0; // Monday index

  return (
    <div className="widget-card">
      <div className="widget-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Calendar size={18} color="var(--accent-cyan)" />
          <span className="widget-title">Weekly Timetable</span>
        </div>
        <span className="widget-badge">Semester 5</span>
      </div>
      <div className="widget-body-inner" style={{ overflowX: 'auto', padding: '14px 0' }}>
        <table className="tt-table">
          <thead>
            <tr>
              <th className="tt-time-head">Period</th>
              {days.map((d, i) => (
                <th key={d} className={i === today ? 'tt-today-head' : ''}>
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((p, pi) => (
              <tr key={pi}>
                <td className="tt-time">{p.time}</td>
                {p.slots.map((slot, si) => (
                  <td key={si} className={`tt-cell ${slot === '—' ? 'tt-empty' : ''} ${si === today && slot !== '—' ? 'tt-today-cell' : ''}`}>
                    {slot !== '—' ? (
                      <>
                        <span className="tt-code">{slot.split('–')[0].trim()}</span>
                        <span className="tt-teacher">{slot.split('–')[1]?.trim()}</span>
                      </>
                    ) : (
                      <span className="tt-dash">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
