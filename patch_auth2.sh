#!/bin/bash
cat << 'INNER_EOF' > src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';

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
provider.addScope('https://www.googleapis.com/auth/drive.appdata');

export const signInWithGoogle = async () => {
  try {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        sessionStorage.setItem('drive_token', credential.accessToken);
      }
      return result;
    } catch (popupError: any) {
      if (popupError.code === "auth/popup-blocked" || popupError.code === "auth/popup-closed-by-user") {
        await signInWithRedirect(auth, provider);
        return;
      }
      throw popupError;
    }
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const logout = () => {
  sessionStorage.removeItem('drive_token');
  return signOut(auth);
};
INNER_EOF
