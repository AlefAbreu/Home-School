import re

with open('src/components/TutorDashboard.tsx', 'r') as f:
    content = f.read()

bad_insert = """  const handleDeleteMission = async (id: string, status: string, e: React.MouseEvent) => {
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

  return (
) => {"""

content = content.replace(bad_insert, "    return () => {")

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

  return ("""

# Replace the first `return (` that is NOT indented with 4 spaces (or something like that).
# Let's just find `  return (` that starts the component rendering.
# Wait, let's search for `  return (` and replace it using string split/join.
parts = content.split("  return (")
content = parts[0] + func_to_add + "  return (".join(parts[1:])


with open('src/components/TutorDashboard.tsx', 'w') as f:
    f.write(content)
