
import { Calendar } from 'lucide-react';

export default function DASAInfo() {
  return (
    <>
      <div className="form-section-title" style={{ marginTop: 0 }}>DASA Student Information</div>

      <div className="sf-grid-3">
        <div className="sf-group">
          <label>Visa Expiry Date</label>
          <div className="input-with-icon-sf" style={{ paddingLeft: '12px' }}>
             <Calendar size={16} color="#0056b3" />
             <input type="text" className="readonly" readOnly value="" />
          </div>
        </div>
        <div className="sf-group">
          <label>Passport Expiry Date</label>
          <div className="input-with-icon-sf" style={{ paddingLeft: '12px' }}>
             <Calendar size={16} color="#0056b3" />
             <input type="text" className="readonly" readOnly value="" />
          </div>
        </div>
        <div className="sf-group">
          <label>Date of issue Passport</label>
          <div className="input-with-icon-sf" style={{ paddingLeft: '12px' }}>
             <Calendar size={16} color="#0056b3" />
             <input type="text" className="readonly" readOnly value="" />
          </div>
        </div>
      </div>

      <div className="sf-grid-3">
        <div className="sf-group">
          <label>Stay Permit In India Valid Up</label>
          <div className="input-with-icon-sf" style={{ paddingLeft: '12px' }}>
             <Calendar size={16} color="#0056b3" />
             <input type="text" className="readonly" readOnly value="" />
          </div>
        </div>
        <div className="sf-group">
          <label>To Whether of Indian Origin</label>
          <div className="sf-radio-group" style={{ marginTop: '8px' }}>
            <label><input type="radio" name="indian_origin" disabled /> Yes</label>
            <label><input type="radio" name="indian_origin" disabled /> No</label>
          </div>
        </div>
        <div className="sf-group">
          <label>Scholarship Scheme if any</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
      </div>

      <div className="sf-grid-3">
        <div className="sf-group">
          <label>Agency</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Place of issue Passport</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Country/Citizenship</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
      </div>

      <div className="sf-footer-actions">
        <button className="sf-btn-primary">
          Save & Continue &gt;&gt;
        </button>
      </div>
    </>
  );
}
