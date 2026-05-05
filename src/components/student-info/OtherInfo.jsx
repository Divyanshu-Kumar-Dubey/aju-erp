

export default function OtherInfo() {
  return (
    <>
      <div className="form-section-title" style={{ marginTop: 0 }}>Other Personal Information</div>

      <div className="sf-grid-4">
        <div className="sf-group">
          <label>Birth Place</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Mother Tongue</label>
          <select className="sf-input">
            <option>Please Select</option>
          </select>
        </div>
        <div className="sf-group">
          <label>Other Language</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Birth Village</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
      </div>

      <div className="sf-grid-4">
        <div className="sf-group">
          <label>Birth Tehsil</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Birth District</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Birth State</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Pin Code</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
      </div>

      <div className="sf-grid-4">
        <div className="sf-group">
          <label>Height (In inch)</label>
          <input type="text" className="sf-input readonly" readOnly value="0.00" />
        </div>
        <div className="sf-group">
          <label>Weight (In Kg)</label>
          <input type="text" className="sf-input readonly" readOnly value="0.00" />
        </div>
        <div className="sf-group">
          <label>Urban</label>
          <div className="sf-radio-group" style={{ marginTop: '8px' }}>
            <label><input type="radio" name="oi_urban" disabled /> Yes</label>
            <label><input type="radio" name="oi_urban" disabled defaultChecked /> No</label>
          </div>
        </div>
        <div className="sf-group">
          <label>Identification Mark</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
      </div>

      <div className="sf-grid-4">
        <div className="sf-group">
          <label>Bank Name</label>
          <select className="sf-input">
            <option>Please Select</option>
          </select>
        </div>
        <div className="sf-group">
          <label>Bank Account No</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Passport No.</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
      </div>

      <div className="form-section-title">Work Information</div>

      <div className="sf-grid-4">
        <div className="sf-group">
          <label>Work Experience</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Organization Last Worked For</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Designation</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>EPF Number</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
         <button className="sf-btn-add">Add</button>
      </div>

      <div className="sf-footer-actions">
        <button className="sf-btn-primary">
          Submit
        </button>
      </div>
    </>
  );
}
