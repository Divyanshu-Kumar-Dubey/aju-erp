import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { KeyRound, User, Mail, Phone, Shield } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import { useStudentSession } from '../data/studentStore';
import './Profile.css';

export default function Profile() {
  const [collapsed, setCollapsed] = useState(false);
  const sessionStudent = useStudentSession();

  const [avatar, setAvatar] = useState('https://i.pravatar.cc/150?u=arka');
  const [loading, setLoading] = useState(false);

  const [details, setDetails] = useState({
    firstName: 'Ansh',
    lastName: 'Kumar',
    email: 'ansh.kumar@aju.edu',
    phone: '+91 98765 43210',
    enrollmentNo: 'AJU/241051',
    degree: 'MCA',
    department: 'Dept. of IT',
    batch: '2024-2025',
  });

  useEffect(() => {
    if (sessionStudent) {
      const nameParts = (sessionStudent.name || 'Ansh Kumar').split(' ');
      setDetails({
        firstName: nameParts[0] || 'Ansh',
        lastName: nameParts.slice(1).join(' ') || 'Kumar',
        email: sessionStudent.email || 'ansh.kumar@aju.edu',
        phone: sessionStudent.phone || '+91 98765 43210',
        enrollmentNo: sessionStudent.enrollmentNo || 'AJU/241051',
        degree: sessionStudent.degree || 'MCA',
        department: sessionStudent.department || 'Dept. of IT',
        batch: sessionStudent.batch || '2024-2025',
      });
      setAvatar(sessionStudent.image || 'https://i.pravatar.cc/150?u=arka');
    }
  }, [sessionStudent]);

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      alert("Passwords don't match!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPasswords({ current: '', newPass: '', confirm: '' });
      alert("Password updated successfully!");
    }, 1000);
  };

  return (
    <div className="layout-root">
      <Helmet>
        <title>My Profile | AJU ERP</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className="main-content" style={{ marginLeft: collapsed ? 72 : 260 }}>
        <TopBar collapsed={collapsed} />

        <div className="dashboard-content profile-page">
          <div className="profile-header">
            <div>
              <h1 className="page-title">My Profile</h1>
              <p className="page-subtitle">Manage your personal information and security settings</p>
            </div>
          </div>

          <div className="profile-grid">
            
            {/* Left Column: Avatar & Basic Info */}
            <div className="profile-col-left">
              <div className="profile-card avatar-card">
                <div className="avatar-wrapper">
                  <img src={avatar} alt="Profile" className="profile-avatar-img" loading="lazy" decoding="async" />
                </div>
                <h2 className="profile-name">{details.firstName} {details.lastName}</h2>
                <p className="profile-role">{details.degree} · {details.department}</p>
                <p style={{ fontSize: '0.8rem', color: '#888', margin: '0.2rem 0 0.5rem' }}>{details.enrollmentNo}</p>
                <div className="profile-badge">
                  <Shield size={14} /> Active Student
                </div>
              </div>
            </div>

            {/* Right Column: Forms */}
            <div className="profile-col-right">
              
              {/* Personal Details Form */}
              <div className="profile-card">
                <h3 className="card-title"><User size={20}/> Personal Details</h3>
                <div className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input 
                        type="text" 
                        value={details.firstName} 
                        readOnly
                        disabled
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input 
                        type="text" 
                        value={details.lastName} 
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email Address</label>
                      <div className="input-with-icon">
                        <Mail size={16} />
                        <input type="email" value={details.email} readOnly disabled />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <div className="input-with-icon">
                        <Phone size={16} />
                        <input type="tel" value={details.phone} readOnly disabled />
                      </div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Enrollment Number</label>
                      <input type="text" value={details.enrollmentNo} readOnly disabled />
                    </div>
                    <div className="form-group">
                      <label>Batch</label>
                      <input type="text" value={details.batch} readOnly disabled />
                    </div>
                  </div>
                </div>
              </div>

              {/* Change Password Form */}
              <div className="profile-card">
                <h3 className="card-title"><KeyRound size={20}/> Security & Password</h3>
                <form className="profile-form" onSubmit={handleChangePassword}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter current password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>New Password</label>
                      <input 
                        type="password" 
                        placeholder="New password"
                        value={passwords.newPass}
                        onChange={(e) => setPasswords({...passwords, newPass: e.target.value})}
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirm Password</label>
                      <input 
                        type="password" 
                        placeholder="Confirm new password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-secondary" disabled={loading}>
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
