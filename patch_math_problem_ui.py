with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

import re

new_ui = """
                  {session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.is_multipla_escolha && session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.opcoes ? (
                    <div className="flex flex-col gap-3 mb-8">
                      {session.atividades_matematica.bloco_operacoes_problemas[problemIndex].opcoes.map((opcao, idx) => (
                        <button
                          key={idx}
                          onClick={() => setMathAnswer(opcao)}
                          className={`w-full p-4 text-left border-2 rounded-2xl text-lg font-sans transition-all ${
                            mathAnswer === opcao
                              ? 'border-purple-500 bg-purple-50 font-bold text-purple-700'
                              : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="font-bold mr-3 text-slate-400">{String.fromCharCode(65 + idx)})</span>
                          {opcao}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="bg-slate-50/50 p-6 sm:p-8 rounded-3xl border border-slate-100 mb-8">
                        <p className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wide">1. Monte a Expressão Matemática</p>
                        <div className="flex flex-col gap-4">
                          <input 
                            type="text" 
                            readOnly
                            value={problemExpression}
                            className="w-full p-4 sm:p-5 text-2xl sm:text-3xl font-mono font-bold border-4 border-slate-200 rounded-2xl bg-white outline-none focus:border-purple-300 transition-colors" 
                            placeholder="Ex: 50 - (2 * 10)"
                          />
                          <div className="grid grid-cols-5 gap-2 sm:gap-3">
                            {['7','8','9','+','-','4','5','6','*','/','1','2','3','(',')','0','.','C','<-'].map(btn => (
                              <button
                                key={btn}
                                onClick={() => {
                                  if (btn === 'C') setProblemExpression('');
                                  else if (btn === '<-') setProblemExpression(prev => prev.slice(0, -1));
                                  else setProblemExpression(prev => prev + btn);
                                }}
                                className="bg-white hover:bg-purple-100 active:bg-purple-200 text-purple-900 font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-purple-200 shadow-sm transition-colors text-xl sm:text-2xl font-mono"
                              >
                                {btn}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wide">2. Resultado Final</p>
                      <div className="flex items-center justify-center gap-4 bg-slate-50/50 p-6 sm:p-8 rounded-3xl border border-slate-100 mb-8">
                        <span className="text-3xl sm:text-4xl font-bold text-slate-400">R$</span>
                        <input 
                          type="text" 
                          value={mathAnswer}
                          onChange={(e) => setMathAnswer(e.target.value)}
                          className="w-40 sm:w-48 p-4 sm:p-5 text-3xl sm:text-4xl font-mono font-bold border-4 border-slate-200 rounded-2xl focus:border-purple-500 outline-none text-center bg-white transition-colors" 
                          placeholder="0,00"
                        />
                      </div>
                    </>
                  )}
"""

content = re.sub(r'                  <div className="bg-slate-50/50 p-6 sm:p-8 rounded-3xl border border-slate-100 mb-8">\n                    <p className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wide">1\. Monte a Expressão Matemática</p>[\s\S]*?className="w-40 sm:w-48 p-4 sm:p-5 text-3xl sm:text-4xl font-mono font-bold border-4 border-slate-200 rounded-2xl focus:border-purple-500 outline-none text-center bg-white transition-colors" \n                      placeholder="0,00"\n                    />\n                  </div>', new_ui.strip('\n'), content)

with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)
