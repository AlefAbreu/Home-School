import re

with open('src/components/TutorDashboard.tsx', 'r') as f:
    content = f.read()

bad_snippet = """    const handleDeleteMission = async (id: string, status: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Tem certeza que deseja excluir esta missão do Google Drive?')) return;
    
    try {
      setLoadingDrive(true);
      await deleteActivityFromDrive(id);
      await fetchDriveData();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir missão. Verifique suas permissões no Drive.');
      setLoadingDrive(false);
    }
  };"""

content = content.replace(bad_snippet, "")

with open('src/components/TutorDashboard.tsx', 'w') as f:
    f.write(content)
