import React, { useState, useEffect } from 'react';
import { FileText, Settings, Key, CheckCircle2, BookOpen, Calculator, AlertTriangle, Flag, ChevronDown, ChevronUp } from 'lucide-react';
import { GeneratedStudySession } from '../types';
import { getStudentResults, StudentResult, evaluateStudentResult, updateStudentResult } from '../lib/db';

interface TutorDashboardProps {
  onGenerate: (data: GeneratedStudySession, text: string) => void;
}

export const TutorDashboard: React.FC<TutorDashboardProps> = ({ onGenerate }) => {
  const [text, setText] = useState('');
  const [results, setResults] = useState<StudentResult[]>([]);
  const [expandedTextId, setExpandedTextId] = useState<string | null>(null);

  useEffect(() => {
    getStudentResults().then(res => setResults(res.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())));
  }, []);

  const handleEvaluate = async (id: string) => {
    await evaluateStudentResult(id);
    setResults(await getStudentResults());
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
    setResults(await getStudentResults());
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800">Configuração da Sessão de Estudo</h1>
        <p className="text-slate-500 mt-2">Insira o texto de leitura e defina os parâmetros para a Inteligência Artificial gerar a aula.</p>
      </header>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <label className="block font-bold mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Texto Base para Interpretação (Cole a história aqui):
        </label>
        <textarea 
          rows={8} 
          className="w-full p-4 border-2 border-slate-200 rounded-xl mb-6 focus:border-blue-500 outline-none resize-y" 
          placeholder="Era uma vez, numa floresta distante..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        
        <div className="grid grid-cols-1 mb-6">
          <div>
            <label className="block font-bold mb-2 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-500" />
              Carregar Atividades (JSON)
            </label>
            <div className="w-full p-8 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center transition-colors hover:bg-slate-100">
              <p className="text-slate-500 mb-4">Selecione o arquivo JSON contendo a estrutura da missão de estudo gerada offline.</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 items-center">
                <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center gap-2">
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
                          onGenerate(json, text);
                        } catch (err) {
                          alert('Arquivo JSON inválido. Verifique o formato.');
                        }
                      };
                      reader.readAsText(file);
                      // Reset input so the same file can be uploaded again if needed
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
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mt-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            Missões Concluídas pelo Aluno
          </h2>
          
          <div className="space-y-6">
            {results.map((result) => (
              <div key={result.id} className={`p-6 rounded-xl border ${result.evaluated ? 'bg-slate-50 border-slate-200' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-700">Data: {new Date(result.date).toLocaleString()}</h3>
                  {!result.evaluated && (
                    <button 
                      onClick={() => handleEvaluate(result.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
                    >
                      Marcar como Avaliado
                    </button>
                  )}
                  {result.evaluated && (
                    <span className="text-sm font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                      ✓ Avaliado
                    </span>
                  )}
                </div>

                <div className="space-y-4">
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
