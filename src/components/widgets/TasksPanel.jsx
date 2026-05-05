
import './Widgets.css';
import { Star, FileText, CreditCard } from 'lucide-react';

const tasks = [
  { label: 'Student Admit Card / Hall Ticket', icon: FileText, color: '#6366f1', new: true },
  { label: 'Semester Fee Receipt Download', icon: CreditCard, color: '#10b981', new: false },
];

export default function TasksPanel() {
  return (
    <div className="widget-card">
      <div className="widget-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Star size={18} color="var(--accent-amber)" fill="var(--accent-amber)" />
          <span className="widget-title">Quick Tasks</span>
        </div>
      </div>
      <div className="widget-body-inner">
        {tasks.map((t, i) => {
          const Icon = t.icon;
          return (
            <a key={i} href="#" className="task-row">
              <div className="task-icon-wrap" style={{ background: `${t.color}20`, color: t.color }}>
                <Icon size={16} />
              </div>
              <span className="task-label">{t.label}</span>
              {t.new && <span className="task-new">NEW</span>}
            </a>
          );
        })}
      </div>
    </div>
  );
}
