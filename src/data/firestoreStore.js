import { useState, useEffect } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * firestoreStore.js — Hybrid Data Layer
 *
 * PRIMARY:  localStorage  (works immediately, offline, no billing needed)
 * SECONDARY: Firebase Firestore (syncs when billing is enabled & DB exists)
 *
 * Every operation tries Firestore first; if it fails it silently falls back
 * to localStorage. This means the app ALWAYS works, and automatically gains
 * real-time multi-device sync once Firestore is activated.
 */

// ─── localStorage Keys ───────────────────────────────────────────────────────

const LS_STORE_KEY = 'aju_students';
const SESSION_KEY  = 'studentSession';

// ─── Default Student Data (seed for localStorage) ────────────────────────────

const DEFAULT_STUDENTS = {
  'AJU/241051': {
    enrollmentNo: 'AJU/241051',
    password: 'student@123',
    name: 'Ansh Kumar',
    fatherName: 'Rajesh Kumar',
    dob: '2003-05-15',
    phone: '9876543210',
    email: 'ansh.kumar@aju.edu',
    address: '123, Adityapur, Jamshedpur, Jharkhand',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
    batch: '2024-2025',
    department: 'Dept. of IT',
    degree: 'MCA',
    branch: 'Computer Applications',
    semester: 'Semester 3',
    rollNo: 'CSE/2023/001',
    marks: [
      {
        semester: 'Semester 1',
        session: 'ODD 2024-25',
        sgpa: '8.73',
        cgpa: '8.73',
        status: 'Pass',
        totalCredits: 30,
        earnedCredits: 30,
        subjects: [
          { code: 'CSC31166', name: 'Computer Fundamentals', cie: 24, ese: 68, total: 92, grade: 'A+', credits: 4, earned: 4 },
          { code: 'CSC31170', name: 'Programming in C',      cie: 26, ese: 59, total: 85, grade: 'A',  credits: 4, earned: 4 }
        ]
      },
      {
        semester: 'Semester 2',
        session: 'EVEN 2024-25',
        sgpa: '8.60',
        cgpa: '8.67',
        status: 'Pass',
        totalCredits: 30,
        earnedCredits: 30,
        subjects: [
          { code: 'CSC32175', name: 'Data Structures', cie: 16, ese: 39, total: 55, grade: 'C+', credits: 4, earned: 4 }
        ]
      }
    ],
    attendance: {
      theory: 85,
      practical: 92,
      subjects: [
        { code: 'CSC34198', name: 'Data Structures',    attended: 26, total: 31 },
        { code: 'CSC35091', name: 'Operating Systems',  attended: 29, total: 31 },
        { code: 'CSC35102', name: 'Computer Networks',  attended: 26, total: 31 },
        { code: 'CSC34120', name: 'Database Systems',   attended: 24, total: 31 }
      ]
    },
    fees: { total: 120000, paid: 80000, due: 40000 }
  }
};

// ─── localStorage Helpers ────────────────────────────────────────────────────

function lsGetAll() {
  try {
    const raw = localStorage.getItem(LS_STORE_KEY);
    return raw ? JSON.parse(raw) : { ...DEFAULT_STUDENTS };
  } catch {
    return { ...DEFAULT_STUDENTS };
  }
}

function lsGetOne(enrollmentNo) {
  const all = lsGetAll();
  return all[enrollmentNo.toUpperCase()] || null;
}

function lsSave(enrollmentNo, data) {
  const all = lsGetAll();
  all[enrollmentNo.toUpperCase()] = { ...data, enrollmentNo: enrollmentNo.toUpperCase() };
  localStorage.setItem(LS_STORE_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event('studentStoreUpdated'));
}

// ─── Firestore Helpers ───────────────────────────────────────────────────────

/** Convert enrollment number to a valid Firestore document ID */
function toDocId(enrollmentNo) {
  return enrollmentNo.toUpperCase().replace('/', '_');
}

/** Detect if Firestore is available by doing a cheap check */
let firestoreAvailable = null; // null = unknown, true/false = determined

async function checkFirestore() {
  if (firestoreAvailable !== null) return firestoreAvailable;
  try {
    // Try a lightweight read from a known path to test connectivity
    await getDoc(doc(db, '_ping', 'test'));
    firestoreAvailable = true;
  } catch (e) {
    // "not-found" means DB exists but doc doesn't — that's fine
    if (e?.code === 'not-found' || e?.message?.includes('No document')) {
      firestoreAvailable = true;
    } else {
      firestoreAvailable = false;
      console.warn('[ERP] Firestore unavailable, using localStorage:', e?.code || e?.message);
    }
  }
  return firestoreAvailable;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Fetch all students — tries Firestore, falls back to localStorage */
export async function getAllStudents() {
  try {
    const ok = await checkFirestore();
    if (ok) {
      const snapshot = await getDocs(collection(db, 'students'));
      const students = {};
      snapshot.forEach(docSnap => {
        const key = docSnap.id.replace('_', '/');
        students[key] = docSnap.data();
      });
      // Merge with localStorage so newly created (unsaved) records appear
      return { ...lsGetAll(), ...students };
    }
  } catch (e) {
    console.warn('[ERP] getAllStudents Firestore error, using localStorage:', e?.code);
  }
  return lsGetAll();
}

/** Get one student — tries Firestore, falls back to localStorage */
export async function getStudent(enrollmentNo) {
  try {
    const ok = await checkFirestore();
    if (ok) {
      const docRef = doc(db, 'students', toDocId(enrollmentNo));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return docSnap.data();
    }
  } catch (e) {
    console.warn('[ERP] getStudent Firestore error, using localStorage:', e?.code);
  }
  return lsGetOne(enrollmentNo);
}

/** Save a student — saves to localStorage instantly, then syncs to Firestore */
export async function saveStudent(enrollmentNo, data) {
  // Always save to localStorage first so the UI updates instantly
  lsSave(enrollmentNo, data);

  // Then try to sync to Firestore in the background
  try {
    const ok = await checkFirestore();
    if (ok) {
      const docRef = doc(db, 'students', toDocId(enrollmentNo));
      await setDoc(docRef, { ...data, enrollmentNo: enrollmentNo.toUpperCase() });
      console.log('[ERP] Synced to Firestore:', enrollmentNo);
    }
  } catch (e) {
    console.warn('[ERP] Firestore sync failed, data is safe in localStorage:', e?.code);
  }
}

/** Validate student login — Firestore first, then localStorage */
export async function validateStudentLogin(enrollmentNo, password) {
  const student = await getStudent(enrollmentNo);
  if (student && student.password === password) return student;
  return null;
}

// ─── Session Management ──────────────────────────────────────────────────────

/** Save logged-in student enrollment number */
export function setStudentSession(enrollmentNo) {
  // Store in both localStorage and sessionStorage for persistence
  localStorage.setItem(SESSION_KEY, enrollmentNo.toUpperCase());
  sessionStorage.setItem(SESSION_KEY, enrollmentNo.toUpperCase());
  window.dispatchEvent(new Event('studentStoreUpdated'));
}

/** Get the enrollment number of the currently logged-in student */
export function getStudentSessionId() {
  return localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
}

/** Clear student session on logout */
export function clearStudentSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event('studentStoreUpdated'));
}

/** Get current student (sync, from localStorage only) */
export function getStudentSession() {
  const enr = getStudentSessionId();
  return enr ? lsGetOne(enr) : null;
}

// ─── React Hook ──────────────────────────────────────────────────────────────

/**
 * useStudentSession()
 *
 * Returns live student data. If Firestore is available, uses onSnapshot
 * for real-time updates. Otherwise uses localStorage with event listeners.
 * Returns just the student object (null if not logged in / loading).
 */
export function useStudentSession() {
  const [student, setStudent] = useState(() => getStudentSession());

  useEffect(() => {
    const enrollmentNo = getStudentSessionId();
    if (!enrollmentNo) return;

    // ── Try Firestore real-time listener ──
    let unsubFirestore = null;

    checkFirestore().then(ok => {
      if (ok) {
        try {
          const docRef = doc(db, 'students', toDocId(enrollmentNo));
          unsubFirestore = onSnapshot(
            docRef,
            (docSnap) => {
              if (docSnap.exists()) setStudent(docSnap.data());
            },
            (err) => {
              console.warn('[ERP] onSnapshot error, falling back to localStorage:', err?.code);
              unsubFirestore = null;
            }
          );
        } catch (e) {
          console.warn('[ERP] Could not attach onSnapshot:', e?.code);
        }
      }
    });

    // ── localStorage fallback listener (always active as safety net) ──
    const refresh = () => setStudent(lsGetOne(enrollmentNo));
    const handleStorage = (e) => {
      if (!e?.key || e.key === LS_STORE_KEY || e.key === SESSION_KEY) refresh();
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refresh();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('studentStoreUpdated', handleStorage);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (unsubFirestore) unsubFirestore();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('studentStoreUpdated', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return student;
}

// ─── Stub exports for compatibility ─────────────────────────────────────────
export async function adminLogin() { return null; }
export async function adminLogout() {}
