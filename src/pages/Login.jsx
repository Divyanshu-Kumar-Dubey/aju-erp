import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { validateStudentLogin, setStudentSession } from '../data/studentStore';
import './Login.css';


const FloatingParticle = ({ style }) => (
  <motion.div
    className="particle"
    style={style}
    animate={{ y: [-20, -80, -20], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
    transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
  />
);

export default function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState({ user: '', pass: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const student = await validateStudentLogin(formState.user.trim(), formState.pass);
      if (student) {
        setStudentSession(student.enrollmentNo);
        navigate('/dashboard');
      } else {
        setError('Invalid enrollment number or password. Try AJU/241051 / student@123');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Please check your internet and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <Helmet>
        <title>Student Login | Arka Jain University ERP Portal</title>
        <meta name="description" content="Login to the official Arka Jain University Student ERP Portal. Enter your enrollment number and password to access your dashboard, attendance, results, timetable, and fee details." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Animated gradient background */}
      <div className="login-bg">
        <div className="mesh-blob blob-1" />
        <div className="mesh-blob blob-2" />
        <div className="mesh-blob blob-3" />
      </div>

      {/* Floating particles (faint in light theme) */}
      {[...Array(12)].map((_, i) => (
        <FloatingParticle key={i} style={{ left: `${8 + i * 7.5}%`, bottom: '10%' }} />
      ))}

      {/* Grid overlay */}
      <div className="grid-overlay" />

      <div className="login-wrapper">
        {/* Left panel: Branding -> Kept Dark Navy for contrast */}
        <motion.div
          className="login-brand-panel"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            className="brand-logo"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span>JGI</span>
          </motion.div>
          <h1 className="brand-title">
            ARKA JAIN<br />
            <span className="brand-highlight">University</span>
          </h1>
          <p className="brand-sub">Jharkhand&apos;s Premier Institution since 1995</p>

          <div className="brand-stats">
            {[
              { num: '15K+', label: 'Students' },
              { num: '200+', label: 'Faculty' },
              { num: '50+', label: 'Courses' },
            ].map((s, i) => (
              <motion.div
                key={i}
                className="brand-stat"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.15 }}
              >
                <span className="stat-num">{s.num}</span>
                <span className="stat-label">{s.label}</span>
              </motion.div>
            ))}
          </div>

          <div className="brand-badge">
            <Sparkles size={16} />
            <span>NAAC Accredited Institution</span>
          </div>
        </motion.div>

        {/* Right panel: Login form -> White modern theme */}
        <motion.div
          className="login-form-panel glass-card-light"
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="form-header">
            <p className="form-eyebrow">Welcome back</p>
            <h2 className="form-title">Student Portal</h2>
            <p className="form-desc">Sign in to continue to your ERP dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-field">
              <label>Enrollment Number</label>
              <div className="input-wrap">
                <User size={18} className="field-icon" />
                <input
                  type="text"
                  placeholder="e.g. AJU/241051"
                  value={formState.user}
                  onChange={e => setFormState({ ...formState, user: e.target.value })}
                  required
                  autoComplete="username"
                />
                <div className="input-focus-bar" />
              </div>
            </div>

            <div className="form-field">
              <label>Password</label>
              <div className="input-wrap">
                <Lock size={18} className="field-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formState.pass}
                  onChange={e => setFormState({ ...formState, pass: e.target.value })}
                  required
                />
                <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <div className="input-focus-bar" />
              </div>
            </div>

            <div className="form-options">
              <label className="remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot">Forgot Password?</a>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="login-error"
              >
                <AlertCircle size={14} /> {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="login-btn"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loading" className="btn-spinner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
                ) : (
                  <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="btn-content">
                    Sign In <ArrowRight size={18} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          <p className="form-footer">
            Powered by <strong>MasterSoft ERP</strong> · © 2026 All rights reserved
          </p>
        </motion.div>
      </div>
    </div>
  );
}
