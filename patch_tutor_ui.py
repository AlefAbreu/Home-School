with open('src/components/TutorDashboard.tsx', 'r') as f:
    content = f.read()

import re

# Insert the combined list and tabs rendering
tabs_and_list_code = """
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${activeTab === 'create' ? 'bg-blue-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          Criar Nova Missão
        </button>
        <button
          onClick={() => { setActiveTab('pending'); fetchDriveData(); }}
          className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${activeTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          Todas as Missões
        </button>
        <button
          onClick={() => setActiveTab('local')}
          className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${activeTab === 'local' ? 'bg-blue-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          Histórico de Avaliações
        </button>
      </div>

      {activeTab === 'create' && (
"""

content = content.replace('      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">', tabs_and_list_code + '      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">', 1)

# Close activeTab === 'create'
# The create block ends before `{/* Avaliação de Missões */}`
close_create_and_start_others = """      )}

      {activeTab === 'pending' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 mt-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            Todas as Missões Geradas
          </h2>
          
          {loadingDrive ? (
            <div className="flex justify-center p-8 text-blue-500 font-bold animate-pulse">Carregando missões do Drive...</div>
          ) : (
            <div className="space-y-4">
              {[...drivePending.map(m => ({...m, status: 'pendente'})), ...driveCompleted.map(m => ({...m, status: 'concluida'}))]
                .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime())
                .map(file => (
                <div key={file.id} className="p-5 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 gap-4">
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{file.name.replace('.json', '')}</h4>
                    <p className="text-sm text-slate-500">Gerada em: {new Date(file.createdTime).toLocaleString()}</p>
                  </div>
                  <div>
                    {file.status === 'pendente' ? (
                      <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pendente
                      </span>
                    ) : (
                      <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Concluída
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {drivePending.length === 0 && driveCompleted.length === 0 && (
                <div className="text-center p-8 text-slate-500">Nenhuma missão encontrada no Google Drive.</div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'local' && (
        <div className="w-full">
"""

content = content.replace('      {/* Avaliação de Missões */}', close_create_and_start_others + '\n      {/* Avaliação de Missões */}')

content = content.replace('      )}', '      )}\n      </div>\n      )}', 1)

with open('src/components/TutorDashboard.tsx', 'w') as f:
    f.write(content)
