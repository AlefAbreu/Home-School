import { getGamification, getStudentResults, saveGamification, saveStudentResult, initDB } from './db';

export const getDriveToken = () => sessionStorage.getItem('drive_token');

export const findAppFile = async (token: string) => {
  try {
    const res = await fetch("https://www.googleapis.com/drive/v3/files?q=name='TutorAIData.json' and 'appDataFolder' in parents&spaces=appDataFolder", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
  } catch (e) {
    console.error(e);
  }
  return null;
};

export const loadFromDrive = async (token: string, fileId: string) => {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to load from drive");
  return await res.json();
};

export const saveToDrive = async (token: string, fileId: string | null, content: any) => {
  const fileContent = JSON.stringify(content);
  const metadata = {
    name: 'TutorAIData.json',
    parents: ['appDataFolder']
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([fileContent], { type: 'application/json' }));

  const url = fileId 
    ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
    : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;

  const method = fileId ? 'PATCH' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: form
  });
  if (!res.ok) throw new Error("Failed to save to drive");
  return await res.json();
};

export const syncDataToDrive = async () => {
  const token = getDriveToken();
  if (!token) throw new Error("No Drive Token");

  const gamification = await getGamification();
  const results = await getStudentResults();
  
  const data = { gamification, results, timestamp: Date.now() };
  const fileId = await findAppFile(token);
  await saveToDrive(token, fileId, data);
};

export const syncDataFromDrive = async () => {
  const token = getDriveToken();
  if (!token) throw new Error("No Drive Token");

  const fileId = await findAppFile(token);
  if (fileId) {
    const data = await loadFromDrive(token, fileId);
    if (data && data.gamification) {
      await saveGamification(data.gamification);
    }
    if (data && data.results) {
      // clear and save all
      const db = await initDB();
      const tx = db.transaction('results', 'readwrite');
      const store = tx.objectStore('results');
      store.clear();
      data.results.forEach((r: any) => store.put(r));
    }
    return true;
  }
  return false;
};
