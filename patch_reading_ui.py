with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

import re

textarea_ui = """
                  {session.atividades_leitura?.[readingIndex]?.is_multipla_escolha && session.atividades_leitura?.[readingIndex]?.opcoes ? (
                    <div className="flex flex-col gap-3">
                      {session.atividades_leitura[readingIndex].opcoes.map((opcao, idx) => (
                        <button
                          key={idx}
                          onClick={() => setReadingAnswer(opcao)}
                          className={`w-full p-4 text-left border-2 rounded-2xl text-lg font-sans transition-all ${
                            readingAnswer === opcao
                              ? 'border-blue-500 bg-blue-50 font-bold text-blue-700'
                              : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="font-bold mr-3 text-slate-400">{String.fromCharCode(65 + idx)})</span>
                          {opcao}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <textarea 
                      rows={4} 
                      className="w-full p-5 text-lg border-2 border-slate-200 rounded-2xl focus:border-blue-500 outline-none resize-none font-sans bg-slate-50 focus:bg-white transition-colors" 
                      placeholder="Escreva sua resposta aqui... Lembre-se de justificar com um trecho do texto!"
                      value={readingAnswer}
                      onChange={(e) => setReadingAnswer(e.target.value)}
                    />
                  )}
"""

content = content.replace(
"""                  <textarea 
                    rows={4} 
                    className="w-full p-5 text-lg border-2 border-slate-200 rounded-2xl focus:border-blue-500 outline-none resize-none font-sans bg-slate-50 focus:bg-white transition-colors" 
                    placeholder="Escreva sua resposta aqui... Lembre-se de justificar com um trecho do texto!"
                    value={readingAnswer}
                    onChange={(e) => setReadingAnswer(e.target.value)}
                  />""", textarea_ui.strip('\n'))

with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)
