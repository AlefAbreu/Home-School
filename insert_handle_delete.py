import re

with open('src/components/TutorDashboard.tsx', 'r') as f:
    content = f.read()

func_to_add = """  const handleDeleteMission = async (id: string, status: string, e: React.MouseEvent) => {
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
  };

  const weekDayNames ="""

content = content.replace("  const weekDayNames =", func_to_add)

with open('src/components/TutorDashboard.tsx', 'w') as f:
    f.write(content)
