

export default function AddressInfo() {
  return (
    <>
      <div className="form-section-title" style={{ marginTop: 0 }}>Local Guardian&apos;s Address</div>
      
      <div style={{ marginBottom: 24, paddingLeft: 8 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
          <input type="checkbox" /> Same as Permanent Address
        </label>
      </div>

      <div className="sf-grid-3" style={{ alignItems: 'start' }}>
        <div className="sf-group" style={{ gridRow: 'span 2' }}>
          <label>Address Details(Copy Permanent)</label>
          <textarea className="sf-input readonly" readOnly rows={4} style={{ resize: 'none', height: '114px' }}></textarea>
        </div>
        
        <div className="sf-group">
          <label>Guardian Name</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Guardian Ph. No.</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>

        <div className="sf-group">
          <label>Guardian&apos;s Relation</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
        <div className="sf-group">
          <label>Occupation</label>
          <input type="text" className="sf-input readonly" readOnly value="" />
        </div>
      </div>

      <div className="sf-grid-3">
        <div className="sf-group">
          <label>Guardian Qualification</label>
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
