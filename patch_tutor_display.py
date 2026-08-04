import re

with open('src/components/TutorDashboard.tsx', 'r') as f:
    content = f.read()

reading_display_old = """                          <p className="text-slate-600"><strong>R:</strong> {ra.answer || <span className="italic text-slate-400">(Em branco)</span>}</p>
                        </div>"""

reading_display_new = """                          <p className="text-slate-600 mb-2"><strong>R:</strong> {ra.answer || <span className="italic text-slate-400">(Em branco)</span>}</p>
                          {(ra.correctAnswer || ra.tutorOrientation) && (
                            <div className="bg-blue-50 p-2 rounded text-blue-800 text-xs border border-blue-100">
                              {ra.correctAnswer && <p><strong>Gabarito:</strong> {ra.correctAnswer}</p>}
                              {ra.tutorOrientation && <p><strong>Orientação:</strong> {ra.tutorOrientation}</p>}
                            </div>
                          )}
                        </div>"""
                        
content = content.replace(reading_display_old, reading_display_new)


math_challenge_display_old = """                            <p className="font-mono text-center font-bold text-slate-700">{mc.question} = <span className={mc.correct ? "text-emerald-600" : "text-red-600"}>{mc.answer}</span></p>
                            {mc.mistakes && mc.mistakes.length > 0 && (
                              <p className="text-[10px] text-slate-500 mt-1 text-center">Erros: {mc.mistakes.join(', ')}</p>
                            )}
                          </div>"""
                          
math_challenge_display_new = """                            <p className="font-mono text-center font-bold text-slate-700 mb-1">{mc.question} = <span className={mc.correct ? "text-emerald-600" : "text-red-600"}>{mc.answer}</span></p>
                            {mc.mistakes && mc.mistakes.length > 0 && (
                              <p className="text-[10px] text-slate-500 mt-1 text-center mb-1">Erros: {mc.mistakes.join(', ')}</p>
                            )}
                            {mc.correctAnswer !== undefined && (
                                <p className="text-[11px] text-blue-700 bg-blue-50 px-1 rounded text-center border border-blue-100 mt-1">Gabarito: {mc.correctAnswer}</p>
                            )}
                          </div>"""

content = content.replace(math_challenge_display_old, math_challenge_display_new)


math_prob_display_old = """                          <p className="text-slate-600 font-mono bg-slate-50 p-2 rounded">Expressão: {mp.expression || <span className="italic text-slate-400">(Nenhuma)</span>}</p>
                          <p className="text-slate-600"><strong>Resultado:</strong> <span className={mp.correct ? "text-emerald-600 font-bold" : "text-red-600 font-bold"}>{mp.answer}</span></p>
                        </div>"""
                        
math_prob_display_new = """                          <p className="text-slate-600 font-mono bg-slate-50 p-2 rounded mb-2">Expressão: {mp.expression || <span className="italic text-slate-400">(Nenhuma)</span>}</p>
                          <p className="text-slate-600 mb-2"><strong>Resultado:</strong> <span className={mp.correct ? "text-emerald-600 font-bold" : "text-red-600 font-bold"}>{mp.answer}</span></p>
                          {(mp.correctAnswer !== undefined || mp.steps) && (
                            <div className="bg-blue-50 p-2 rounded text-blue-800 text-xs border border-blue-100">
                              {mp.correctAnswer !== undefined && <p><strong>Gabarito:</strong> {mp.correctAnswer}</p>}
                              {mp.steps && <p><strong>Passos:</strong> {mp.steps}</p>}
                            </div>
                          )}
                        </div>"""
                        
content = content.replace(math_prob_display_old, math_prob_display_new)

with open('src/components/TutorDashboard.tsx', 'w') as f:
    f.write(content)
