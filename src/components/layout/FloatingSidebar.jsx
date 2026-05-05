
import { Home, Link as LinkIcon, Star, Menu } from 'lucide-react';
import './FloatingSidebar.css';

export default function FloatingSidebar() {
  return (
    <div className="floating-sidebar">
      <button className="sidebar-btn" title="Home">
        <Home size={18} />
      </button>
      <button className="sidebar-btn" title="Quick Links">
        <LinkIcon size={18} />
      </button>
      <button className="sidebar-btn" title="Favorites">
        <Star size={18} />
      </button>
      <button className="sidebar-btn" title="Menu">
        <Menu size={18} />
      </button>
    </div>
  );
}
