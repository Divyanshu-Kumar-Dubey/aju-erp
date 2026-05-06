import { useState } from 'react';
import { Home, ChevronRight, CreditCard, Smartphone, Building2, IndianRupee,
         CheckCircle2, Clock, AlertCircle, Download, Printer, Shield, X,
         XCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import { useStudentSession, saveStudent } from '../data/studentStore';
import { useRazorpay } from '../hooks/useRazorpay';
import './OnlinePayment.css';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

const PAYMENT_METHODS = [
  { id: 'upi',      icon: Smartphone,  label: 'UPI',          desc: 'PhonePe, GPay, Paytm' },
  { id: 'card',     icon: CreditCard,  label: 'Debit / Credit Card', desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbank',  icon: Building2,   label: 'Net Banking',  desc: 'All major banks' },
];

const FEE_HEADS = [
  { label: 'Tuition Fee',      due: 30000 },
  { label: 'Exam Fee',         due: 5000  },
  { label: 'Library Fee',      due: 2000  },
  { label: 'Sports & Culture', due: 1500  },
  { label: 'Hostel Fee',       due: 1500  },
];

// Dynamic transactions are now managed in state

export default function OnlinePayment() {
  const [collapsed, setCollapsed] = useState(false);
  const offset = collapsed ? 72 : 260;
  const student = useStudentSession();
  const { isLoaded, loadError, openRazorpay } = useRazorpay();

  const initialPaid = student?.fees?.paid ?? 80000;
  const initialTransactions = student?.fees?.transactions || (
    initialPaid === 80000 ? [
      { id: 'AJU-2024-0891', date: '12 Jan 2025', amount: 45000, head: 'Tuition Fee (Sem 1)', status: 'Success' },
      { id: 'AJU-2024-0512', date: '08 Jul 2024', amount: 35000, head: 'Tuition Fee (Sem 2)', status: 'Success' }
    ] : initialPaid > 0 ? [
      { id: 'AJU-SYS-ADJ', date: 'Previous', amount: initialPaid, head: 'Consolidated Past Payments', status: 'Success' }
    ] : []
  );

  const [fees, setFees] = useState({
    total: student?.fees?.total ?? 120000,
    paid: initialPaid,
    due: student?.fees?.due ?? 40000,
    transactions: initialTransactions
  });

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedHeads, setSelectedHeads]   = useState({});
  // steps: 'select' | 'confirm' | 'processing' | 'success' | 'failed'
  const [step, setStep]                     = useState('select');
  const [upiId, setUpiId]                   = useState('');
  const [cardNo, setCardNo]                 = useState('');
  const [cardExp, setCardExp]               = useState('');
  const [cardCvv, setCardCvv]               = useState('');
  const [cardName, setCardName]             = useState('');
  const [bankCode, setBankCode]             = useState('');
  const [txnId, setTxnId]                   = useState('');
  const [paymentError, setPaymentError]     = useState('');

  const totalSelected = Object.entries(selectedHeads)
    .filter(([, v]) => v)
    .reduce((acc, [key]) => {
      const fh = FEE_HEADS.find(f => f.label === key);
      return acc + (fh?.due || 0);
    }, 0);

  const toggleHead = (label) => {
    setSelectedHeads(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handlePay = () => {
    if (!selectedMethod || totalSelected === 0) return;
    setStep('confirm');
  };

  const handleConfirm = () => {
    // Guard: key not configured
    if (!RAZORPAY_KEY || RAZORPAY_KEY === 'rzp_test_YOUR_KEY_ID_HERE') {
      setPaymentError(
        'Razorpay Key ID is not configured.\n' +
        'Open .env.local, replace VITE_RAZORPAY_KEY_ID with your test key, then restart the dev server.\n\n' +
        'To get a free test key: https://dashboard.razorpay.com/ → Settings → API Keys'
      );
      setStep('failed');
      return;
    }

    // Guard: SDK not ready
    if (!isLoaded) {
      setPaymentError(loadError || 'Payment gateway is still loading — please try again in a moment.');
      setStep('failed');
      return;
    }

    // Show "Opening gateway…" for 500 ms, then open the modal
    setStep('processing');
    setTimeout(() => {
      openRazorpay({
        key:         RAZORPAY_KEY,
        amount:      totalSelected * 100, // Razorpay expects paise
        currency:    'INR',
        name:        'Arka Jain University',
        description: Object.keys(selectedHeads).filter(k => selectedHeads[k]).join(', '),
        image:       '/favicon.ico',
        prefill: {
          name:    student?.name    || '',
          email:   student?.email   || '',
          contact: student?.mobile  || '',
        },
        notes: { enrollment_no: student?.enrollmentNo || '' },
        theme: { color: '#008080' },
        modal: {
          backdropclose: false,
          escape:        true,
          // If student closes modal without paying → go back to confirm
          ondismiss: () => setStep('confirm'),
        },
        // ✅ Payment successful
        handler: (response) => {
          setTxnId(response.razorpay_payment_id);
          const newTxn = {
            id: response.razorpay_payment_id,
            date: new Date().toLocaleDateString('en-IN'),
            amount: totalSelected,
            head: Object.keys(selectedHeads).filter(k => selectedHeads[k]).join(', '),
            status: 'Success'
          };
          const newFees = { 
            total: fees.total, 
            paid: fees.paid + totalSelected, 
            due: fees.total - (fees.paid + totalSelected),
            transactions: [newTxn, ...(fees.transactions || [])]
          };
          setFees(newFees);
          if (student?.enrollmentNo) {
            saveStudent(student.enrollmentNo, { ...student, fees: newFees });
          }
          setStep('success');
        },
        // ❌ Payment failed
        onPaymentFailed: (error) => {
          setPaymentError(error.description || 'Payment was declined. Please try a different method.');
          setStep('failed');
        },
      });
    }, 500);
  };

  const handleReset = () => {
    setStep('select');
    setSelectedMethod(null);
    setSelectedHeads({});
    setUpiId('');
    setCardNo('');
    setCardExp('');
    setCardCvv('');
    setCardName('');
    setBankCode('');
    setPaymentError('');
    setTxnId('');
  };

  const fmtINR = (n) => '₹' + Number(n).toLocaleString('en-IN');

  const paidPct = fees.total > 0 ? Math.round((fees.paid / fees.total) * 100) : 0;

  return (
    <div className="layout-root">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="main-content" style={{ marginLeft: offset }}>
        <TopBar collapsed={collapsed} />

        <div className="op-page-root">
          {/* ── Breadcrumb ── */}
          <div className="op-breadcrumb">
            <div className="op-bc-item"><Home size={14} /><span>Academic</span></div>
            <ChevronRight size={14} className="op-bc-sep" />
            <div className="op-bc-item"><span>Student Related</span></div>
            <ChevronRight size={14} className="op-bc-sep" />
            <div className="op-bc-item op-bc-active"><span>Online Payment</span></div>
          </div>

          {/* ── Fee Summary Cards ── */}
          <div className="op-summary-row">
            {[
              { label: 'Total Fees', value: fees.total, color: '#4a5568', icon: '🎓' },
              { label: 'Amount Paid', value: fees.paid,  color: '#38a169', icon: '✅' },
              { label: 'Amount Due',  value: fees.total - fees.paid,   color: '#e53e3e', icon: '⚠️' },
            ].map(({ label, value, color, icon }) => (
              <motion.div
                key={label}
                className="op-summary-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <span className="op-sc-icon">{icon}</span>
                <div>
                  <div className="op-sc-label">{label}</div>
                  <div className="op-sc-value" style={{ color }}>{fmtINR(value)}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Progress Bar ── */}
          <motion.div
            className="op-progress-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="op-progress-header">
              <span>Payment Progress</span>
              <span className="op-progress-pct">{paidPct}% Paid</span>
            </div>
            <div className="op-progress-bar">
              <motion.div
                className="op-progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${paidPct}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </motion.div>

          <div className="op-body-grid">
            {/* ── Left: Payment Panel ── */}
            <motion.div
              className="op-payment-panel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="op-panel-header">
                <IndianRupee size={18} color="#008080" />
                <h2>Make a Payment</h2>
              </div>

              <AnimatePresence mode="wait">
                {/* ── STEP 1: SELECT ── */}
                {step === 'select' && (
                  <motion.div key="select"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                    {/* Fee Heads */}
                    <div className="op-section-title">Select Fee Heads</div>
                    <div className="op-fee-list">
                      {FEE_HEADS.map(fh => (
                        <label key={fh.label} className={`op-fee-item ${selectedHeads[fh.label] ? 'op-fee-selected' : ''}`}>
                          <input
                            type="checkbox"
                            checked={!!selectedHeads[fh.label]}
                            onChange={() => toggleHead(fh.label)}
                          />
                          <span className="op-fee-name">{fh.label}</span>
                          <span className="op-fee-amt">{fmtINR(fh.due)}</span>
                        </label>
                      ))}
                    </div>

                    {/* Payment Method */}
                    <div className="op-section-title" style={{ marginTop: '1.5rem' }}>Select Payment Method</div>
                    <div className="op-method-list">
                      {PAYMENT_METHODS.map(pm => {
                        const Icon = pm.icon;
                        return (
                          <button
                            key={pm.id}
                            className={`op-method-btn ${selectedMethod === pm.id ? 'op-method-active' : ''}`}
                            onClick={() => setSelectedMethod(pm.id)}
                          >
                            <Icon size={22} />
                            <div>
                              <div className="op-method-label">{pm.label}</div>
                              <div className="op-method-desc">{pm.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Method-specific inputs */}
                    <AnimatePresence>
                      {selectedMethod === 'upi' && (
                        <motion.div key="upi" className="op-input-group"
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                          <label className="op-input-label">UPI ID</label>
                          <input className="op-input" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
                        </motion.div>
                      )}
                      {selectedMethod === 'card' && (
                        <motion.div key="card" className="op-input-group"
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                          <label className="op-input-label">Cardholder Name</label>
                          <input className="op-input" placeholder="Name on card" value={cardName} onChange={e => setCardName(e.target.value)} />
                          <label className="op-input-label" style={{ marginTop: '0.75rem' }}>Card Number</label>
                          <input className="op-input" placeholder="XXXX XXXX XXXX XXXX" maxLength={19}
                            value={cardNo}
                            onChange={e => setCardNo(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())} />
                          <div className="op-card-row">
                            <div>
                              <label className="op-input-label">Expiry</label>
                              <input className="op-input" placeholder="MM/YY" maxLength={5} value={cardExp}
                                onChange={e => setCardExp(e.target.value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2'))} />
                            </div>
                            <div>
                              <label className="op-input-label">CVV</label>
                              <input className="op-input" placeholder="•••" type="password" maxLength={3} value={cardCvv}
                                onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                      {selectedMethod === 'netbank' && (
                        <motion.div key="netbank" className="op-input-group"
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                          <label className="op-input-label">Select Bank</label>
                          <select className="op-select" value={bankCode} onChange={e => setBankCode(e.target.value)}>
                            <option value="">-- Choose your bank --</option>
                            <option value="SBI">State Bank of India</option>
                            <option value="HDFC">HDFC Bank</option>
                            <option value="ICICI">ICICI Bank</option>
                            <option value="AXIS">Axis Bank</option>
                            <option value="PNB">Punjab National Bank</option>
                            <option value="BOB">Bank of Baroda</option>
                          </select>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Pay Button */}
                    <div className="op-pay-footer">
                      <div className="op-total-row">
                        <span>Total Payable</span>
                        <span className="op-total-val">{fmtINR(totalSelected)}</span>
                      </div>
                      <button
                        className="op-pay-btn"
                        onClick={handlePay}
                        disabled={!selectedMethod || totalSelected === 0}
                      >
                        <Shield size={16} />
                        Proceed to Pay Securely
                      </button>
                      <p className="op-secure-note">
                        🔒 256-bit SSL encrypted · PCI-DSS compliant
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 2: CONFIRM ── */}
                {step === 'confirm' && (
                  <motion.div key="confirm"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="op-confirm-box">
                      <div className="op-confirm-title">Confirm Payment</div>
                      <div className="op-confirm-rows">
                        <div className="op-confirm-row"><span>Name</span><strong>{student?.name || 'Ansh Kumar'}</strong></div>
                        <div className="op-confirm-row"><span>Enrollment No.</span><strong>{student?.enrollmentNo || 'AJU/241051'}</strong></div>
                        <div className="op-confirm-row"><span>Method</span>
                          <strong>{PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label}</strong>
                        </div>
                        {Object.entries(selectedHeads).filter(([,v]) => v).map(([k]) => (
                          <div className="op-confirm-row" key={k}>
                            <span>{k}</span>
                            <strong>{fmtINR(FEE_HEADS.find(f => f.label === k)?.due || 0)}</strong>
                          </div>
                        ))}
                        <div className="op-confirm-row op-confirm-total">
                          <span>Total Amount</span>
                          <strong>{fmtINR(totalSelected)}</strong>
                        </div>
                      </div>

                      <div className="op-confirm-actions">
                        <button className="op-cancel-btn" onClick={() => setStep('select')}>
                          <X size={16} /> Edit
                        </button>
                        <button className="op-pay-btn" onClick={handleConfirm}>
                          <Shield size={16} /> Confirm & Pay
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 3: PROCESSING ── */}
                {step === 'processing' && (
                  <motion.div key="processing"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="op-processing-wrap">
                    <div className="op-spinner" />
                    <p className="op-processing-text">Opening secure gateway…</p>
                    <p className="op-processing-sub">You will be redirected to Razorpay. Do not close this window.</p>
                  </motion.div>
                )}

                {/* ── STEP 4: SUCCESS ── */}
                {step === 'success' && (
                  <motion.div key="success"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="op-success-wrap">
                    
                    <div className="op-formal-receipt" id="printable-receipt">
                      <div className="receipt-header">
                        <div className="receipt-logo-wrap">
                           <div className="receipt-logo">JGI</div>
                        </div>
                        <div className="receipt-uni-details">
                          <h2>ARKA JAIN University</h2>
                          <p>Mohanpur, Gamharia, Dist - Seraikela Kharsawan, Jharkhand - 832108</p>
                          <p className="receipt-title">FEE RECEIPT</p>
                        </div>
                      </div>
                      
                      <div className="receipt-meta">
                        <div><span>Receipt No:</span> <strong>AJU-REC-{Date.now().toString().slice(-6)}</strong></div>
                        <div><span>Date:</span> <strong>{new Date().toLocaleDateString('en-IN')}</strong></div>
                        <div><span>Transaction ID:</span> <strong>{txnId}</strong></div>
                      </div>

                      <div className="receipt-student">
                        <div><span>Student Name:</span> <strong>{student?.name || 'Ansh Kumar'}</strong></div>
                        <div><span>Enrollment No:</span> <strong>{student?.enrollmentNo || 'AJU/241051'}</strong></div>
                        <div><span>Course:</span> <strong>{student?.course || 'B.Tech Computer Science'}</strong></div>
                      </div>

                      <table className="receipt-table">
                        <thead>
                          <tr>
                            <th>Sr. No.</th>
                            <th>Particulars</th>
                            <th style={{textAlign: 'right'}}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(selectedHeads).filter(([,v]) => v).map(([k], index) => (
                            <tr key={k}>
                              <td>{index + 1}</td>
                              <td>{k}</td>
                              <td style={{textAlign: 'right'}}>{fmtINR(FEE_HEADS.find(f => f.label === k)?.due || 0)}</td>
                            </tr>
                          ))}
                          <tr className="receipt-total-row">
                            <td colSpan="2" style={{textAlign: 'right'}}><strong>Total Amount Paid</strong></td>
                            <td style={{textAlign: 'right'}}><strong>{fmtINR(totalSelected)}</strong></td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="receipt-footer">
                        <div className="receipt-words">
                          <p style={{fontSize: '0.85rem', color: '#4a5568', margin: 0}}>Payment Mode: <strong>{PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label}</strong></p>
                          <p style={{fontSize: '0.85rem', color: '#4a5568', marginTop: '4px'}}>Status: <span style={{color: '#38a169', fontWeight: '700'}}>Success</span></p>
                        </div>
                        <div className="receipt-sign">
                          <div className="sign-line"></div>
                          <span>Authorized Signatory</span>
                          <span style={{display: 'block', fontSize: '0.7rem', color: '#a0aec0', marginTop: '4px'}}>Auto-generated receipt</span>
                        </div>
                      </div>
                    </div>

                    <div className="op-success-actions">
                      <button className="op-pay-btn" onClick={() => window.print()} style={{ minWidth: 180 }}>
                        <Printer size={16} /> Print Receipt
                      </button>
                      <button className="op-ghost-btn" onClick={handleReset}>
                        Make Another Payment
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 5: FAILED ── */}
                {step === 'failed' && (
                  <motion.div key="failed"
                    initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="op-failed-wrap">
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}>
                      <XCircle size={60} color="#e53e3e" />
                    </motion.div>
                    <h3 className="op-failed-title">Payment Failed</h3>
                    <div className="op-error-box">
                      {paymentError.split('\n').map((line, i) => (
                        <p key={i} className="op-error-line">{line}</p>
                      ))}
                    </div>
                    <div className="op-success-actions">
                      <button className="op-pay-btn" style={{ minWidth: 180 }}
                        onClick={() => { setPaymentError(''); setStep('confirm'); }}>
                        <RefreshCw size={15} /> Try Again
                      </button>
                      <button className="op-ghost-btn" onClick={handleReset}>
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── Right: Past Payments ── */}
            <motion.div
              className="op-history-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <div className="op-panel-header">
                <Clock size={18} color="#008080" />
                <h2>Payment History</h2>
              </div>

              <div className="op-hist-list">
                {(fees.transactions || []).length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No past payments found.</div>
                ) : (
                  (fees.transactions || []).map((r, idx) => (
                    <motion.div 
                      key={r.id + idx} 
                      className={`op-hist-item ${r.id === txnId ? 'op-hist-new' : ''}`}
                      initial={r.id === txnId ? { opacity: 0, y: 10 } : false}
                      animate={r.id === txnId ? { opacity: 1, y: 0 } : false}
                    >
                      <div className="op-hist-left">
                        <CheckCircle2 size={18} color="#38a169" />
                        <div>
                          <div className="op-hist-head">{r.head}</div>
                          <div className="op-hist-meta">{r.date} · {r.id}</div>
                        </div>
                      </div>
                      <div className="op-hist-right">
                        <span className="op-hist-amt">{fmtINR(r.amount)}</span>
                        <span className="op-status-badge op-status-success">{r.status}</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Pending Alert */}
              <div className="op-pending-alert">
                <AlertCircle size={16} color="#e53e3e" />
                <div>
                  <div className="op-pa-title">Outstanding Balance</div>
                  <div className="op-pa-val">{fmtINR(fees.total - fees.paid)}</div>
                </div>
              </div>

              <div className="op-hist-footer">
                <button className="op-ghost-btn" onClick={() => window.print()}>
                  <Download size={14} /> Download Statement
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
