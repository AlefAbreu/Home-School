import re

with open('src/components/TutorDashboard.tsx', 'r') as f:
    content = f.read()

reading_ui = """
                      {result.readingAnswers.map((ra, idx) => (
                        <div key={idx} className={`bg-white p-3 rounded border text-sm mb-2 relative pr-10 ${ra.needsReview ? 'border-amber-400 bg-amber-50' : (ra.isCorrect === true ? 'border-emerald-400 bg-emerald-50' : (ra.isCorrect === false ? 'border-red-400 bg-red-50' : 'border-slate-200'))}`}>
                          <div className="absolute right-3 top-3 flex flex-col gap-1">
                            <button 
                              onClick={() => toggleNeedsReview(result.id, 'reading', idx)}
                              className={`p-1 rounded transition-colors ${ra.needsReview ? 'text-amber-600 hover:text-amber-700 bg-amber-100' : 'text-slate-300 hover:text-amber-500'}`}
                              title="Marcar para Revisão"
                            >
                              <Flag className="w-4 h-4" />
                            </button>
                            {ra.isCorrect === null && (
                              <>
                                <button 
                                  onClick={() => markReadingAnswer(result.id, idx, true)}
                                  className="p-1 rounded text-slate-300 hover:text-emerald-500 hover:bg-emerald-100 transition-colors"
                                  title="Marcar como Correta"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => markReadingAnswer(result.id, idx, false)}
                                  className="p-1 rounded text-slate-300 hover:text-red-500 hover:bg-red-100 transition-colors"
                                  title="Marcar como Incorreta"
                                >
                                  <AlertTriangle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {ra.isCorrect !== null && (
                                <button 
                                  onClick={() => markReadingAnswer(result.id, idx, null as any)}
                                  className="p-1 rounded text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-colors"
                                  title="Desfazer Correção"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                          </div>
                          
                          {ra.askedForHelp && (
                            <div className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold mb-2">
                              <AlertTriangle className="w-3 h-3" /> Pediu Ajuda
                            </div>
                          )}
                          <p className="font-bold text-slate-700 mb-1 pr-8">Q: {ra.question}</p>
                          <p className="text-slate-600 pr-8"><strong>R:</strong> {ra.answer || <span className="italic text-slate-400">(Em branco)</span>}</p>
                          
                          {ra.isCorrect !== null && (
                            <div className={`mt-2 font-bold ${ra.isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                              {ra.isCorrect ? '✓ Correta' : '✗ Incorreta'}
                            </div>
                          )}
                        </div>
                      ))}
"""

content = re.sub(r'                      \{result.readingAnswers.map\(\(ra, idx\) => \([\s\S]*?                        </div>\n                      \}\)\}', reading_ui.strip('\n'), content)

with open('src/components/TutorDashboard.tsx', 'w') as f:
    f.write(content)
