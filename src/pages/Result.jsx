import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import { useStudentSession } from '../data/studentStore';
import { Download, GraduationCap } from 'lucide-react';
import './Result.css';

export default function Result() {
  const [collapsed, setCollapsed] = useState(false);
  // useStudentSession now uses Firestore onSnapshot — real-time updates
  // are handled automatically. No manual event listeners needed.
  const student = useStudentSession();
  const offset = collapsed ? 72 : 260;

  const handlePrint = () => {
    window.print();
  };

  if (!student) {
    return (
      <div className="layout-root">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="main-content" style={{ marginLeft: offset }}>
          <TopBar collapsed={collapsed} />
          <div style={{ padding: '2rem', color: '#666' }}>
            Loading results… please wait.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-root">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className="main-content" style={{ marginLeft: offset }}>
        <TopBar collapsed={collapsed} />

        <div className="result-page-wrapper">
          <div className="result-header">
            <h1><GraduationCap size={28} color="var(--brand-navy)" /> Academic Results</h1>
            <button className="download-btn" onClick={handlePrint}>
              <Download size={18} /> Download Result
            </button>
          </div>

          <div className="transcript-container">
            <div className="university-header">
              <h2>Arka Jain University</h2>
              <p>Jamshedpur, Jharkhand</p>
              <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>Academic Transcript</p>
            </div>

            <div className="student-info-grid">
              <div className="info-item">
                <label>Student Name</label>
                <span>{student.name}</span>
              </div>
              <div className="info-item">
                <label>Enrollment No.</label>
                <span>{student.enrollmentNo}</span>
              </div>
              <div className="info-item">
                <label>Program</label>
                <span>{student.degree} in {student.branch}</span>
              </div>
              <div className="info-item">
                <label>Batch</label>
                <span>{student.batch}</span>
              </div>
            </div>

            <div className="semesters-list">
              {student.marks && student.marks.length > 0 ? (
                student.marks.map((sem, idx) => (
                  <div key={idx} className="semester-result-card">
                    <div className="semester-header">
                      <h3>{sem.semester} ({sem.session})</h3>
                      <div className="semester-stats">
                        <span><strong>SGPA:</strong> {sem.sgpa || 'N/A'}</span>
                        <span><strong>CGPA:</strong> {sem.cgpa || 'N/A'}</span>
                        <span><strong>Credits:</strong> {sem.earnedCredits || 0}/{sem.totalCredits || 0}</span>
                        <span><strong>Status:</strong> {sem.status || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="result-table-wrapper">
                      <table className="result-table">
                        <thead>
                          <tr>
                            <th>SN</th>
                            <th>Code</th>
                            <th>Subject Name</th>
                            <th>CIE</th>
                            <th>ESE</th>
                            <th>Total</th>
                            <th>Grade</th>
                            <th>Credits</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(sem.subjects || []).map((subj, sIdx) => (
                            <tr key={sIdx}>
                              <td>{sIdx + 1}</td>
                              <td>{subj.code}</td>
                              <td>{subj.name}</td>
                              <td>{subj.cie}</td>
                              <td>{subj.ese}</td>
                              <td>{subj.total}</td>
                              <td><span className="grade-badge">{subj.grade}</span></td>
                              <td>{subj.credits}</td>
                            </tr>
                          ))}
                          {(!sem.subjects || sem.subjects.length === 0) && (
                            <tr>
                              <td colSpan="8" style={{ textAlign: 'center', color: '#888' }}>
                                No subjects recorded for this semester.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                  No academic results available yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
