import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  projectId: "gen-lang-client-0157450384",
  appId: "1:1068820962905:web:9d719c463309aa99271b48",
  apiKey: "AIzaSyBiwWCd5fno_2P9w3Ks-NroLsNMVjFJQAQ",
  authDomain: "gen-lang-client-0157450384.firebaseapp.com",
  storageBucket: "gen-lang-client-0157450384.firebasestorage.app",
  messagingSenderId: "1068820962905",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.readonly');

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const logout = () => signOut(auth);
