with open('src/components/TutorDashboard.tsx', 'r') as f:
    content = f.read()

state_vars = """
  const [activeTab, setActiveTab] = useState<'create' | 'all' | 'local'>('create');
  const [missionFilter, setMissionFilter] = useState<'todas' | 'pendentes' | 'em_andamento' | 'concluidas'>('todas');
"""
content = content.replace("  const [activeTab, setActiveTab] = useState<'create' | 'all' | 'local'>('create');", state_vars)


filter_ui = """
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              Missões Geradas
            </h2>

            <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setMissionFilter('todas')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${missionFilter === 'todas' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Todas
              </button>
              <button
                onClick={() => setMissionFilter('pendentes')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${missionFilter === 'pendentes' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Pendentes
              </button>
              <button
                onClick={() => setMissionFilter('em_andamento')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${missionFilter === 'em_andamento' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Em Andamento
              </button>
              <button
                onClick={() => setMissionFilter('concluidas')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${missionFilter === 'concluidas' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Concluídas
              </button>
            </div>
          </div>
"""

content = content.replace(
"""          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            Todas as Missões Geradas
          </h2>""",
filter_ui
)

with open('src/components/TutorDashboard.tsx', 'w') as f:
    f.write(content)
