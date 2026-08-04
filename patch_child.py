import re

with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

# 1. Update Reading UI Condition & Options Rendering

reading_ui_old = """                  {(session.atividades_leitura?.[readingIndex]?.is_multipla_escolha || session.atividades_leitura?.[readingIndex]?.tipo_competencia === 'multipla_escolha' || extractOptions(session.atividades_leitura?.[readingIndex]?.enunciado_pergunta || '', session.atividades_leitura?.[readingIndex]?.opcoes).options) ? (
                    <div className="flex flex-col gap-3">
                      {extractOptions(session.atividades_leitura?.[readingIndex]?.enunciado_pergunta || '', session.atividades_leitura?.[readingIndex]?.opcoes).options?.map((opcao, idx) => (
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
                  ) : ("""

reading_ui_new = """                  {(session.atividades_leitura?.[readingIndex]?.tipo_resposta === 'multipla_escolha' || session.atividades_leitura?.[readingIndex]?.is_multipla_escolha || session.atividades_leitura?.[readingIndex]?.tipo_competencia === 'multipla_escolha' || extractOptions(session.atividades_leitura?.[readingIndex]?.enunciado_pergunta || '', session.atividades_leitura?.[readingIndex]?.opcoes).options) ? (
                    <div className="flex flex-col gap-3">
                      {(session.atividades_leitura?.[readingIndex]?.multipla_escolha?.opcoes || extractOptions(session.atividades_leitura?.[readingIndex]?.enunciado_pergunta || '', session.atividades_leitura?.[readingIndex]?.opcoes).options?.map(opt => ({ id: opt.charAt(0), texto: opt, valor: opt }))).map((opcao: any, idx) => {
                        const optText = opcao.texto || opcao.valor || opcao;
                        const optId = opcao.id || String.fromCharCode(65 + idx);
                        const isSelected = readingAnswer === optId || readingAnswer === optText;
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => setReadingAnswer(optId)}
                            className={`w-full p-4 text-left border-2 rounded-2xl text-lg font-sans transition-all flex flex-col ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 font-bold text-blue-700'
                                : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div>
                              <span className="font-bold mr-3 text-slate-400">{optId})</span>
                              {optText}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : ("""
content = content.replace(reading_ui_old, reading_ui_new)


# 2. Update Math UI Condition & Options Rendering

math_ui_old = """                  {(session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.is_multipla_escolha || extractOptions(session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.enunciado_textual_problema || '', session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.opcoes).options) ? (
                    <div className="flex flex-col gap-3 mb-8">
                      {extractOptions(session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.enunciado_textual_problema || '', session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.opcoes).options?.map((opcao, idx) => (
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
                  ) : ("""

math_ui_new = """                  {(session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.tipo_resposta === 'multipla_escolha' || session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.is_multipla_escolha || extractOptions(session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.enunciado_textual_problema || '', session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.opcoes).options) ? (
                    <div className="flex flex-col gap-3 mb-8">
                      {(session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.multipla_escolha?.opcoes || extractOptions(session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.enunciado_textual_problema || '', session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.opcoes).options?.map(opt => ({ id: opt.charAt(0), texto: opt, valor: opt }))).map((opcao: any, idx) => {
                        const optText = opcao.texto || opcao.valor || opcao;
                        const optId = opcao.id || String.fromCharCode(65 + idx);
                        const isSelected = mathAnswer === optId || mathAnswer === optText;
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => setMathAnswer(optId)}
                            className={`w-full p-4 text-left border-2 rounded-2xl text-lg font-sans transition-all flex flex-col ${
                              isSelected
                                ? 'border-purple-500 bg-purple-50 font-bold text-purple-700'
                                : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div>
                              <span className="font-bold mr-3 text-slate-400">{optId})</span>
                              {optText}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : ("""
content = content.replace(math_ui_old, math_ui_new)

with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)
