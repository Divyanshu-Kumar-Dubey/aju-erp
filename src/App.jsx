import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';

// Lazy-loaded pages — each page's JS is only fetched on first visit
const Login              = lazy(() => import('./pages/Login'));
const Dashboard          = lazy(() => import('./pages/Dashboard'));
const Profile            = lazy(() => import('./pages/Profile'));
const StudentInformation = lazy(() => import('./pages/StudentInformation'));
const StudentCompleteDetail = lazy(() => import('./pages/StudentCompleteDetail'));
const Result             = lazy(() => import('./pages/Result'));
const NoDuesForm         = lazy(() => import('./pages/NoDuesForm'));
const OnlinePayment      = lazy(() => import('./pages/OnlinePayment'));
const AdminPanel         = lazy(() => import('./pages/AdminPanel'));
const AdminLogin         = lazy(() => import('./pages/AdminLogin'));

// Full-screen loading fallback shown while a lazy chunk is downloading
function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: 'var(--bg-color)',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid var(--brand-navy-pale)',
        borderTopColor: 'var(--brand-navy)',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// Protected route wrapper that reads auth state reactively
const ProtectedAdminRoute = ({ isAdminAuth }) => {
  return isAdminAuth ? <AdminPanel /> : <Navigate to="/admin-login" replace />;
};

function App() {
  const [isAdminAuth, setIsAdminAuth] = useState(
    () => localStorage.getItem('adminAuth') === 'true'
  );

  const handleAdminLogin = () => {
    localStorage.setItem('adminAuth', 'true');
    setIsAdminAuth(true);
  };



  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/student-information" element={<StudentInformation />} />
          <Route path="/student-complete-detail" element={<StudentCompleteDetail />} />
          <Route path="/result" element={<Result />} />
          <Route path="/no-dues-form" element={<NoDuesForm />} />
          <Route path="/online-payment" element={<OnlinePayment />} />
          <Route 
            path="/admin-login" 
            element={
              isAdminAuth 
                ? <Navigate to="/admin-panel" replace />
                : <AdminLogin onLogin={handleAdminLogin} />
            } 
          />
          <Route 
            path="/admin-panel" 
            element={<ProtectedAdminRoute isAdminAuth={isAdminAuth} />} 
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
