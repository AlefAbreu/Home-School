with open('src/components/TutorDashboard.tsx', 'r') as f:
    content = f.read()

import re

# Add imports
content = re.sub(
    r"import \{ auth \} from '\.\./lib/firebase';",
    "import { auth } from '../lib/firebase';\nimport { listActivitiesFromDrive, listCompletedActivitiesFromDrive, getDriveToken, readActivityFromDrive } from '../lib/drive';",
    content
)

state_vars = """
  const [activeTab, setActiveTab] = useState<'create' | 'pending' | 'completed' | 'local'>('create');
  const [drivePending, setDrivePending] = useState<any[]>([]);
  const [driveCompleted, setDriveCompleted] = useState<any[]>([]);
  const [loadingDrive, setLoadingDrive] = useState(false);

  const fetchDriveData = async () => {
    if (!getDriveToken()) return;
    setLoadingDrive(true);
    try {
      const pending = await listActivitiesFromDrive();
      setDrivePending(pending);
      const completed = await listCompletedActivitiesFromDrive();
      setDriveCompleted(completed);
    } catch (e) {
      console.error(e);
    }
    setLoadingDrive(false);
  };

  useEffect(() => {
    fetchDriveData();
  }, []);
"""

content = re.sub(
    r"  const \[expandedMissionId, setExpandedMissionId\] = useState<string \| null>\(null\);",
    "  const [expandedMissionId, setExpandedMissionId] = useState<string | null>(null);" + state_vars,
    content
)

tabs_ui = """
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded-full font-bold whitespace-nowrap ${activeTab === 'create' ? 'bg-blue-500 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
        >
          Criar Nova Missão
        </button>
        <button
          onClick={() => { setActiveTab('pending'); fetchDriveData(); }}
          className={`px-4 py-2 rounded-full font-bold whitespace-nowrap ${activeTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
        >
          Missões Pendentes ({drivePending.length})
        </button>
        <button
          onClick={() => { setActiveTab('completed'); fetchDriveData(); }}
          className={`px-4 py-2 rounded-full font-bold whitespace-nowrap ${activeTab === 'completed' ? 'bg-blue-500 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
        >
          Missões Concluídas ({driveCompleted.length})
        </button>
        <button
          onClick={() => setActiveTab('local')}
          className={`px-4 py-2 rounded-full font-bold whitespace-nowrap ${activeTab === 'local' ? 'bg-blue-500 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
        >
          Histórico Local ({results.length})
        </button>
      </div>
"""

content = re.sub(
    r"(<div className=\"grid grid-cols-1 md:grid-cols-3 gap-8\">)",
    tabs_ui + r"\n      {activeTab === 'create' && (\1",
    content
)
# Close activeTab == 'create' and open the others
content = re.sub(
    r"(<div className=\"mt-12\">)",
    r"      )}\n      {activeTab === 'pending' && (<div className=\"bg-white rounded-3xl p-8 shadow-sm border border-slate-200\"><h3 className=\"text-xl font-bold text-slate-800 mb-6\">Missões Pendentes no Google Drive</h3>{loadingDrive ? <p>Carregando...</p> : drivePending.map(file => (<div key={file.id} className=\"p-4 mb-4 border rounded-xl flex justify-between items-center bg-slate-50\"><div><h4 className=\"font-bold\">{file.name}</h4><p className=\"text-sm text-slate-500\">Criado em: {new Date(file.createdTime).toLocaleString()}</p></div><span className=\"px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-bold\">Pendente</span></div>))}</div>)}\n      {activeTab === 'completed' && (<div className=\"bg-white rounded-3xl p-8 shadow-sm border border-slate-200\"><h3 className=\"text-xl font-bold text-slate-800 mb-6\">Missões Concluídas no Google Drive</h3>{loadingDrive ? <p>Carregando...</p> : driveCompleted.map(file => (<div key={file.id} className=\"p-4 mb-4 border rounded-xl flex justify-between items-center bg-slate-50\"><div><h4 className=\"font-bold\">{file.name}</h4><p className=\"text-sm text-slate-500\">Criado em: {new Date(file.createdTime).toLocaleString()}</p></div><span className=\"px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold\">Concluída</span></div>))}</div>)}\n      {activeTab === 'local' && (\n      \1",
    content
)

# Close the local tab block
content = re.sub(
    r"(        </div>\n      \)\}\n    </div>)",
    r"        </div>\n      )}\n      )}\n    </div>",
    content
)

with open('src/components/TutorDashboard.tsx', 'w') as f:
    f.write(content)
