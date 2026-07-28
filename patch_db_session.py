with open('src/lib/db.ts', 'r') as f:
    content = f.read()

new_imports = "import { doc, getDoc, setDoc, collection, getDocs, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';"
content = content.replace("import { doc, getDoc, setDoc, collection, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';", new_imports)

session_funcs = """
export const saveActiveSession = async (sessionData: any, baseText: string, isApproved: boolean): Promise<void> => {
  const uid = getUserId();
  const docRef = doc(db, 'users', uid, 'activeSession', 'current');
  await setDoc(docRef, { sessionData, baseText, isApproved });
};

export const subscribeToActiveSession = (callback: (data: any) => void) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return () => {};
  const docRef = doc(db, 'users', uid, 'activeSession', 'current');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null);
    }
  });
};
"""

content = content + "\n" + session_funcs

with open('src/lib/db.ts', 'w') as f:
    f.write(content)
