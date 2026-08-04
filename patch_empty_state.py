with open('src/components/TutorDashboard.tsx', 'r') as f:
    content = f.read()

import re

# We will define the filteredDriveMissions before rendering them to simplify
list_ui = """
          ) : (
            <div className="space-y-4">
              {(() => {
                const showLocal = localActiveSession && (missionFilter === 'todas' || (missionFilter === 'pendentes' && !localActiveSession.isApproved) || (missionFilter === 'em_andamento' && localActiveSession.isApproved));
                const allDriveMissions = [...drivePending.map(m => ({...m, status: 'em_andamento'})), ...driveCompleted.map(m => ({...m, status: 'concluida'}))];
                const filteredDriveMissions = allDriveMissions.filter(m => missionFilter === 'todas' || missionFilter === m.status).sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());
                
                return (
                  <>
                    {showLocal && (
                      <div className="p-5 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center bg-blue-50/50 border-blue-200 gap-4 mb-4">
                        <div>
                          <h4 className="font-bold text-slate-800 text-lg">Sessão Local</h4>
                          <p className="text-sm text-slate-500">
                            Status: {localActiveSession.isApproved ? 'Aprovada (Pronta para o Aluno)' : 'Aguardando Aprovação (Em Revisão)'}
                          </p>
                        </div>
                        <div>
                          {localActiveSession.isApproved ? (
                            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Em Andamento
                            </span>
                          ) : (
                            <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pendente de Revisão
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {filteredDriveMissions.map(file => (
                      <div key={file.id} className="p-5 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 gap-4">
                        <div>
                          <h4 className="font-bold text-slate-800 text-lg">{file.name.replace('.json', '')}</h4>
                          <p className="text-sm text-slate-500">Gerada em: {new Date(file.createdTime).toLocaleString()}</p>
                        </div>
                        <div>
                          {file.status === 'em_andamento' ? (
                            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Em Andamento
                            </span>
                          ) : (
                            <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Concluída
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {!showLocal && filteredDriveMissions.length === 0 && (
                      <div className="text-center p-8 text-slate-500">Nenhuma missão encontrada para este filtro.</div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
"""

content = re.sub(r'          \) : \(\n            <div className="space-y-4">[\s\S]*?Nenhuma missão encontrada.*?\n              \)\}\n            </div>\n          \)\}', list_ui.strip('\n'), content)

with open('src/components/TutorDashboard.tsx', 'w') as f:
    f.write(content)
