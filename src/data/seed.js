/**
 * seed.js — Run this ONCE to populate Firestore with the default student.
 * Usage: node seed.js  (from project root, after enabling billing)
 *
 * This uses the Firebase Admin SDK via the REST API approach.
 * Actually, since this is a browser app, run the seedDatabase() function
 * from the browser console after the app loads, or trigger it via the
 * admin panel seed button.
 *
 * Browser console usage:
 * import { seedDatabase } from './src/data/seed.js'
 * await seedDatabase()
 */

import { saveStudent } from './firestoreStore.js';

const DEFAULT_STUDENT = {
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
        { code: 'CSC31170', name: 'Programming in C', cie: 26, ese: 59, total: 85, grade: 'A', credits: 4, earned: 4 }
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
      { code: 'CSC34198', name: 'Data Structures', attended: 26, total: 31 },
      { code: 'CSC35091', name: 'Operating Systems', attended: 29, total: 31 },
      { code: 'CSC35102', name: 'Computer Networks', attended: 26, total: 31 },
      { code: 'CSC34120', name: 'Database Systems', attended: 24, total: 31 }
    ]
  },
  fees: { total: 120000, paid: 80000, due: 40000 }
};

export async function seedDatabase() {
  try {
    console.log('Seeding database with default student...');
    await saveStudent('AJU/241051', DEFAULT_STUDENT);
    console.log('✅ Default student AJU/241051 seeded successfully!');
    return true;
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    return false;
  }
}
