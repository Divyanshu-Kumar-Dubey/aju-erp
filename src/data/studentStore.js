/**
 * studentStore.js — Compatibility Shim
 *
 * All real logic has moved to firestoreStore.js (Firebase Firestore backend).
 * This file re-exports everything from there so existing imports don't break.
 */
export {
  getAllStudents,
  getStudent,
  saveStudent,
  validateStudentLogin,
  adminLogin,
  adminLogout,
  setStudentSession,
  getStudentSessionId,
  clearStudentSession,
  useStudentSession,
} from './firestoreStore';

/**
 * getStudentSession() — Backwards-compat async wrapper.
 * Old code called this synchronously; new callers should await it.
 */
export { getStudent as getStudentSession } from './firestoreStore';
