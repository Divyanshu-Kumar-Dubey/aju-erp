

import { useStudentSession } from '../../data/studentStore';

export default function PersonalInfo() {
  const student = useStudentSession();

  // Parse name assuming "First [Middle] Last" roughly
  const nameParts = (student?.name || 'Ansh Kumar').split(' ');
  const first = nameParts[0];
  const last = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  const middle = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';

  return (
    <>
      <div className="form-section-title">Student Details</div>
  
      <div className="sf-grid-3">
        <div />
        <div className="sf-group">
          <label>Enrollment No.</label>
          <input type="text" readOnly className="sf-input readonly" value={student?.enrollmentNo || 'AJU/241051'} />
        </div>
        <div />
      </div>

      <div className="sf-grid-3">
        <div className="sf-group">
          <label>Student Full Name</label>
          <input type="text" readOnly className="sf-input readonly" value={student?.name || 'Ansh Kumar'} />
        </div>
        <div className="sf-group">
          <label><span className="sf-req">*</span> Student First Name</label>
          <input type="text" readOnly className="sf-input readonly" value={first} />
        </div>
        <div className="sf-group">
          <label>Student Middle Name</label>
          <input type="text" readOnly className="sf-input readonly" value={middle} />
        </div>
      </div>

      <div className="sf-grid-3">
        <div className="sf-group">
          <label>Student Last Name</label>
          <input type="text" readOnly className="sf-input readonly" value={last} />
        </div>
        <div className="sf-group">
          <label><span className="sf-req">*</span> Student Mobile No.</label>
          <input type="text" readOnly className="sf-input readonly" value={student?.phone || '9876543210'} />
        </div>
        <div className="sf-group">
          <label><span className="sf-req">*</span> Student Email Id</label>
          <input type="text" readOnly className="sf-input readonly" value={student?.email || 'ansh.kumar@aju.edu'} />
        </div>
      </div>

      <div className="sf-grid-3">
        <div className="sf-group">
          <label><span className="sf-req">*</span> Date of Birth</label>
          <input type="date" readOnly className="sf-input readonly" value={student?.dob || '2003-05-15'} />
        </div>
        <div className="sf-group">
          <label>Blood Group</label>
          <select disabled className="sf-input readonly">
            <option>B+</option>
          </select>
        </div>
        <div className="sf-group">
          <label>Nationality</label>
          <select disabled className="sf-input readonly">
            <option>INDIAN</option>
          </select>
        </div>
      </div>

      <div className="sf-grid-3">
        <div className="sf-group">
          <label>Caste</label>
          <select disabled className="sf-input readonly">
            <option>Please Select</option>
          </select>
        </div>
        <div className="sf-group">
          <label>Sub Caste</label>
          <input type="text" readOnly className="sf-input readonly" value="" />
        </div>
        <div className="sf-group">
          <label>Category</label>
          <select disabled className="sf-input readonly">
            <option>GENERAL</option>
          </select>
        </div>
      </div>

      <div className="sf-grid-3">
        <div className="sf-group">
          <label><span className="sf-req">*</span> Physically Handicapped</label>
          <select disabled className="sf-input readonly">
            <option>No</option>
          </select>
        </div>
        <div className="sf-group">
          <label>Gender</label>
          <div className="sf-radio-group">
            <label><input type="radio" checked readOnly disabled /> Male</label>
            <label><input type="radio" disabled /> Female</label>
          </div>
        </div>
        <div className="sf-group">
          <label>Religion</label>
          <select disabled className="sf-input readonly">
            <option>HINDU</option>
          </select>
        </div>
      </div>

      <div className="sf-grid-3">
        <div className="sf-group">
          <label>Aadhar No.</label>
          <input type="text" readOnly className="sf-input readonly" value="503818919272" />
        </div>
        <div className="sf-group">
          <label>Marital Status</label>
          <div className="sf-radio-group">
            <label><input type="radio" checked readOnly disabled /> Single</label>
            <label><input type="radio" disabled /> Married</label>
          </div>
        </div>
        <div className="sf-group">
          <label>Payment Type</label>
          <input type="text" readOnly className="sf-input readonly" value="GENERAL" />
        </div>
      </div>

      <div className="sf-grid-3">
        <div className="sf-group">
          <label>Student Whatsapp Number</label>
          <input type="text" readOnly className="sf-input readonly" value="9504952496" />
        </div>
        <div className="sf-group">
          <label>ABC ID</label>
          <input type="text" readOnly className="sf-input readonly" value="904596771268" />
        </div>
        <div className="sf-group">
          <label>Anti Ragging Ref. No</label>
          <input type="text" readOnly className="sf-input readonly" value="" />
        </div>
      </div>

      {/* Father Details */}
      <div className="form-section-title">Father Details</div>
      
      <div className="sf-grid-3">
        <div className="sf-group">
          <label><span className="sf-req">*</span> Father First Name</label>
          <input type="text" readOnly className="sf-input readonly" value="DINESH" />
        </div>
        <div className="sf-group">
          <label>Father Middle Name</label>
          <input type="text" readOnly className="sf-input readonly" value="KUMAR" />
        </div>
        <div className="sf-group">
          <label>Father Last Name</label>
          <input type="text" readOnly className="sf-input readonly" value="DUBEY" />
        </div>
      </div>

      <div className="sf-grid-3">
        <div className="sf-group">
          <label><span className="sf-req">*</span> Father&apos;s Mobile No.</label>
          <input type="text" readOnly className="sf-input readonly" value="9386617261" />
        </div>
        <div className="sf-group">
          <label>Father&apos;s Office Phone No.</label>
          <input type="text" readOnly className="sf-input readonly" value="" />
        </div>
        <div className="sf-group">
          <label>Father Qualification</label>
          <input type="text" readOnly className="sf-input readonly" value="" />
        </div>
      </div>

      <div className="sf-grid-3">
        <div className="sf-group">
          <label>Father Occupation</label>
          <select disabled className="sf-input readonly">
            <option>Please Select</option>
          </select>
        </div>
        <div className="sf-group">
          <label>Father&apos;s Email</label>
          <input type="email" readOnly className="sf-input readonly" value="" />
        </div>
        <div className="sf-group">
          <label>Annual Income</label>
          <input type="text" readOnly className="sf-input readonly" value="" />
        </div>
      </div>

      {/* Mother Details */}
      <div className="form-section-title">Mother Details</div>
      <div className="sf-grid-3">
        <div className="sf-group">
          <label>Mother&apos;s Name</label>
          <input type="text" readOnly className="sf-input readonly" value="SAVITA DEVI" />
        </div>
        <div className="sf-group">
          <label>Mother&apos;s Mobile No.</label>
          <input type="text" readOnly className="sf-input readonly" value="9934030603" />
        </div>
        <div className="sf-group">
          <label>Mother&apos;s Email</label>
          <input type="email" readOnly className="sf-input readonly" value="" />
        </div>
      </div>
      <div className="sf-grid-3">
        <div className="sf-group">
          <label>Mother Qualification</label>
          <input type="text" readOnly className="sf-input readonly" value="" />
        </div>
        <div className="sf-group">
          <label>Mother Occupation</label>
          <select disabled className="sf-input readonly">
            <option>Please Select</option>
          </select>
        </div>
        <div className="sf-group">
          <label>Mother&apos;s Office Phone No</label>
          <input type="text" readOnly className="sf-input readonly" value="" />
        </div>
      </div>

      {/* Photo & Signature */}
      <div className="form-section-title">Photo &amp; Signature Details</div>
      <div className="sf-photo-warning">
        Note : <span className="sf-req" style={{fontWeight: 'bold'}}>Only JPG,JPEG,PNG files are allowed upto 40 KB size For Photo and Signature</span>
      </div>

      <div className="sf-photo-flex">
        <div className="sf-photo-card">
          <div className="sf-photo-title">Only Passport Size Photo Allowed</div>
          <div className="sf-photo-box">
            <span>Photo :</span>
            <img src="https://i.pravatar.cc/150?u=divyanshu" alt="Student" />
          </div>
        </div>

        <div className="sf-sig-card">
          <div className="sf-sig-box">
            <span>Signature :</span>
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f8/William_Shakespeare_signature.svg" alt="Signature" style={{width: '140px', height: '60px', opacity: 0.7, background: '#dce1e7'}} />
          </div>
          <div className="sf-sig-upload">
            <input type="file" disabled />
            <button className="sf-btn-upload" disabled>Upload</button>
          </div>
        </div>
      </div>
    </>
  );
}
