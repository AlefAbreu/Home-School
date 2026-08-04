with open('src/components/TutorDashboard.tsx', 'r') as f:
    content = f.read()

import re

list_ui = """
              {localActiveSession && (
                <div className="p-5 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center bg-blue-50/50 border-blue-200 gap-4 mb-4">
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">Sessão Local</h4>
                    <p className="text-sm text-slate-500">
                      Status: {localActiveSession.isApproved ? 'Aprovada (Pronta para o Aluno)' : 'Aguardando Aprovação (Em Revisão)'}
                    </p>
                  </div>
                  <div>
                    {localActiveSession.isApproved ? (
                      <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Publicada / Em Andamento
                      </span>
                    ) : (
                      <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pendente de Revisão
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {[...drivePending.map(m => ({...m, status: 'pendente'})), ...driveCompleted.map(m => ({...m, status: 'concluida'}))]
"""

content = content.replace(
    "              {[...drivePending.map(m => ({...m, status: 'pendente'})), ...driveCompleted.map(m => ({...m, status: 'concluida'}))]",
    list_ui
)

content = content.replace(
    "              {drivePending.length === 0 && driveCompleted.length === 0 && (",
    "              {!localActiveSession && drivePending.length === 0 && driveCompleted.length === 0 && ("
)

with open('src/components/TutorDashboard.tsx', 'w') as f:
    f.write(content)
