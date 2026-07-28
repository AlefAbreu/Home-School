import React, { useState, useEffect } from 'react';
import { FileText, Settings, Key, CheckCircle2, BookOpen, Calculator, AlertTriangle, Flag, ChevronDown, ChevronUp, Trash2, Calendar } from 'lucide-react';
import { GeneratedStudySession } from '../types';
import { getStudentResults, StudentResult, evaluateStudentResult, updateStudentResult, deleteStudentResult } from '../lib/db';

interface TutorDashboardProps {
  onGenerate: (data: GeneratedStudySession, text: string) => void;
}

export const TutorDashboard: React.FC<TutorDashboardProps> = ({ onGenerate }) => {
  const [text, setText] = useState('');
  const [selectedTables, setSelectedTables] = useState<number[]>([2, 3]);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [expandedTextId, setExpandedTextId] = useState<string | null>(null);
  const [expandedMissionId, setExpandedMissionId] = useState<string | null>(null);

  const fetchResults = async () => {
    const res = await getStudentResults();
    setResults(res.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleEvaluate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await evaluateStudentResult(id);
    await fetchResults();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (true) {
      await deleteStudentResult(id);
      await fetchResults();
    }
  };

  const toggleNeedsReview = async (resultId: string, section: 'reading' | 'challenge' | 'problem', index: number) => {
    await updateStudentResult(resultId, (result) => {
      if (section === 'reading' && result.readingAnswers[index]) {
        result.readingAnswers[index].needsReview = !result.readingAnswers[index].needsReview;
      } else if (section === 'challenge' && result.mathChallengeAnswers[index]) {
        result.mathChallengeAnswers[index].needsReview = !result.mathChallengeAnswers[index].needsReview;
      } else if (section === 'problem' && result.mathProblemAnswers[index]) {
        result.mathProblemAnswers[index].needsReview = !result.mathProblemAnswers[index].needsReview;
      }
      return result;
    });
    await fetchResults();
  };

  const today = new Date();
  const weekDays = Array.from({length: 7}).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    const dEnd = new Date(d);
    dEnd.setDate(d.getDate() + 1);
    
    const count = results.filter(r => {
      const rd = new Date(r.date);
      return rd >= d && rd < dEnd;
    }).length;

    return {
      date: d,
      count,
      isToday: i === 6
    };
  });

  const weekDayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Painel do Tutor</h1>
        <p className="text-slate-500 mt-3 text-lg">Acompanhe as missões concluídas e crie novas atividades.</p>
      </header>

      {/* Calendário da Semana */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 mb-8">
        <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-500" />
          Atividade nos Últimos 7 Dias
        </h2>
        <div className="flex gap-2 sm:gap-4 justify-between">
          {weekDays.map((day, idx) => (
            <div 
              key={idx} 
              className={`flex-1 flex flex-col items-center justify-center py-4 rounded-2xl border ${day.isToday ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100'}`}
            >
              <span className="text-xs sm:text-sm font-bold text-slate-400 mb-1">{weekDayNames[day.date.getDay()]}</span>
              <span className="text-sm font-semibold text-slate-600 mb-3">{day.date.getDate()}/{day.date.getMonth() + 1}</span>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${day.count > 0 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-white text-slate-300 border border-slate-200'}`}>
                {day.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-800">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          Nova Sessão de Estudo
        </h2>

        <div className="mb-10">
          <label className="block font-bold mb-3 flex items-center gap-2 text-slate-700">
            <Calculator className="w-5 h-5 text-blue-500" />
            1. Selecione as Tabuadas para Estudo (Opcional)
          </label>
          <div className="flex flex-wrap gap-3 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <button
                key={num}
                onClick={() => {
                  setSelectedTables(prev => 
                    prev.includes(num) 
                      ? prev.filter(n => n !== num) 
                      : [...prev, num]
                  )
                }}
                className={`w-14 h-14 rounded-xl font-bold text-lg transition-all ${
                  selectedTables.includes(num) 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 transform scale-105' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 mb-6">
          <div>
            <label className="block font-bold mb-3 flex items-center gap-2 text-slate-700">
              <Settings className="w-5 h-5 text-blue-500" />
              2. Carregar Atividades (JSON)
            </label>
            <div className="w-full p-8 sm:p-12 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50 flex flex-col items-center justify-center text-center transition-colors hover:bg-slate-100/80 group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-200 group-hover:scale-105 transition-transform">
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-slate-500 mb-6 max-w-md">Selecione o arquivo JSON contendo a estrutura da missão de estudo gerada offline.</p>
              <div className="flex flex-col gap-4 sm:flex-row items-center w-full sm:w-auto">
                <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                  <FileText className="w-5 h-5" />
                  Escolher Arquivo JSON
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        try {
                          const json = JSON.parse(event.target?.result as string);
                          
                          // Gera as tabuadas estáticas baseado na seleção do usuário
                          const generatedTabuadas = selectedTables.map(num => {
                            const apresentacao_crescente_completa = Array.from({length: 10}, (_, i) => ({
                              fator_a: num,
                              fator_b: i + 1,
                              produto: num * (i + 1)
                            }));
                            
                            const bateria_desafio_sequencial = apresentacao_crescente_completa.map(fact => ({
                              equacao_apresentada: `${fact.fator_a} x ${fact.fator_b}`,
                              resultado_correto: fact.produto,
                              dica_calculo_mental: fact.fator_b === 1 ? 'Qualquer número multiplicado por 1 é ele mesmo!' : `Lembre-se de adicionar ${fact.fator_a} ao resultado anterior.`
                            }));
                            
                            const bateria_desafio_aleatorio = [...bateria_desafio_sequencial].sort(() => Math.random() - 0.5);
                        
                            return {
                              multiplo_selecionado: num,
                              apresentacao_crescente_completa,
                              bateria_desafio_sequencial,
                              bateria_desafio_aleatorio
                            };
                          });
                          
                          if (!json.atividades_matematica) {
                            json.atividades_matematica = {
                              blocos_tabuada: [],
                              bloco_operacoes_problemas: []
                            };
                          }
                          
                          // Substitui as tabuadas do JSON pelas geradas estaticamente
                          json.atividades_matematica.blocos_tabuada = generatedTabuadas;

                          const textoApoio = json.texto_de_apoio || json.metadados_pedagogicos?.texto_de_apoio || text;

                          onGenerate(json, textoApoio);
                        } catch (err) {
                          console.error('Arquivo JSON inválido. Verifique o formato.');
                        }
                      };
                      reader.readAsText(file);
                      e.target.value = '';
                    }}
                  />
                </label>
                <a 
                  href="/modelo_atividades.json" 
                  download 
                  className="text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-1"
                >
                  Baixar Modelo JSON
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avaliação de Missões */}
      {results.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 mt-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            Missões Concluídas pelo Aluno
          </h2>
          
          <div className="space-y-6">
            {results.map((result) => (
              <div key={result.id} className={`rounded-2xl border overflow-hidden transition-all duration-300 ${result.evaluated ? 'bg-slate-50 border-slate-200' : 'bg-blue-50/50 border-blue-200 shadow-sm'}`}>
                <div 
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 cursor-pointer hover:bg-black/5 transition-colors gap-4"
                  onClick={() => setExpandedMissionId(expandedMissionId === result.id ? null : result.id)}
                >
                  <h3 className="font-bold text-slate-700 flex items-center gap-3 text-lg">
                    {expandedMissionId === result.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    Missão de {new Date(result.date).toLocaleString()}
                  </h3>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {!result.evaluated && (
                      <button 
                        onClick={(e) => handleEvaluate(result.id, e)}
                        className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors"
                      >
                        Marcar Avaliado
                      </button>
                    )}
                    {result.evaluated && (
                      <span className="text-sm font-bold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200">
                        ✓ Avaliado
                      </span>
                    )}
                    <button 
                      onClick={(e) => handleDelete(result.id, e)}
                      className="text-red-400 hover:text-red-600 p-2.5 rounded-xl hover:bg-red-50 transition-colors"
                      title="Excluir Missão"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {expandedMissionId === result.id && (
                  <div className="p-6 pt-0 space-y-4 border-t border-black/5 mt-4">
                    {/* Reading Text */}
                    {result.readingText && (
                    <div className="bg-white rounded border border-slate-200 text-sm overflow-hidden mb-4">
                      <button 
                        onClick={() => setExpandedTextId(expandedTextId === result.id ? null : result.id)}
                        className="w-full flex justify-between items-center p-3 bg-slate-50 hover:bg-slate-100 font-bold text-slate-700 transition-colors"
                      >
                        <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Texto de Apoio Utilizado</span>
                        {expandedTextId === result.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      {expandedTextId === result.id && (
                        <div className="p-4 whitespace-pre-wrap text-slate-600 bg-white border-t border-slate-100">
                          {result.readingText}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reading Answers */}
                  {result.readingAnswers.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wide flex items-center gap-2 mb-2"><BookOpen className="w-4 h-4" /> Interpretação de Texto</h4>
                      {result.readingAnswers.map((ra, idx) => (
                        <div key={idx} className={`bg-white p-3 rounded border text-sm mb-2 relative pr-10 ${ra.needsReview ? 'border-amber-400 bg-amber-50' : 'border-slate-200'}`}>
                          <button 
                            onClick={() => toggleNeedsReview(result.id, 'reading', idx)}
                            className={`absolute right-3 top-3 p-1 rounded transition-colors ${ra.needsReview ? 'text-amber-600 hover:text-amber-700 bg-amber-100' : 'text-slate-300 hover:text-amber-500'}`}
                            title="Marcar para Revisão"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                          
                          {ra.askedForHelp && (
                            <div className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold mb-2">
                              <AlertTriangle className="w-3 h-3" /> Pediu Ajuda
                            </div>
                          )}
                          <p className="font-bold text-slate-700 mb-1 pr-6">Q: {ra.question}</p>
                          <p className="text-slate-600"><strong>R:</strong> {ra.answer || <span className="italic text-slate-400">(Em branco)</span>}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Math Challenge Answers */}
                  {result.mathChallengeAnswers.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wide flex items-center gap-2 mb-2"><Calculator className="w-4 h-4" /> Tabuada</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {result.mathChallengeAnswers.map((mc, idx) => (
                          <div key={idx} className={`bg-white p-2 rounded border text-sm flex flex-col relative pr-8 ${mc.needsReview ? 'border-amber-400 bg-amber-50' : 'border-slate-200'}`}>
                            <button 
                              onClick={() => toggleNeedsReview(result.id, 'challenge', idx)}
                              className={`absolute right-2 top-2 p-1 rounded transition-colors ${mc.needsReview ? 'text-amber-600 hover:text-amber-700 bg-amber-100' : 'text-slate-300 hover:text-amber-500'}`}
                              title="Marcar para Revisão"
                            >
                              <Flag className="w-3 h-3" />
                            </button>

                            {mc.askedForHelp && (
                              <div className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold mb-1 w-max">
                                <AlertTriangle className="w-3 h-3" /> Ajuda
                              </div>
                            )}

                            <div className="flex justify-between items-center mb-1 pr-6">
                              <span className="font-mono font-bold text-slate-700">{mc.question}</span>
                              <span className={`font-bold ${mc.correct ? 'text-emerald-600' : 'text-red-600'}`}>{mc.answer || '-'}</span>
                            </div>

                            {mc.mistakes && mc.mistakes.length > 0 && (
                              <div className="text-[11px] text-slate-500 mt-1 border-t border-slate-100 pt-1">
                                <span className="font-semibold text-red-500">Erros:</span> {mc.mistakes.join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Math Problem Answers */}
                  {result.mathProblemAnswers.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wide flex items-center gap-2 mb-2"><Calculator className="w-4 h-4" /> Problemas Matemáticos</h4>
                      {result.mathProblemAnswers.map((mp, idx) => (
                        <div key={idx} className={`bg-white p-3 rounded border text-sm mb-2 relative pr-10 ${mp.needsReview ? 'border-amber-400 bg-amber-50' : 'border-slate-200'}`}>
                          <button 
                            onClick={() => toggleNeedsReview(result.id, 'problem', idx)}
                            className={`absolute right-3 top-3 p-1 rounded transition-colors ${mp.needsReview ? 'text-amber-600 hover:text-amber-700 bg-amber-100' : 'text-slate-300 hover:text-amber-500'}`}
                            title="Marcar para Revisão"
                          >
                            <Flag className="w-4 h-4" />
                          </button>

                          {mp.askedForHelp && (
                            <div className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold mb-2">
                              <AlertTriangle className="w-3 h-3" /> Pediu Ajuda
                            </div>
                          )}
                          <p className="font-bold text-slate-700 mb-1 pr-6">Problema: {mp.problem}</p>
                          <p className="text-slate-600 font-mono mb-1">Expressão: {mp.expression || <span className="italic text-slate-400">(Nenhuma)</span>}</p>
                          <p className="text-slate-600"><strong>Resultado:</strong> <span className={mp.correct ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>{mp.answer || '-'}</span></p>
                        </div>
                      ))}
                    </div>
                  )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
