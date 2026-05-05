import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import StudentCompleteDetailComponent from '../components/student-info/StudentCompleteDetail';
import { ClipboardList } from 'lucide-react';
import './StudentInformation.css';

export default function StudentCompleteDetail() {
  const [collapsed, setCollapsed] = useState(false);
  const offset = collapsed ? 72 : 260;

  return (
    <div className="layout-root">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className="main-content" style={{ marginLeft: offset }}>
        <TopBar collapsed={collapsed} />

        <div className="dashboard-content si-page-root">
          <div className="si-container-box">
            
            <div className="si-main-header">
              <ClipboardList size={22} color="#0056b3" />
              <span>STUDENT COMPLETE DETAIL</span>
            </div>

            <div className="scd-page-wrapper" style={{ padding: '2rem' }}>
              <StudentCompleteDetailComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
