import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  User, 
  GraduationCap, 
  Calendar, 
  CreditCard, 
  Save, 
  Upload,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  Trash2,
  Plus,
  Database,
  Users,
  IndianRupee,
  AlertCircle,
  BookOpen,
  RefreshCw,
  Edit3
} from 'lucide-react';
import { getStudent, saveStudent, getAllStudents, adminLogout } from '../data/studentStore';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('AJU/');
  const [foundStudent, setFoundStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ── Database View ──
  const [adminView, setAdminView] = useState('edit'); // 'edit' | 'database'
  const [dbStudents, setDbStudents] = useState([]);
  const [dbSearch, setDbSearch] = useState('');
  const [dbLoading, setDbLoading] = useState(false);

  const loadDatabaseView = useCallback(async () => {
    setDbLoading(true);
    try {
      const all = await getAllStudents();
      setDbStudents(Object.values(all).sort((a, b) => (a.name || '').localeCompare(b.name || '')));
    } catch (e) {
      console.error(e);
    } finally {
      setDbLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminView === 'database') loadDatabaseView();
  }, [adminView, loadDatabaseView]);


  const handleLogout = async () => {
    await adminLogout();
    localStorage.removeItem('adminAuth');
    navigate('/admin-login', { replace: true });
    window.location.reload(); // force App state refresh
  };

  // Search from Firestore
  const handleSearch = async () => {
    const key = searchQuery.trim().toUpperCase();
    if (!key) return;
    
    setIsSearching(true);
    try {
      const student = await getStudent(key);
      if (student) {
        setFoundStudent(student);
      } else {
        alert(`Student not found! Try: AJU/241051`);
        setFoundStudent(null);
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to database. Check your internet.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateNewStudent = async () => {
    const allStudents = await getAllStudents();
    const keys = Object.keys(allStudents).filter(k => k.startsWith('AJU/'));
    let maxId = 241050; // Base ID
    keys.forEach(k => {
      const numPart = k.split('/')[1];
      if (numPart) {
        const num = parseInt(numPart);
        if (!isNaN(num) && num > maxId) maxId = num;
      }
    });
    
    const newEnrollmentNo = `AJU/${maxId + 1}`;
    const newPassword = Math.random().toString(36).slice(-8);

    const newStudent = {
      enrollmentNo: newEnrollmentNo,
      password: newPassword,
      name: '',
      fatherName: '',
      dob: '2005-01-01',
      phone: '',
      email: '',
      address: '',
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E",
      batch: '2024-2025',
      department: 'Dept. of IT',
      degree: 'MCA',
      branch: 'Computer Applications',
      semester: 'Semester 1',
      rollNo: '',
      marks: [],
      attendance: { 
        theory: 0, 
        practical: 0,
        subjects: []
      },
      fees: { total: 0, paid: 0, due: 0 },
    };

    setSearchQuery(newEnrollmentNo);
    setFoundStudent(newStudent);
    setActiveTab('personal');
  };

  const handleUpdate = (field, updaterOrValue, category = null) => {
    setFoundStudent(prev => {
      const currentValue = category ? prev[category]?.[field] : prev[field];
      const newValue = typeof updaterOrValue === 'function' ? updaterOrValue(currentValue) : updaterOrValue;

      if (category) {
        return {
          ...prev,
          [category]: {
            ...prev[category],
            [field]: newValue
          }
        };
      } else {
        return {
          ...prev,
          [field]: newValue
        };
      }
    });
  };


  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveStudent(foundStudent.enrollmentNo, foundStudent);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('Error saving student:', err);
      setIsSaving(false);
      alert('Failed to save. Check your internet connection.');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="form-grid fade-in-tab">
            <div className="profile-img-editor">
              <img src={foundStudent.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(foundStudent.name || 'Student') + '&background=008080&color=fff&size=128'} alt="Profile" className="preview-avatar" />
              <label htmlFor="photo-upload" className="upload-btn" style={{ cursor: 'pointer' }}>
                <Upload size={16} /> Update Photo
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const img = new Image();
                    img.onload = () => {
                      // Compress: resize to max 200x200, JPEG quality 0.7
                      const MAX = 200;
                      const scale = Math.min(MAX / img.width, MAX / img.height, 1);
                      const canvas = document.createElement('canvas');
                      canvas.width  = Math.round(img.width  * scale);
                      canvas.height = Math.round(img.height * scale);
                      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                      const compressed = canvas.toDataURL('image/jpeg', 0.7);
                      handleUpdate('image', compressed);
                    };
                    img.src = ev.target.result;
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </div>
            
            <div className="form-group">
              <label>Enrollment Number (Username)</label>
              <input 
                type="text" 
                value={foundStudent.enrollmentNo} 
                onChange={(e) => handleUpdate('enrollmentNo', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={foundStudent.name} 
                onChange={(e) => handleUpdate('name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Login Password</label>
              <input 
                type="text" 
                value={foundStudent.password} 
                onChange={(e) => handleUpdate('password', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Father&apos;s Name</label>
              <input 
                type="text" 
                value={foundStudent.fatherName} 
                onChange={(e) => handleUpdate('fatherName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input 
                type="date" 
                className="modern-date-input"
                min="1970-01-01"
                max="2015-12-31"
                value={foundStudent.dob} 
                onChange={(e) => handleUpdate('dob', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                value={foundStudent.phone} 
                onChange={(e) => handleUpdate('phone', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={foundStudent.email} 
                onChange={(e) => handleUpdate('email', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Residential Address</label>
              <input 
                type="text" 
                value={foundStudent.address} 
                onChange={(e) => handleUpdate('address', e.target.value)}
              />
            </div>
          </div>
        );
      case 'academic':
        return (
          <div className="fade-in-tab" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Program Information */}
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Program Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Degree / Program</label>
                  <input 
                    type="text" 
                    value={foundStudent.degree || ''} 
                    onChange={(e) => handleUpdate('degree', e.target.value)}
                    placeholder="e.g. MCA, B.Tech"
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input 
                    type="text" 
                    value={foundStudent.department || ''} 
                    onChange={(e) => handleUpdate('department', e.target.value)}
                    placeholder="e.g. Dept. of IT"
                  />
                </div>
                <div className="form-group">
                  <label>Current Semester</label>
                  <input 
                    type="text" 
                    value={foundStudent.semester || ''} 
                    onChange={(e) => handleUpdate('semester', e.target.value)}
                    placeholder="e.g. Semester 5"
                  />
                </div>
                <div className="form-group">
                  <label>Batch / Session</label>
                  <input 
                    type="text" 
                    value={foundStudent.batch || ''} 
                    onChange={(e) => handleUpdate('batch', e.target.value)}
                    placeholder="e.g. 2024-2025"
                  />
                </div>
              </div>
            </div>

            {/* Semester-wise Marks */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Semester-wise Results</h3>
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    handleUpdate('marks', prev => {
                      const newMarks = JSON.parse(JSON.stringify(prev || []));
                      newMarks.push({ 
                        semester: `Semester ${newMarks.length + 1}`, 
                        session: '',
                        sgpa: '', 
                        cgpa: '',
                        status: 'Result Awaited',
                        totalCredits: 30,
                        earnedCredits: 0,
                        subjects: []
                      });
                      return newMarks;
                    });
                  }}
                  style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}
                >
                  <Plus size={14} style={{ marginRight: 4 }}/> Add Semester
                </button>
              </div>

              {(foundStudent.marks || []).map((sem, sIdx) => (
                <div key={sIdx} className="semester-editor-card">
                  <div className="semester-editor-header">
                    <h4>
                      <input 
                        type="text" 
                        value={sem.semester} 
                        onChange={(e) => {
                          handleUpdate('marks', prev => {
                                const newMarks = JSON.parse(JSON.stringify(prev || []));
                          newMarks[sIdx].semester = e.target.value;
                          return newMarks;
                              });
                        }}
                        style={{ border: 'none', background: 'transparent', fontWeight: 'bold', color: 'inherit', width: '120px' }}
                      />
                    </h4>
                    <button 
                      className="btn-delete"
                      onClick={() => {
                        handleUpdate('marks', prev => {
                          const newMarks = JSON.parse(JSON.stringify(prev || []));
                          return newMarks.filter((_, idx) => idx !== sIdx);
                        });
                      }}
                      style={{ padding: '4px 8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="form-grid" style={{ marginBottom: '1rem' }}>
                    <div className="form-group">
                      <label>Session</label>
                      <input type="text" value={sem.session || ''} onChange={(e) => {
                        handleUpdate('marks', prev => {
                                const newMarks = JSON.parse(JSON.stringify(prev || []));
                        newMarks[sIdx].session = e.target.value;
                        return newMarks;
                              });
                      }} placeholder="e.g. ODD 2024-25" />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select value={sem.status || 'Pass'} onChange={(e) => {
                        handleUpdate('marks', prev => {
                                const newMarks = JSON.parse(JSON.stringify(prev || []));
                        newMarks[sIdx].status = e.target.value;
                        return newMarks;
                              });
                      }}>
                        <option>Pass</option>
                        <option>Fail</option>
                        <option>Result Awaited</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>SGPA</label>
                      <input type="text" value={sem.sgpa || ''} onChange={(e) => {
                        handleUpdate('marks', prev => {
                                const newMarks = JSON.parse(JSON.stringify(prev || []));
                        newMarks[sIdx].sgpa = e.target.value;
                        return newMarks;
                              });
                      }} />
                    </div>
                    <div className="form-group">
                      <label>CGPA</label>
                      <input type="text" value={sem.cgpa || ''} onChange={(e) => {
                        handleUpdate('marks', prev => {
                                const newMarks = JSON.parse(JSON.stringify(prev || []));
                        newMarks[sIdx].cgpa = e.target.value;
                        return newMarks;
                              });
                      }} />
                    </div>
                    <div className="form-group">
                      <label>Total Credits</label>
                      <input type="number" value={sem.totalCredits || 0} onChange={(e) => {
                        handleUpdate('marks', prev => {
                                const newMarks = JSON.parse(JSON.stringify(prev || []));
                        newMarks[sIdx].totalCredits = parseInt(e.target.value) || 0;
                        return newMarks;
                              });
                      }} />
                    </div>
                    <div className="form-group">
                      <label>Earned Credits</label>
                      <input type="number" value={sem.earnedCredits || 0} onChange={(e) => {
                        handleUpdate('marks', prev => {
                                const newMarks = JSON.parse(JSON.stringify(prev || []));
                        newMarks[sIdx].earnedCredits = parseInt(e.target.value) || 0;
                        return newMarks;
                              });
                      }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                    <h5 style={{ margin: 0, color: 'var(--text-secondary)' }}>Subjects</h5>
                    <button 
                      className="btn-primary" 
                      onClick={() => {
                        handleUpdate('marks', prev => {
                          const newMarks = JSON.parse(JSON.stringify(prev || []));
                          if (!newMarks[sIdx].subjects) newMarks[sIdx].subjects = [];
                          newMarks[sIdx].subjects.push({ code: '', name: '', cie: 0, ese: 0, total: 0, gradePoint: '0.00', grade: 'F', credits: 0, earned: 0 });
                          return newMarks;
                        });
                      }}
                      style={{ padding: '4px 8px', fontSize: '0.8rem', background: '#f0f4f8', color: '#008080', border: '1px solid #008080', borderRadius: 4, cursor: 'pointer' }}
                    >
                      <Plus size={12} style={{ marginRight: 2 }}/> Add Subject
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table className="nested-marks-table">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Subject Name</th>
                          <th>CIE</th>
                          <th>ESE</th>
                          <th>Total</th>
                          <th>Grade</th>
                          <th>Credits</th>
                          <th>Earned</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(sem.subjects || []).map((sub, subIdx) => (
                          <tr key={subIdx}>
                            <td>
                              <input type="text" value={sub.code} onChange={(e) => {
                                handleUpdate('marks', prev => {
                                const newMarks = JSON.parse(JSON.stringify(prev || []));
                                newMarks[sIdx].subjects[subIdx].code = e.target.value;
                                return newMarks;
                              });
                              }} style={{ width: '80px' }} />
                            </td>
                            <td>
                              <input type="text" value={sub.name} onChange={(e) => {
                                handleUpdate('marks', prev => {
                                const newMarks = JSON.parse(JSON.stringify(prev || []));
                                newMarks[sIdx].subjects[subIdx].name = e.target.value;
                                return newMarks;
                              });
                              }} style={{ textAlign: 'left', minWidth: '150px' }} />
                            </td>
                            <td>
                              <input type="number" value={sub.cie} onChange={(e) => {
                                handleUpdate('marks', prev => {
                                const newMarks = JSON.parse(JSON.stringify(prev || []));
                                newMarks[sIdx].subjects[subIdx].cie = parseInt(e.target.value) || 0;
                                newMarks[sIdx].subjects[subIdx].total = newMarks[sIdx].subjects[subIdx].cie + newMarks[sIdx].subjects[subIdx].ese;
                                return newMarks;
                              });
                              }} style={{ width: '60px' }} />
                            </td>
                            <td>
                              <input type="number" value={sub.ese} onChange={(e) => {
                                handleUpdate('marks', prev => {
                                const newMarks = JSON.parse(JSON.stringify(prev || []));
                                newMarks[sIdx].subjects[subIdx].ese = parseInt(e.target.value) || 0;
                                newMarks[sIdx].subjects[subIdx].total = newMarks[sIdx].subjects[subIdx].cie + newMarks[sIdx].subjects[subIdx].ese;
                                return newMarks;
                              });
                              }} style={{ width: '60px' }} />
                            </td>
                            <td>
                              <input type="number" value={sub.total} disabled style={{ background: '#f5f5f5', width: '60px' }} />
                            </td>
                            <td>
                              <input type="text" value={sub.grade} onChange={(e) => {
                                handleUpdate('marks', prev => {
                                const newMarks = JSON.parse(JSON.stringify(prev || []));
                                newMarks[sIdx].subjects[subIdx].grade = e.target.value;
                                return newMarks;
                              });
                              }} style={{ width: '50px' }} />
                            </td>
                            <td>
                              <input type="number" value={sub.credits} onChange={(e) => {
                                handleUpdate('marks', prev => {
                                const newMarks = JSON.parse(JSON.stringify(prev || []));
                                newMarks[sIdx].subjects[subIdx].credits = parseInt(e.target.value) || 0;
                                return newMarks;
                              });
                              }} style={{ width: '60px' }} />
                            </td>
                            <td>
                              <input type="number" value={sub.earned} onChange={(e) => {
                                handleUpdate('marks', prev => {
                                const newMarks = JSON.parse(JSON.stringify(prev || []));
                                newMarks[sIdx].subjects[subIdx].earned = parseFloat(e.target.value) || 0;
                                return newMarks;
                              });
                              }} style={{ width: '60px' }} />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button 
                                onClick={() => {
                                  handleUpdate('marks', prev => {
                                    const newMarks = JSON.parse(JSON.stringify(prev || []));
                                    newMarks[sIdx].subjects = newMarks[sIdx].subjects.filter((_, idx) => idx !== subIdx);
                                    return newMarks;
                                  });
                                }}
                                style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {(!sem.subjects || sem.subjects.length === 0) && (
                          <tr>
                            <td colSpan="9" style={{ textAlign: 'center', padding: '1rem', color: '#888' }}>
                              No subjects added for this semester.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              {(!foundStudent.marks || foundStudent.marks.length === 0) && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666', background: 'var(--glass-bg)', borderRadius: 12 }}>
                  No semesters added yet.
                </div>
              )}
            </div>
          </div>
        );
      case 'attendance':
        return (
          <div className="form-grid fade-in-tab" style={{ display: 'block' }}>
            <div className="form-grid" style={{ marginBottom: '20px' }}>
              <div className="form-group">
                <label>Overall Theory Attendance (%)</label>
                <input 
                  type="number" 
                  value={foundStudent.attendance?.theory ?? 0} 
                  onChange={(e) => handleUpdate('theory', parseInt(e.target.value) || 0, 'attendance')}
                />
              </div>
              <div className="form-group">
                <label>Overall Practical Attendance (%)</label>
                <input 
                  type="number" 
                  value={foundStudent.attendance?.practical ?? 0} 
                  onChange={(e) => handleUpdate('practical', parseInt(e.target.value) || 0, 'attendance')}
                />
              </div>
            </div>

            <div className="subjects-editor">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>Subject-wise Attendance</h3>
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    handleUpdate('subjects', prev => {
                      const newSubjects = JSON.parse(JSON.stringify(prev || []));
                      newSubjects.push({ code: '', name: '', attended: 0, total: 30 });
                      return newSubjects;
                    }, 'attendance');
                  }}
                  style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}
                >
                  <Plus size={14} style={{ marginRight: 4 }}/> Add Subject
                </button>
              </div>
              <table className="marks-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Subject Name</th>
                    <th>Attended</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(foundStudent.attendance?.subjects || []).map((sub, i) => (
                    <tr key={i}>
                      <td>
                        <input 
                          type="text" 
                          value={sub.code} 
                          onChange={(e) => {
                            handleUpdate('subjects', prev => {
                            const newSubjects = JSON.parse(JSON.stringify(prev || []));
                            newSubjects[i].code = e.target.value;
                            return newSubjects;
                          }, 'attendance');
                          }}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          value={sub.name} 
                          onChange={(e) => {
                            handleUpdate('subjects', prev => {
                            const newSubjects = JSON.parse(JSON.stringify(prev || []));
                            newSubjects[i].name = e.target.value;
                            return newSubjects;
                          }, 'attendance');
                          }}
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          value={sub.attended} 
                          onChange={(e) => {
                            handleUpdate('subjects', prev => {
                            const newSubjects = JSON.parse(JSON.stringify(prev || []));
                            newSubjects[i].attended = parseInt(e.target.value) || 0;
                            return newSubjects;
                          }, 'attendance');
                          }}
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          value={sub.total} 
                          onChange={(e) => {
                            handleUpdate('subjects', prev => {
                            const newSubjects = JSON.parse(JSON.stringify(prev || []));
                            newSubjects[i].total = parseInt(e.target.value) || 0;
                            return newSubjects;
                          }, 'attendance');
                          }}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          className="btn-delete"
                          onClick={() => {
                            handleUpdate('subjects', prev => {
                              const newSubjects = JSON.parse(JSON.stringify(prev || []));
                              return newSubjects.filter((_, idx) => idx !== i);
                            }, 'attendance');
                          }}
                          style={{ padding: '4px 8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 4, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!foundStudent.attendance?.subjects || foundStudent.attendance.subjects.length === 0) && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: '#666', padding: '1rem' }}>
                        No subjects added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'fees':
        return (
          <div className="fade-in-tab" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="form-grid">
              <div className="form-group">
                <label>Total Fee Amount</label>
                <input 
                  type="number" 
                  value={foundStudent.fees?.total ?? 0} 
                  onChange={(e) => {
                    const newTotal = parseInt(e.target.value) || 0;
                    setFoundStudent(prev => ({
                      ...prev,
                      fees: {
                        ...prev.fees,
                        total: newTotal,
                        due: newTotal - (parseInt(prev.fees?.paid) || 0)
                      }
                    }));
                  }}
                />
              </div>
              <div className="form-group">
                <label>Paid Amount</label>
                <input 
                  type="number" 
                  value={foundStudent.fees?.paid ?? 0} 
                  onChange={(e) => {
                    const newPaid = parseInt(e.target.value) || 0;
                    setFoundStudent(prev => ({
                      ...prev,
                      fees: {
                        ...prev.fees,
                        paid: newPaid,
                        due: (parseInt(prev.fees?.total) || 0) - newPaid
                      }
                    }));
                  }}
                />
              </div>
              <div className="form-group">
                <label>Due Amount</label>
                <input 
                  type="number" 
                  value={foundStudent.fees.due} 
                  readOnly
                />
              </div>
            </div>

            <div className="subjects-editor">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>Transaction History</h3>
                {foundStudent.fees?.transactions?.length > 0 && (
                  <button 
                    type="button"
                    title="Clear All History"
                    style={{ background: '#fee2e2', color: '#dc2626', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', border: '1px solid #fca5a5', cursor: 'pointer' }}
                    onClick={async () => {
                      const updatedStudent = {
                        ...foundStudent,
                        fees: {
                          ...foundStudent.fees,
                          paid: 0,
                          due: parseInt(foundStudent.fees?.total) || 0,
                          transactions: []
                        }
                      };
                      setFoundStudent(updatedStudent);
                      await saveStudent(updatedStudent.enrollmentNo, updatedStudent);
                    }}
                  >
                    <Trash2 size={14} style={{ marginRight: 6 }} /> Clear All History
                  </button>
                )}
              </div>
              {(!foundStudent.fees?.transactions || foundStudent.fees.transactions.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666', background: 'var(--glass-bg)', borderRadius: 12 }}>
                  No payment history recorded yet.
                </div>
              ) : (
                <table className="marks-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Transaction ID</th>
                      <th>Particulars</th>
                      <th>Amount</th>
                      <th style={{ width: 60, textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foundStudent.fees.transactions.map((txn, idx) => (
                      <tr key={txn.id + idx}>
                        <td>{txn.date}</td>
                        <td style={{ fontFamily: 'monospace' }}>{txn.id}</td>
                        <td>{txn.head}</td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {txn.amount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            type="button"
                            className="btn-delete-row"
                            title="Delete Transaction"
                            onClick={async () => {
                              const newTxns = foundStudent.fees.transactions.filter((_, i) => i !== idx);
                              const newPaid = Math.max(0, (parseInt(foundStudent.fees.paid) || 0) - (parseInt(txn.amount) || 0));
                              const updatedStudent = {
                                ...foundStudent,
                                fees: {
                                  ...foundStudent.fees,
                                  paid: newPaid,
                                  due: (parseInt(foundStudent.fees.total) || 0) - newPaid,
                                  transactions: newTxns
                                }
                              };
                              setFoundStudent(updatedStudent);
                              await saveStudent(updatedStudent.enrollmentNo, updatedStudent);
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // ── Database View Renderer ──────────────────────────────────────────────────
  const renderDatabaseView = () => {
    const q = dbSearch.trim().toLowerCase();
    const filtered = dbStudents.filter(s =>
      !q ||
      (s.name || '').toLowerCase().includes(q) ||
      (s.enrollmentNo || '').toLowerCase().includes(q) ||
      (s.degree || '').toLowerCase().includes(q) ||
      (s.branch || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q)
    );

    const totalFeesPaid = dbStudents.reduce((sum, s) => sum + (s.fees?.paid || 0), 0);
    const totalFeesDue  = dbStudents.reduce((sum, s) => sum + (s.fees?.due  || 0), 0);
    const programs = [...new Set(dbStudents.map(s => s.degree).filter(Boolean))];

    const fmt = (n) => n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

    const openInEditor = (student) => {
      setFoundStudent(student);
      setSearchQuery(student.enrollmentNo);
      setActiveTab('personal');
      setAdminView('edit');
    };

    return (
      <div className="db-view fade-in-tab">
        {/* Stats Row */}
        <div className="db-stats-row">
          <div className="db-stat-card db-stat-blue">
            <div className="db-stat-icon"><Users size={22} /></div>
            <div>
              <p className="db-stat-num">{dbStudents.length}</p>
              <p className="db-stat-label">Total Students</p>
            </div>
          </div>
          <div className="db-stat-card db-stat-green">
            <div className="db-stat-icon"><IndianRupee size={22} /></div>
            <div>
              <p className="db-stat-num">{fmt(totalFeesPaid)}</p>
              <p className="db-stat-label">Fees Collected</p>
            </div>
          </div>
          <div className="db-stat-card db-stat-red">
            <div className="db-stat-icon"><AlertCircle size={22} /></div>
            <div>
              <p className="db-stat-num">{fmt(totalFeesDue)}</p>
              <p className="db-stat-label">Fees Outstanding</p>
            </div>
          </div>
          <div className="db-stat-card db-stat-purple">
            <div className="db-stat-icon"><BookOpen size={22} /></div>
            <div>
              <p className="db-stat-num">{programs.length}</p>
              <p className="db-stat-label">Programs Offered</p>
            </div>
          </div>
        </div>

        {/* Table Toolbar */}
        <div className="db-toolbar">
          <div className="db-toolbar-left">
            <Search size={16} style={{ color: '#94a3b8' }} />
            <input
              className="db-search-input"
              placeholder="Filter by name, enrollment, degree, branch…"
              value={dbSearch}
              onChange={e => setDbSearch(e.target.value)}
            />
          </div>
          <div className="db-toolbar-right">
            <span className="db-count">{filtered.length} of {dbStudents.length} records</span>
            <button className="db-refresh-btn" onClick={loadDatabaseView} title="Refresh">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="db-table-wrapper">
          {dbLoading ? (
            <div className="db-loading">
              <div className="db-spinner" />
              <p>Loading database…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="db-empty">
              <Database size={40} style={{ color: '#cbd5e1' }} />
              <p>No records found.</p>
            </div>
          ) : (
            <table className="db-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Enrollment No.</th>
                  <th>Name</th>
                  <th>Degree</th>
                  <th>Branch</th>
                  <th>Semester</th>
                  <th>Batch</th>
                  <th>Phone</th>
                  <th>Fees Paid</th>
                  <th>Fees Due</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student, idx) => (
                  <tr key={student.enrollmentNo || idx} className="db-row">
                    <td className="db-td-num">{idx + 1}</td>
                    <td>
                      <span className="db-enroll-badge">{student.enrollmentNo}</span>
                    </td>
                    <td>
                      <div className="db-name-cell">
                        <img
                          src={student.image || 'https://i.pravatar.cc/36'}
                          alt=""
                          className="db-avatar"
                          onError={e => { e.target.src = 'https://i.pravatar.cc/36'; }}
                        />
                        <div>
                          <p className="db-name">{student.name || '—'}</p>
                          <p className="db-email">{student.email || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td>{student.degree || '—'}</td>
                    <td>{student.branch || '—'}</td>
                    <td><span className="db-sem-badge">{student.semester || '—'}</span></td>
                    <td>{student.batch || '—'}</td>
                    <td>{student.phone || '—'}</td>
                    <td className="db-td-green">{student.fees?.paid ? fmt(student.fees.paid) : '—'}</td>
                    <td className={student.fees?.due > 0 ? 'db-td-red' : ''}>
                      {student.fees?.due > 0 ? fmt(student.fees.due) : <span className="db-paid-tag">Paid ✓</span>}
                    </td>
                    <td>
                      <button
                        className="db-edit-btn"
                        onClick={() => openInEditor(student)}
                        title="Edit this student"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };


  return (
    <div className="admin-page">
      {/* ── Admin Top Navbar ── */}
      <nav className="admin-navbar">
        <div className="admin-nav-brand">
          <ShieldCheck size={20} />
          <span>Admin Portal</span>
          <span className="admin-nav-badge">Arka Jain University</span>
        </div>
        <div className="admin-nav-actions">
          <Link to="/dashboard" className="admin-nav-link">
            <LayoutDashboard size={16} /> Student Portal
          </Link>
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </nav>

      {/* ── Page Content ── */}
      <main className="admin-main">
        <div className="admin-container">
          <header className="admin-header">
            <div className="admin-header-left">
              <ShieldCheck size={26} className="header-shield" />
              <div>
                <h1>Administrative Portal</h1>
                <p className="admin-subtitle">Student Data Management System</p>
              </div>
            </div>
            {/* View Toggle */}
            <div className="admin-view-toggle">
              <button
                className={`view-toggle-btn ${adminView === 'edit' ? 'active' : ''}`}
                onClick={() => setAdminView('edit')}
              >
                <Edit3 size={16} /> Edit Student
              </button>
              <button
                className={`view-toggle-btn ${adminView === 'database' ? 'active' : ''}`}
                onClick={() => setAdminView('database')}
              >
                <Database size={16} /> View Database
              </button>
            </div>
          </header>


          {/* ── Database View ── */}
          {adminView === 'database' ? (
            <div className="fade-in-tab">
              {renderDatabaseView()}
            </div>
          ) : (
            <div className="fade-in-tab">
              {/* Search Bar */}
              <section className="search-section">
                <Search className="text-gray-400" size={20} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Enter Student Enrollment No. (e.g. AJU/241051)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="btn-search" onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? 'Searching...' : 'Search Student'}
                </button>
                <button className="btn-create" onClick={handleCreateNewStudent}>
                  + Add New Student
                </button>
              </section>

              {/* Edit Workspace */}
              {foundStudent ? (
                <div className="edit-workspace fade-in-tab">
                  <nav className="tabs-nav">
                    <button
                      className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                      onClick={() => setActiveTab('personal')}
                    >
                      <User size={18} /> Personal Details
                    </button>
                    <button
                      className={`tab-btn ${activeTab === 'academic' ? 'active' : ''}`}
                      onClick={() => setActiveTab('academic')}
                    >
                      <GraduationCap size={18} /> Academic Record
                    </button>
                    <button
                      className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
                      onClick={() => setActiveTab('attendance')}
                    >
                      <Calendar size={18} /> Attendance
                    </button>
                    <button
                      className={`tab-btn ${activeTab === 'fees' ? 'active' : ''}`}
                      onClick={() => setActiveTab('fees')}
                    >
                      <CreditCard size={18} /> Fees Management
                    </button>
                  </nav>

                  <div className="tab-content">
                    {renderTabContent()}
                  </div>

                  <div className="save-section">
                    <button
                      className={`btn-save ${saveSuccess ? 'success' : ''}`}
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving Changes...' : saveSuccess ? '✓ Saved!' : (
                        <><Save size={20} /> Save All Changes</>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="admin-idle-state fade-in-tab">
                  <div className="idle-icon-wrap">
                    <Search size={40} />
                  </div>
                  <h3>Search to start editing</h3>
                  <p>Enter a student&apos;s enrollment number above to load their profile, or click <strong>+ Add New Student</strong> to create a new record.</p>
                  <button
                    className="idle-db-link"
                    onClick={() => setAdminView('database')}
                  >
                    <Database size={16} /> Or browse all students in View Database
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
