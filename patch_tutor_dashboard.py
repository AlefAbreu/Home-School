import re

with open('src/components/TutorDashboard.tsx', 'r') as f:
    content = f.read()

# Add import for deleteActivityFromDrive
content = content.replace(
    "import { listActivitiesFromDrive, listCompletedActivitiesFromDrive, getDriveToken, readActivityFromDrive } from '../lib/drive';",
    "import { listActivitiesFromDrive, listCompletedActivitiesFromDrive, getDriveToken, readActivityFromDrive, deleteActivityFromDrive } from '../lib/drive';"
)

# Add handleDeleteMission function before return
func_to_add = """
  const handleDeleteMission = async (id: string, status: string, e: React.MouseEvent) => {
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
"""
content = content.replace("  return (", func_to_add, 1)

# Modify filteredDriveMissions mapping to include delete button
drive_map_old = """                        <div>
                          {file.status === 'em_andamento' ? (
                            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Em Andamento
                            </span>
                          ) : (
                            <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Concluída
                            </span>
                          )}
                        </div>"""
                        
drive_map_new = """                        <div className="flex items-center gap-3">
                          {file.status === 'em_andamento' ? (
                            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Em Andamento
                            </span>
                          ) : (
                            <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Concluída
                            </span>
                          )}
                          <button
                            onClick={(e) => handleDeleteMission(file.id, file.status, e)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir Missão"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>"""
                        
content = content.replace(drive_map_old, drive_map_new)

with open('src/components/TutorDashboard.tsx', 'w') as f:
    f.write(content)
