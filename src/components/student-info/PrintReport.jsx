
import { Printer } from 'lucide-react';

export default function PrintReport() {
  return (
    <div className="print-report-container">
      <div className="print-actions">
        <button className="btn-print-main" onClick={() => window.print()}>
          <Printer size={18} /> Print Application Form
        </button>
      </div>

      <div className="print-report">
        {/* Page 1 */}
        <div className="report-page">
          <div className="report-header-top">
            <div className="report-logo-container">
              <img 
                src="https://www.arkajainuniversity.ac.in/wp-content/uploads/2021/08/Logo.png" 
                alt="Logo" 
                className="report-logo-img"
                onError={(e) => { 
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiMwMDNiNzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QUpVPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
            </div>
            <div className="report-university-info">
              <h1 className="report-uni-name">ARKA JAIN University, Jharkhand</h1>
              <p className="report-uni-addr">Opp. To Kerala Public School, Mohanpur Gamharia, Dist. Seraikela Kharsawan, Jharkhand - 832108</p>
            </div>
            <div className="report-marks-obtained">
              OFFICE USE ONLY
            </div>
          </div>

          <div className="report-admission-title">APPLICATION FOR ADMISSION FORM</div>

          <div className="report-section-header">General Information</div>
          
          <div className="report-summary-header">
            <div className="report-info-grid-3col">
              <div className="info-item"><span className="info-label">Student Name</span>: <span className="info-value">DIVYANSHU KUMAR DUBEY</span></div>
              <div className="info-item"><span className="info-label">Enrollment No.</span>: <span className="info-value">AJU/241051</span></div>
              <div className="info-item"><span className="info-label">Admission Date</span>: <span className="info-value">10/05/2024</span></div>
            </div>
            <div className="report-info-grid-2col">
              <div className="info-item"><span className="info-label">Course Applied For</span>: <span className="info-value">MASTER OF COMPUTER APPLICATIONS (MCA)</span></div>
              <div className="info-item"><span className="info-label">Mobile Number</span>: <span className="info-value">7004453472</span></div>
            </div>
            <div className="report-photo-signature-container">
              <div className="report-photo-box">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120" alt="Student" />
                <div className="box-label">STUDENT PHOTO</div>
              </div>
              <div className="report-photo-box">
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'Dancing Script, cursive', fontSize: '18px' }}>Ansh Dubey</span>
                </div>
                <div className="box-label">SIGNATURE</div>
              </div>
            </div>
          </div>

          <div className="report-boxed-sub-section">
            <span className="boxed-title">Native Place</span>
            <div className="report-info-grid-3col">
              <div className="info-item"><span className="info-label" style={{ width: '80px' }}>City</span>: <span className="info-value">-</span></div>
              <div className="info-item"><span className="info-label" style={{ width: '80px' }}>District</span>: <span className="info-value">-</span></div>
              <div className="info-item"><span className="info-label" style={{ width: '80px' }}>State</span>: <span className="info-value">-</span></div>
            </div>
          </div>

          <div className="report-info-grid-2col" style={{ marginTop: '5px' }}>
            <div className="info-item"><span className="info-label">Birth Date</span>: <span className="info-value">05/01/2002</span></div>
            <div className="info-item"><span className="info-label">Nationality</span>: <span className="info-value">INDIAN</span></div>
          </div>

          <div className="report-section-header">Personal Information</div>
          <div className="report-info-grid-3col">
              <div className="info-item"><span className="info-label">Father&apos;s Name</span>: <span className="info-value">DINESH KUMAR DUBEY</span></div>
              <div className="info-item"><span className="info-label">Mother&apos;s Name</span>: <span className="info-value">SAVITA DEVI</span></div>
              <div className="info-item"><span className="info-label">Father&apos;s Mob. No.</span>: <span className="info-value">9386617261</span></div>
          </div>
          <div className="report-info-grid-2col">
              <div className="info-item"><span className="info-label">Aadhar Card No.</span>: <span className="info-value">503818919272</span></div>
              <div className="info-item"><span className="info-label">Gender</span>: <span className="info-value">MALE</span></div>
          </div>
          <div className="report-info-grid-2col">
              <div className="info-item"><span className="info-label">Marital Status</span>: <span className="info-value">SINGLE</span></div>
              <div className="info-item"><span className="info-label">Blood Group</span>: <span className="info-value">B+</span></div>
          </div>
          
          <div className="report-section-header">Educational Qualifications</div>
          <table className="report-table">
            <thead>
              <tr>
                <th>Exam Passed</th>
                <th>Board/University</th>
                <th>Year</th>
                <th>% Marks/CGPA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>BCA</td>
                <td>ARKA JAIN UNIVERSITY</td>
                <td>2024</td>
                <td>80.46</td>
              </tr>
            </tbody>
          </table>

          <div className="report-page-footer">
            <span>Student Copy</span>
            <span>Printed on: {new Date().toLocaleDateString()}</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
