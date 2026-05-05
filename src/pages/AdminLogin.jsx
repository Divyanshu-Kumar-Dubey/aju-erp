import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import './AdminLogin.css';

const ADMIN_EMAIL = 'admin@aju.edu';
const ADMIN_PASSWORD = 'admin@123';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Call parent handler to update auth state in App
        onLogin();
        navigate('/admin-panel', { replace: true });
      } else {
        setError('Invalid credentials. Please try again.');
        setIsSubmitting(false);
      }
    }, 700);
  };

  return (
    <div className="admin-login-wrapper">
      <Helmet>
        <title>Admin Login | AJU ERP</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <motion.div 
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="login-card"
      >
        <div className="login-header">
          <div className="login-icon">
            <ShieldCheck size={30} />
          </div>
          <h2>Admin Portal</h2>
          <p>Sign in to manage student records</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-box">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input 
                type="email" 
                placeholder="admin@aju.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="input-box">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input 
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button type="button" className="eye-btn" onClick={() => setShowPass(p => !p)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="error-alert"
            >
              <AlertCircle size={14} /> {error}
            </motion.div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="btn-spinner">
                <span className="spinner" /> Authenticating...
              </span>
            ) : 'Sign In as Admin'}
          </button>
        </form>

        <Link to="/dashboard" className="back-home">
          <ArrowLeft size={14} style={{ display: 'inline', marginRight: '4px' }} /> 
          Back to Student ERP
        </Link>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
