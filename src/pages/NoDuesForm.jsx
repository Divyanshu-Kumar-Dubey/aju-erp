import { useState, useEffect } from 'react';
import { Home, ChevronRight, FileText, Printer } from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import { useStudentSession } from '../data/studentStore';
import './NoDuesForm.css';

export default function NoDuesForm() {
  const [collapsed, setCollapsed] = useState(false);
  const offset = collapsed ? 72 : 260;

  const student = useStudentSession();

  const [formData, setFormData] = useState({
    admissionBatch: student?.batch || '2024-2025',
    instituteName: student?.department === 'Dept. of IT' ? 'School of Engineering and Information Technology' : 'School of Commerce and Management',
    degree: student?.degree === 'MCA' ? 'Master of Computer Application' : 'Bachelor of Technology',
    branch: student?.branch || 'MCA'
  });

  // If student session loads late, update state
  useEffect(() => {
    if (student) {
      setFormData({
        admissionBatch: student.batch || '2024-2025',
        instituteName: student.department === 'Dept. of IT' ? 'School of Engineering and Information Technology' : 'School of Commerce and Management',
        degree: student.degree === 'MCA' ? 'Master of Computer Application' : 'Bachelor of Technology',
        branch: student.branch || 'MCA'
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="layout-root">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className="main-content" style={{ marginLeft: offset }}>
        <TopBar collapsed={collapsed} />

        <div className="ndf-page-root">
          {/* Breadcrumb */}
          <div className="ndf-breadcrumb">
            <div className="ndf-breadcrumb-item">
              <Home size={14} />
              <span>Academic</span>
            </div>
            <ChevronRight size={14} className="ndf-breadcrumb-sep" />
            <div className="ndf-breadcrumb-item">
              <span>Student Related</span>
            </div>
            <ChevronRight size={14} className="ndf-breadcrumb-sep" />
            <div className="ndf-breadcrumb-item ndf-breadcrumb-active">
              <span>No Dues Form Generation</span>
            </div>
          </div>

          <motion.div 
            className="ndf-container-box"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="ndf-main-header">
              <div className="ndf-header-left">
                <FileText size={20} color="#008080" />
                <h1>No Dues Form-Generation</h1>
              </div>
              <div className="ndf-mandatory-note">
                Note : * Marked fields are mandatory
              </div>
            </div>

            <div className="ndf-content-area">
              <div className="ndf-form-grid">
                {/* Admission Batch */}
                <div className="ndf-form-group">
                  <label className="ndf-label">
                    <span>*</span>Admission Batch
                  </label>
                  <select 
                    name="admissionBatch" 
                    value={formData.admissionBatch} 
                    onChange={handleChange}
                    className="ndf-select"
                  >
                    <option value="2024-2025">2024-2025</option>
                    <option value="2023-2024">2023-2024</option>
                    <option value="2022-2023">2022-2023</option>
                  </select>
                </div>

                {/* Institute Name */}
                <div className="ndf-form-group">
                  <label className="ndf-label">
                    <span>*</span>Institute Name
                  </label>
                  <select 
                    name="instituteName" 
                    value={formData.instituteName} 
                    onChange={handleChange}
                    className="ndf-select"
                  >
                    <option value="School of Engineering and Information Technology">School of Engineering and Information Technology</option>
                    <option value="School of Commerce and Management">School of Commerce and Management</option>
                  </select>
                </div>

                {/* Degree */}
                <div className="ndf-form-group">
                  <label className="ndf-label">
                    <span>*</span>Degree
                  </label>
                  <select 
                    name="degree" 
                    value={formData.degree} 
                    onChange={handleChange}
                    className="ndf-select"
                  >
                    <option value="Master of Computer Application">Master of Computer Application</option>
                    <option value="Bachelor of Technology">Bachelor of Technology</option>
                    <option value="Bachelor of Computer Application">Bachelor of Computer Application</option>
                  </select>
                </div>

                {/* Branch */}
                <div className="ndf-form-group">
                  <label className="ndf-label">
                    <span>*</span>Branch
                  </label>
                  <select 
                    name="branch" 
                    value={formData.branch} 
                    onChange={handleChange}
                    className="ndf-select"
                  >
                    <option value="MCA">MCA</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                  </select>
                </div>
              </div>

              <div className="ndf-actions">
                <button className="ndf-print-btn" onClick={handlePrint}>
                  <Printer size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Print No-Dues Form
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
