export const DB_NAME = 'TutorAIDB';
export const DB_VERSION = 2;

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

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('gamification')) {
        db.createObjectStore('gamification', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('results')) {
        db.createObjectStore('results', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getGamification = async (): Promise<UserStats> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('gamification', 'readonly');
    const store = tx.objectStore('gamification');
    const request = store.get('user_stats');
    
    request.onsuccess = () => {
      if (request.result) {
        // Migration from old schema if needed
        resolve({
          id: 'user_stats',
          missionsCompleted: request.result.missionsCompleted || request.result.streak || 0,
          badges: request.result.badges || [],
        });
      } else {
        resolve({
          id: 'user_stats',
          missionsCompleted: 0,
          badges: [],
        });
      }
    };
    request.onerror = () => reject(request.error);
  });
};

export const saveGamification = async (data: Partial<UserStats>): Promise<void> => {
  const current = await getGamification();
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('gamification', 'readwrite');
    const store = tx.objectStore('gamification');
    const request = store.put({ ...current, ...data });
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
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
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('results', 'readwrite');
    const store = tx.objectStore('results');
    const request = store.put(result);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getStudentResults = async (): Promise<StudentResult[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('results', 'readonly');
    const store = tx.objectStore('results');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

export const updateStudentResult = async (id: string, updateFn: (result: StudentResult) => StudentResult): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('results', 'readwrite');
    const store = tx.objectStore('results');
    const getReq = store.get(id);
    
    getReq.onsuccess = () => {
      if (getReq.result) {
        const updated = updateFn(getReq.result);
        store.put(updated);
      }
      resolve();
    };
    getReq.onerror = () => reject(getReq.error);
  });
};

export const deleteStudentResult = async (id: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('results', 'readwrite');
    const store = tx.objectStore('results');
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const evaluateStudentResult = async (id: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('results', 'readwrite');
    const store = tx.objectStore('results');
    const getReq = store.get(id);
    
    getReq.onsuccess = () => {
      if (getReq.result) {
        const updated = { ...getReq.result, evaluated: true };
        store.put(updated);
      }
      resolve();
    };
    getReq.onerror = () => reject(getReq.error);
  });
};
