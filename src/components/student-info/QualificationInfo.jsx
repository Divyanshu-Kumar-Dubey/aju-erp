
import { Pencil, X } from 'lucide-react';

export default function QualificationInfo() {
  return (
    <>
      <div className="form-section-title" style={{ marginTop: 0 }}>Other Entrance Exam Scores(P.G)</div>

      <div className="sf-grid-5">
        <div className="sf-group">
          <label>Exam Name</label>
          <select className="sf-input">
            <option>Please Select</option>
          </select>
        </div>
        <div className="sf-group">
          <label>Exam Roll No.</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Year of Exam</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Percentage</label>
          <input type="text" className="sf-input readonly" readOnly value="0.00" />
        </div>
        <div className="sf-group">
          <label>CGPA</label>
          <input type="text" className="sf-input readonly" readOnly value="0.00" />
        </div>
      </div>

      <div className="sf-grid-5">
        <div className="sf-group">
          <label>Rank</label>
          <input type="text" className="sf-input readonly" readOnly value="0" />
        </div>
        <div className="sf-group">
          <label>Score</label>
          <input type="text" className="sf-input readonly" readOnly value="0.00" />
        </div>
      </div>

      <div className="form-subsection-title">Student Last(UG or PG) Qualification</div>

      <div className="sf-grid-4">
        <div className="sf-group" style={{ gridColumn: 'span 2' }}>
          <label>School / College Name</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Board</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Qualifying Exam.</label>
          <select className="sf-input">
            <option>Please Select</option>
          </select>
        </div>
      </div>

      <div className="sf-grid-4">
        <div className="sf-group">
          <label>Medium in Qualify Exam</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Exam Roll No.</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Year of Exam</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Marks Obtained</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
      </div>

      <div className="sf-grid-5">
        <div className="sf-group">
          <label>Out Of Marks</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Percentage</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Grade</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>CGPA</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Attempt</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
      </div>

      <div className="sf-grid-4">
        <div className="sf-group" style={{ gridColumn: 'span 2' }}>
          <label>School/College Address</label>
          <textarea className="sf-input readonly" readOnly rows={2} style={{ resize: 'none' }}></textarea>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
         <button className="sf-btn-add">Add</button>
      </div>

      <div className="sf-table-wrapper">
        <table className="sf-table">
          <thead>
            <tr>
              <th>Edit</th>
              <th>Delete</th>
              <th>Qualifying Exam Name</th>
              <th>Year of Exam</th>
              <th>School/College Name</th>
              <th>Percentage</th>
              <th>Board</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: 'center' }}><Pencil size={16} color="#22c55e" style={{ cursor: 'pointer' }} /></td>
              <td style={{ textAlign: 'center' }}><X size={18} color="#ef4444" style={{ cursor: 'pointer' }} /></td>
              <td>BCA</td>
              <td>2024</td>
              <td>ARKA JAIN UNIVERSITY</td>
              <td>80.46</td>
              <td>ARKA JAIN UNIVERSITY</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sf-footer-actions">
        <button className="sf-btn-primary">
          Save & Continue &gt;&gt;
        </button>
      </div>
    </>
  );
}
