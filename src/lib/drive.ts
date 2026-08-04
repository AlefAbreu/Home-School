export const getDriveToken = () => {
  return localStorage.getItem('drive_token');
};

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files';
const UPLOAD_API_URL = 'https://www.googleapis.com/upload/drive/v3/files';

export const findOrCreateFolder = async (folderName: string, parentId?: string): Promise<string> => {
  const token = getDriveToken();
  if (!token) throw new Error("Google Drive token not found. Por favor, clique em 'Sair' e faça o login novamente para renovar o acesso.");

  let query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;
  if (parentId) {
    query += ` and '${parentId}' in parents`;
  }

  const response = await fetch(`${DRIVE_API_URL}?q=${encodeURIComponent(query)}&spaces=drive&fields=files(id, name)`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }

  // Create folder
  const createResponse = await fetch(DRIVE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : undefined
    })
  });

  const createData = await createResponse.json();
  return createData.id;
};

export const saveActivityToDrive = async (activity: any, fileName: string) => {
  const token = getDriveToken();
  if (!token) throw new Error("Google Drive token not found. Por favor, clique em 'Sair' e faça o login novamente para renovar o acesso.");

  const tutorFolderId = await findOrCreateFolder("Painel Tutor");

  const metadata = {
    name: fileName,
    mimeType: 'application/json',
    parents: [tutorFolderId]
  };

  const fileContent = JSON.stringify(activity);
  const file = new Blob([fileContent], { type: 'application/json' });

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  const response = await fetch(`${UPLOAD_API_URL}?uploadType=multipart`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: form
  });

  if (!response.ok) {
    throw new Error("Failed to save activity to Drive.");
  }
  
  return await response.json();
};

export const listActivitiesFromDrive = async () => {
  const token = getDriveToken();
  if (!token) throw new Error("Google Drive token not found. Por favor, clique em 'Sair' e faça o login novamente para renovar o acesso.");

  const tutorFolderId = await findOrCreateFolder("Painel Tutor");
  
  const query = `'${tutorFolderId}' in parents and mimeType='application/json' and trashed=false`;
  
  const response = await fetch(`${DRIVE_API_URL}?q=${encodeURIComponent(query)}&fields=files(id, name, createdTime)`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  return data.files || [];
};

export const readActivityFromDrive = async (fileId: string) => {
  const token = getDriveToken();
  if (!token) throw new Error("Google Drive token not found. Por favor, clique em 'Sair' e faça o login novamente para renovar o acesso.");

  const response = await fetch(`${DRIVE_API_URL}/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to read activity from Drive.");
  }

  return await response.json();
};

export const markActivityAsCompleted = async (fileId: string, resultData: any, originalName: string) => {
  const token = getDriveToken();
  if (!token) throw new Error("Google Drive token not found. Por favor, clique em 'Sair' e faça o login novamente para renovar o acesso.");

  // Save the result to "Atividades Concluídas"
  const completedFolderId = await findOrCreateFolder("Atividades Concluídas");

  const metadata = {
    name: `Concluída - ${originalName}`,
    mimeType: 'application/json',
    parents: [completedFolderId]
  };

  const fileContent = JSON.stringify(resultData);
  const file = new Blob([fileContent], { type: 'application/json' });

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  const uploadResponse = await fetch(`${UPLOAD_API_URL}?uploadType=multipart`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: form
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to save completed activity to Drive.");
  }

  // Delete the original file from "Painel Tutor" to mark it as done
  await fetch(`${DRIVE_API_URL}/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};


export const listCompletedActivitiesFromDrive = async () => {
  const token = getDriveToken();
  if (!token) throw new Error("Google Drive token not found. Por favor, clique em 'Sair' e faça o login novamente para renovar o acesso.");

  const completedFolderId = await findOrCreateFolder("Atividades Concluídas");
  
  const query = `'${completedFolderId}' in parents and mimeType='application/json' and trashed=false`;
  
  const response = await fetch(`${DRIVE_API_URL}?q=${encodeURIComponent(query)}&fields=files(id, name, createdTime)`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  return data.files || [];
};
