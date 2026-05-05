import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQ2GbOzohZJMBt6gvhTv10DokOv-DzZgE",
  authDomain: "aju-erp-2026.firebaseapp.com",
  projectId: "aju-erp-2026",
  storageBucket: "aju-erp-2026.firebasestorage.app",
  messagingSenderId: "242611451959",
  appId: "1:242611451959:web:8f4c7598725678429967b2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function createAdmin() {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, "admin@aju.edu", "Admin@123");
    console.log("SUCCESS: Admin user created!", userCredential.user.uid);
    process.exit(0);
  } catch (error) {
    console.error("ERROR creating user:", error.message);
    process.exit(1);
  }
}

createAdmin();
