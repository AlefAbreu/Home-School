import { db, auth } from './firebase';
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

export interface UserStats {
  id: string;
  missionsCompleted: number;
  badges: string[];
}

export interface StudentResult {
  id: string;
  date: string;
  readingText?: string;
  readingAnswers: { question: string; answer: string; isCorrect: boolean | null; needsReview?: boolean; askedForHelp?: boolean }[];
  mathChallengeAnswers: { question: string; answer: string; correct: boolean; mistakes: string[]; needsReview?: boolean; askedForHelp?: boolean }[];
  mathProblemAnswers: { problem: string; expression: string; answer: string; correct: boolean; needsReview?: boolean; askedForHelp?: boolean }[];
  evaluated: boolean;
}

const getUserId = () => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Usuário não autenticado");
  return uid;
};

export const getGamification = async (): Promise<UserStats> => {
  try {
    const uid = getUserId();
    const docRef = doc(db, 'users', uid, 'stats', 'gamification');
    // Add a timeout to prevent hanging if offline or DB issues
    const docSnap = await Promise.race([
      getDoc(docRef),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout fetching gamification')), 5000))
    ]);
    if (docSnap.exists()) {
      return docSnap.data() as UserStats;
    }
  } catch (e) {
    console.warn("Using default stats", e);
  }
  return {
    id: 'user_stats',
    missionsCompleted: 0,
    badges: [],
  };
};

export const saveGamification = async (data: Partial<UserStats>): Promise<void> => {
  const uid = getUserId();
  const current = await getGamification();
  const docRef = doc(db, 'users', uid, 'stats', 'gamification');
  await setDoc(docRef, { ...current, ...data }, { merge: true });
};

export const incrementMissions = async (): Promise<UserStats> => {
  const stats = await getGamification();
  const newStats = { ...stats, missionsCompleted: stats.missionsCompleted + 1 };
  await saveGamification(newStats);
  return newStats;
};

export const awardBadge = async (badgeName: string): Promise<UserStats> => {
  const stats = await getGamification();
  if (stats.badges.includes(badgeName)) {
    return stats;
  }
  const newStats = { ...stats, badges: [...stats.badges, badgeName] };
  await saveGamification(newStats);
  return newStats;
};

export const saveStudentResult = async (result: StudentResult): Promise<void> => {
  const uid = getUserId();
  const docRef = doc(db, 'users', uid, 'results', result.id);
  await setDoc(docRef, result);
};

export const getStudentResults = async (): Promise<StudentResult[]> => {
  try {
    const uid = getUserId();
    const colRef = collection(db, 'users', uid, 'results');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => doc.data() as StudentResult);
  } catch (e) {
    console.warn("Could not fetch results", e);
    return [];
  }
};

export const updateStudentResult = async (id: string, updateFn: (result: StudentResult) => StudentResult): Promise<void> => {
  const uid = getUserId();
  const docRef = doc(db, 'users', uid, 'results', id);
  // Add a timeout to prevent hanging if offline or DB issues
    const docSnap = await Promise.race([
      getDoc(docRef),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout fetching gamification')), 5000))
    ]);
  if (docSnap.exists()) {
    const updated = updateFn(docSnap.data() as StudentResult);
    await setDoc(docRef, updated);
  }
};

export const deleteStudentResult = async (id: string): Promise<void> => {
  const uid = getUserId();
  const docRef = doc(db, 'users', uid, 'results', id);
  await deleteDoc(docRef);
};

export const evaluateStudentResult = async (id: string): Promise<void> => {
  const uid = getUserId();
  const docRef = doc(db, 'users', uid, 'results', id);
  await updateDoc(docRef, { evaluated: true });
};


export const saveActiveSession = async (sessionData: any, baseText: string, isApproved: boolean): Promise<void> => {
  const uid = getUserId();
  const docRef = doc(db, 'users', uid, 'activeSession', 'current');
  await setDoc(docRef, { sessionData, baseText, isApproved });
};

export const subscribeToActiveSession = (uid: string, callback: (data: any) => void) => {
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


export const subscribeToStudentResults = (uid: string, callback: (results: StudentResult[]) => void) => {
  if (!uid) return () => {};
  const colRef = collection(db, 'users', uid, 'results');
  return onSnapshot(colRef, (snapshot) => {
    const results = snapshot.docs.map(doc => doc.data() as StudentResult);
    callback(results);
  }, (error) => {
    console.warn("Could not subscribe to results", error);
    callback([]);
  });
};
