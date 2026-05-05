
import './Widgets.css';
import { Zap, CreditCard, FileText, BookOpen } from 'lucide-react';

const quickLinks = [
  { label: 'Fee Payment',  icon: CreditCard,   color: '#FFB800' },
  { label: 'Exam Form',    icon: FileText,      color: '#10b981' },
  { label: 'Hall Ticket',  icon: FileText,      color: '#8B0000' },
  { label: 'e-Library',    icon: BookOpen,      color: '#1a237e' },
];

export default function QuickAccess() {
  return (
    <div className="widget-card">
      <div className="widget-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Zap size={18} color="var(--brand-gold)" />
          <span className="widget-title">Quick Access</span>
        </div>
      </div>
      <div className="widget-body-inner">
        <div className="quick-grid">
          {quickLinks.map((q, i) => {
            const Icon = q.icon;
            return (
              <a
                key={i}
                href="#"
                className="quick-item"
                style={{ '--item-color': q.color }}
              >
                <Icon size={20} color={q.color} />
                <span>{q.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
