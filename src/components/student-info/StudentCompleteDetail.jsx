
import { Award, Calendar, CreditCard, MessageSquare } from 'lucide-react';
import { useStudentSession } from '../../data/studentStore';

export default function StudentCompleteDetail() {
  const student = useStudentSession();

  const attendanceData = [
    { course: 'CSC34198--QUANTUM COMPUTING', faculty: 'AKASH KUMAR BHAGAT', total: 31, present: 4, absent: 27, percentage: 12 }
  ];



  const feesData = [
    { session: 'EVEN 2021-22', sem: 'II', type: 'Admission Fees', recNo: 'C/TF/21/61918', date: '21-03-2025', amount: '50000.00', remarks: '' },
    { session: 'EVEN 2021-22', sem: 'II', type: 'Admission Fees', recNo: 'C/TF/21/61993', date: '24-03-2025', amount: '720.00', remarks: '' },
    { session: 'ODD 2023-24', sem: 'I', type: 'Admission Fees', recNo: 'C/TF/21/50248', date: '18-06-2024', amount: '25000.00', remarks: '' },
    { session: 'ODD 2024-25', sem: 'I', type: 'Examination Fees', recNo: 'C6/O/EF/21/51292', date: '21-12-2024', amount: '1000.00', remarks: 'PAID ONLINE' },
  ];

  return (
    <div className="scd-container">
      {/* Comprehensive Student Information Header */}
      <div className="form-section-title">Comprehensive Student Information</div>
      
      <div className="scd-profile-card glass-card">
        <div className="scd-profile-grid">
          <div className="scd-profile-info">
            <div className="si-item"><span className="si-label">Student Name:</span> <span className="si-val highlight">{(student?.name || 'ANSH KUMAR').toUpperCase()}</span></div>
            <div className="si-item"><span className="si-label">Father&apos;s Name:</span> <span className="si-val">{(student?.fatherName || 'RAJESH KUMAR').toUpperCase()}</span></div>
            <div className="si-item"><span className="si-label">Roll No.:</span> <span className="si-val highlight">{student?.rollNo || 'CSE/2023/001'}</span></div>
            <div className="si-item"><span className="si-label">Enrollment No.:</span> <span className="si-val">{student?.enrollmentNo || 'AJU/241051'}</span></div>
            <div className="si-item"><span className="si-label">Branch:</span> <span className="si-val">{student?.branch || 'MCA'}</span></div>
            <div className="si-item"><span className="si-label">Semester:</span> <span className="si-val">{student?.semester || 'Semester 3'}</span></div>
            <div className="si-item"><span className="si-label">Nationality:</span> <span className="si-val">INDIAN</span></div>
            <div className="si-item"><span className="si-label">Religion:</span> <span className="si-val">HINDU</span></div>
          </div>
          <div className="scd-profile-address">
            <div className="si-item-full">
              <span className="si-label">Local Address:</span>
              <p className="si-val-text">S/O {(student?.fatherName || 'RAJESH KUMAR').toUpperCase()}, {(student?.address || '123, Adityapur').toUpperCase()}</p>
            </div>
            <div className="si-item-full">
              <span className="si-label">Permanent Address:</span>
              <p className="si-val-text">S/O {(student?.fatherName || 'RAJESH KUMAR').toUpperCase()}, {(student?.address || '123, Adityapur').toUpperCase()}</p>
            </div>
            <div className="si-item"><span className="si-label">Date of Birth:</span> <span className="si-val">{student?.dob || '2003-05-15'}</span></div>
            <div className="si-item"><span className="si-label">Category:</span> <span className="si-val">GENERAL</span></div>
          </div>
          <div className="scd-profile-photo">
            <div className="scd-photo-box">
              <img src={student?.image || 'https://i.pravatar.cc/150?u=divyanshu'} alt="Student" />
              <div className="photo-label">STUDENT PHOTO</div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Attendance */}
      <div className="scd-section">
        <div className="scd-section-header">
          <Calendar size={18} />
          Student Attendance
        </div>
        <div className="sf-table-wrapper glass-table">
          <table className="sf-table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Faculty Name</th>
                <th>Total Classes</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((id, idx) => (
                <tr key={idx}>
                  <td>{id.course}</td>
                  <td>{id.faculty}</td>
                  <td>{id.total}</td>
                  <td>{id.present}</td>
                  <td className="text-red">{id.absent}</td>
                  <td className={id.percentage < 75 ? 'text-red font-bold' : ''}>{id.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Current Semester Result */}
      <div className="scd-section">
        <div className="scd-section-header">
          <Award size={18} />
          Current Semester Result
        </div>
        
        {(student?.marks || []).map((sem, sIdx) => (
          <div key={sIdx} className="scd-semester-box">
            <div className="scd-sem-header">
              <div className="sem-info-badge">{sem.semester} {sem.session ? `- ${sem.session}` : ''}</div>
              <div className="sem-stats">
                <div className="stat-pill">Credits: <span>{sem.earnedCredits || 0}/{sem.totalCredits || 30}</span></div>
                <div className="stat-pill">SGPA: <span className="highlight">{sem.sgpa || 'N/A'}</span></div>
                <div className="stat-pill">CGPA: <span>{sem.cgpa || 'N/A'}</span></div>
                <div className={`status-pill ${sem.status === 'Pass' ? 'pass' : 'fail'}`}>{sem.status || 'Result Awaited'}</div>
              </div>
            </div>
            
            <div className="sf-table-wrapper glass-table nested-table">
              <table className="sf-table">
                <thead>
                  <tr>
                    <th>SR.NO.</th>
                    <th>COURSE CODE</th>
                    <th>COURSE NAME</th>
                    <th>CIE MARKS</th>
                    <th>ESE MARKS</th>
                    <th>TOTAL MARKS</th>
                    <th>GRADE POINT</th>
                    <th>RESULT</th>
                    <th>CREDITS</th>
                  </tr>
                </thead>
                <tbody>
                  {(sem.subjects || []).map((det, dIdx) => (
                    <tr key={dIdx}>
                      <td>{dIdx + 1}</td>
                      <td>{det.code}</td>
                      <td>{det.name}</td>
                      <td>{det.cie}</td>
                      <td>{det.ese}</td>
                      <td>{det.total}</td>
                      <td>{det.gradePoint}</td>
                      <td><span className="grade-badge">{det.grade}</span></td>
                      <td>{det.credits}</td>
                    </tr>
                  ))}
                  {(!sem.subjects || sem.subjects.length === 0) && (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '1rem', color: '#888' }}>
                        No subjects found for this semester.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        {(!student?.marks || student.marks.length === 0) && (
          <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--glass-bg)', borderRadius: '12px' }}>
            No semester results available.
          </div>
        )}
      </div>

      {/* Fees Details */}
      <div className="scd-section">
        <div className="scd-section-header">
          <CreditCard size={18} />
          Fees Details
        </div>
        <div className="sf-table-wrapper glass-table">
          <table className="sf-table">
            <thead>
              <tr>
                <th>Session</th>
                <th>Semester</th>
                <th>Receipt Type</th>
                <th>Rec. No</th>
                <th>Rec. Date</th>
                <th>Amount paid</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {feesData.map((fee, fIdx) => (
                <tr key={fIdx}>
                  <td>{fee.session}</td>
                  <td>{fee.sem}</td>
                  <td>{fee.type}</td>
                  <td>{fee.recNo}</td>
                  <td>{fee.date}</td>
                  <td className="font-bold text-primary">₹{fee.amount}</td>
                  <td className="small-text">{fee.remarks || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Remark */}
      <div className="scd-section">
        <div className="scd-section-header">
          <MessageSquare size={18} />
          Student Remark
        </div>
        <div className="scd-remark-box glass-card">
          <p className="no-data">No Remarks Given</p>
        </div>
      </div>
    </div>
  );
}
