import React, { useState, useEffect } from 'react';
import { Flame, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { GeneratedStudySession } from '../types';
import { CanvasTimer } from './CanvasTimer';
import { getGamification, incrementMissions, awardBadge, UserStats, saveStudentResult, StudentResult } from '../lib/db';
import { motion, AnimatePresence } from 'framer-motion';

interface ChildDashboardProps {
  session: GeneratedStudySession;
  baseText: string;
}

type StudyPhase = 'reading' | 'math_priming' | 'math_challenge' | 'math_timed' | 'math_problem' | 'completed';

export const ChildDashboard: React.FC<ChildDashboardProps> = ({ session, baseText }) => {
  const [phase, setPhase] = useState<StudyPhase>('reading');
  const [stats, setStats] = useState<UserStats | null>(null);
  
  // Reading state
  const [readingAnswer, setReadingAnswer] = useState('');
  const [readingFeedback, setReadingFeedback] = useState<string | null>(null);
  
  // Math Challenge State
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathFeedback, setMathFeedback] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  
  // Math Timed State
  const [timedFailed, setTimedFailed] = useState(false);
  
  const [readingAnswers, setReadingAnswers] = useState<StudentResult['readingAnswers']>([]);
  const [mathChallengeAnswers, setMathChallengeAnswers] = useState<StudentResult['mathChallengeAnswers']>([]);
  const [mathProblemAnswers, setMathProblemAnswers] = useState<StudentResult['mathProblemAnswers']>([]);
  
  const [problemExpression, setProblemExpression] = useState('');
  
  const [currentMistakes, setCurrentMistakes] = useState<string[]>([]);

  const [readingIndex, setReadingIndex] = useState(0);
  const [problemIndex, setProblemIndex] = useState(0);

  useEffect(() => {
    // Load gamification stats from IndexedDB
    getGamification().then(setStats);
  }, []);

  const [tableIndex, setTableIndex] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);

  const completeSession = async (finalProblemAnswers = mathProblemAnswers, finalChallengeAnswers = mathChallengeAnswers, finalReadingAnswers = readingAnswers) => {
    // Save to IndexedDB
    await saveStudentResult({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      readingText: baseText,
      readingAnswers: finalReadingAnswers,
      mathChallengeAnswers: finalChallengeAnswers,
      mathProblemAnswers: finalProblemAnswers,
      evaluated: false
    });

    // Award gamification
    await incrementMissions();
    await awardBadge("Sábio Intratável");
    const newStats = await getGamification();
    setStats(newStats);
    setPhase('completed');
  };

  const handleReadingSubmit = () => {
    const isShort = readingAnswer.trim().length < 20;
    
    if (session.atividades_leitura?.[readingIndex]?.obriga_justificacao_textual && isShort) {
      setReadingFeedback("Excelente início! Todavia, recorde-se da nossa regra: Não se esqueça de comprovar o porquê referenciando explicitamente a parte do texto onde extraiu a sua brilhante dedução!");
    } else {
      setReadingFeedback("Muito bem! Resposta submetida com sucesso.");
      
      const newAnswers = [...readingAnswers, {
        question: session.atividades_leitura?.[readingIndex]?.enunciado_pergunta || '',
        answer: readingAnswer,
        isCorrect: null
      }];
      setReadingAnswers(newAnswers);

      setTimeout(() => {
        setReadingFeedback(null);
        setReadingAnswer('');
        
        if (readingIndex < (session.atividades_leitura?.length || 1) - 1) {
          setReadingIndex(prev => prev + 1);
        } else {
          if (session.atividades_matematica?.blocos_tabuada && session.atividades_matematica.blocos_tabuada.length > 0) {
            setPhase('math_priming');
          } else if (session.atividades_matematica?.bloco_operacoes_problemas && session.atividades_matematica.bloco_operacoes_problemas.length > 0) {
            setPhase('math_problem');
          } else {
            completeSession([], mathChallengeAnswers, newAnswers);
          }
        }
      }, 2000);
    }
  };

  const handleAskForHelpReading = () => {
    const newAnswers = [...readingAnswers, {
      question: session.atividades_leitura?.[readingIndex]?.enunciado_pergunta || '',
      answer: readingAnswer,
      isCorrect: null,
      askedForHelp: true
    }];
    setReadingAnswers(newAnswers);
    setReadingFeedback(null);
    setReadingAnswer('');
    
    if (readingIndex < (session.atividades_leitura?.length || 1) - 1) {
      setReadingIndex(prev => prev + 1);
    } else {
      if (session.atividades_matematica?.blocos_tabuada && session.atividades_matematica.blocos_tabuada.length > 0) {
        setPhase('math_priming');
      } else if (session.atividades_matematica?.bloco_operacoes_problemas && session.atividades_matematica.bloco_operacoes_problemas.length > 0) {
        setPhase('math_problem');
      } else {
        completeSession([], mathChallengeAnswers, newAnswers);
      }
    }
  };

  const handleMathPrimingNext = () => {
    setChallengeIndex(0);
    setPhase('math_challenge');
  };

  const handleMathChallengeSubmit = () => {
    const currentTable = session.atividades_matematica.blocos_tabuada[tableIndex];
    const correct = currentTable.bateria_desafio_sequencial[challengeIndex].resultado_correto;
    
    if (parseInt(mathAnswer) === correct) {
      setMathFeedback("Correto! Brilhante dedução.");
      setShowHint(false);
      
      const newAnswers = [...mathChallengeAnswers, {
        question: currentTable.bateria_desafio_sequencial[challengeIndex].equacao_apresentada,
        answer: mathAnswer,
        correct: true,
        mistakes: currentMistakes
      }];
      setMathChallengeAnswers(newAnswers);
      setCurrentMistakes([]);

      setTimeout(() => {
        setMathFeedback(null);
        setMathAnswer('');
        if (challengeIndex < 9) {
          setChallengeIndex(challengeIndex + 1);
        } else {
          setChallengeIndex(0);
          setPhase('math_timed');
        }
      }, 1500);
    } else {
      setCurrentMistakes(prev => [...prev, mathAnswer]);
      setShowHint(true);
    }
  };
  
  const handleAskForHelpMathChallenge = () => {
    const currentTable = session.atividades_matematica.blocos_tabuada[tableIndex];
    const newAnswers = [...mathChallengeAnswers, {
      question: currentTable.bateria_desafio_sequencial[challengeIndex].equacao_apresentada,
      answer: mathAnswer,
      correct: false,
      mistakes: currentMistakes,
      askedForHelp: true
    }];
    setMathChallengeAnswers(newAnswers);
    setCurrentMistakes([]);
    setMathFeedback(null);
    setMathAnswer('');
    setShowHint(false);

    if (challengeIndex < 9) {
      setChallengeIndex(challengeIndex + 1);
    } else {
      setChallengeIndex(0);
      setPhase('math_timed');
    }
  };

  const handleMathTimedSubmit = () => {
    const currentTable = session.atividades_matematica.blocos_tabuada[tableIndex];
    const correct = currentTable.bateria_desafio_aleatorio[challengeIndex].resultado_correto;
    
    if (parseInt(mathAnswer) === correct) {
      setMathFeedback("Rápido e preciso!");
      
      const newAnswers = [...mathChallengeAnswers, {
        question: currentTable.bateria_desafio_aleatorio[challengeIndex].equacao_apresentada,
        answer: mathAnswer,
        correct: true,
        mistakes: currentMistakes
      }];
      setMathChallengeAnswers(newAnswers);
      setCurrentMistakes([]);

      setTimeout(() => {
        setMathFeedback(null);
        setMathAnswer('');
        if (challengeIndex < 9) {
          setChallengeIndex(challengeIndex + 1);
        } else {
          // Finished this table's timed challenges
          if (tableIndex < session.atividades_matematica.blocos_tabuada.length - 1) {
            setTableIndex(tableIndex + 1);
            setPhase('math_priming');
          } else {
            if (session.atividades_matematica?.bloco_operacoes_problemas && session.atividades_matematica.bloco_operacoes_problemas.length > 0) {
               setPhase('math_problem');
            } else {
               completeSession([], newAnswers, readingAnswers);
            }
          }
        }
      }, 1500);
    } else {
      setCurrentMistakes(prev => [...prev, mathAnswer]);
      setMathAnswer('');
      // Keep trying
    }
  };

  const handleAskForHelpMathTimed = () => {
    const currentTable = session.atividades_matematica.blocos_tabuada[tableIndex];
    const newAnswers = [...mathChallengeAnswers, {
      question: currentTable.bateria_desafio_aleatorio[challengeIndex].equacao_apresentada,
      answer: mathAnswer,
      correct: false,
      mistakes: currentMistakes,
      askedForHelp: true
    }];
    setMathChallengeAnswers(newAnswers);
    setCurrentMistakes([]);
    setMathFeedback(null);
    setMathAnswer('');
    setTimedFailed(false);

    if (challengeIndex < 9) {
      setChallengeIndex(challengeIndex + 1);
    } else {
      if (tableIndex < session.atividades_matematica.blocos_tabuada.length - 1) {
        setTableIndex(tableIndex + 1);
        setPhase('math_priming');
      } else {
        if (session.atividades_matematica?.bloco_operacoes_problemas && session.atividades_matematica.bloco_operacoes_problemas.length > 0) {
           setPhase('math_problem');
        } else {
           completeSession([], newAnswers, readingAnswers);
        }
      }
    }
  };

  const handleMathProblemSubmit = async () => {
    const currentProblem = session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex];
    const correct = currentProblem?.solucao_matematica_esperada || 0;
    
    if (parseFloat(mathAnswer.replace(',', '.')) === correct) {
      setMathFeedback("Problema resolvido com perfeição!");
      
      const probAnswers = [...mathProblemAnswers, {
        problem: currentProblem?.enunciado_textual_problema || '',
        expression: problemExpression,
        answer: mathAnswer,
        correct: true
      }];
      setMathProblemAnswers(probAnswers);

      setTimeout(() => {
        setMathFeedback(null);
        setMathAnswer('');
        setProblemExpression('');
        
        if (problemIndex < (session.atividades_matematica?.bloco_operacoes_problemas?.length || 1) - 1) {
          setProblemIndex(prev => prev + 1);
        } else {
          completeSession(probAnswers);
        }
      }, 2000);
    } else {
      setMathFeedback("Ops, tente novamente! Verifique a dica.");
    }
  };

  const handleAskForHelpMathProblem = async () => {
    const currentProblem = session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex];
    const probAnswers = [...mathProblemAnswers, {
      problem: currentProblem?.enunciado_textual_problema || '',
      expression: problemExpression,
      answer: mathAnswer,
      correct: false,
      askedForHelp: true
    }];
    setMathProblemAnswers(probAnswers);
    
    setMathFeedback(null);
    setMathAnswer('');
    setProblemExpression('');
    
    if (problemIndex < (session.atividades_matematica?.bloco_operacoes_problemas?.length || 1) - 1) {
      setProblemIndex(prev => prev + 1);
    } else {
      completeSession(probAnswers);
    }
  };

  const getProgressWidth = () => {
    switch (phase) {
      case 'reading': return '20%';
      case 'math_priming': return '40%';
      case 'math_challenge': return '60%';
      case 'math_timed': return '80%';
      case 'math_problem': return '95%';
      case 'completed': return '100%';
      default: return '0%';
    }
  };

  if (!stats) return null;

  return (
    <div className="h-[calc(100vh-80px)] w-full bg-blue-50 flex flex-col">
      {/* Barra de Progresso Visual Segmentada */}
      <div className="w-full h-4 bg-slate-200 flex">
        <div 
          className="bg-blue-500 h-full transition-all duration-500 ease-out" 
          style={{ width: getProgressWidth() }}
        />
      </div>

      <div className="flex flex-col md:flex-row h-full overflow-hidden">
        {/* Pergaminho Textual (Left side) */}
        <div className="w-full md:w-5/12 bg-white p-8 overflow-y-auto border-r border-slate-200 relative">
          <div className="sticky top-0 bg-white pb-4 mb-4 border-b border-slate-100 flex justify-between items-center z-10">
            <h2 className="text-2xl font-bold text-slate-800">Texto de Apoio</h2>
            {/* Streaks (Gamification) */}
            <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold text-sm">
              <Flame className="w-4 h-4" />
              {stats.missionsCompleted} Missões
            </div>
          </div>
          <article className="prose prose-lg text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
            {baseText || "(Aguardando o Tutor inserir a história...)"}
          </article>
        </div>

        {/* Área de Questões (Right side) */}
        <div className="w-full md:w-7/12 p-8 overflow-y-auto bg-[#F8FAFC]">
          <div className="max-w-2xl mx-auto pb-24">
            <AnimatePresence mode="wait">
              {phase === 'reading' && (
                <motion.div 
                  key="reading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                >
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold mb-4">
                    Interpretação ({readingIndex + 1}/{session.atividades_leitura?.length || 1})
                  </div>
                  <h3 className="text-xl font-bold mb-4">
                    {readingIndex + 1}. {session.atividades_leitura?.[readingIndex]?.enunciado_pergunta}
                  </h3>
                  
                  <textarea 
                    rows={4} 
                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none resize-none font-sans" 
                    placeholder="Escreva sua resposta aqui... Lembre-se de justificar com um trecho do texto!"
                    value={readingAnswer}
                    onChange={(e) => setReadingAnswer(e.target.value)}
                  />
                  
                  {readingFeedback && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`mt-4 p-4 rounded-xl flex items-start gap-3 ${
                        readingFeedback.includes('Muito bem') 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {readingFeedback.includes('Muito bem') ? (
                        <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                      )}
                      <p className="text-sm font-semibold">{readingFeedback}</p>
                    </motion.div>
                  )}
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <button 
                      onClick={handleAskForHelpReading}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold py-3 px-6 rounded-xl shadow-sm transition-colors"
                    >
                      Pedir Ajuda ao Tutor
                    </button>
                    <button 
                      onClick={handleReadingSubmit}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors"
                    >
                      Responder
                    </button>
                  </div>
                </motion.div>
              )}

              {phase === 'math_priming' && session.atividades_matematica?.blocos_tabuada && (
                <motion.div 
                  key="math_priming"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                >
                  <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold mb-4">
                    Matemática (Nível 0: Exposição - Tabuada do {session.atividades_matematica.blocos_tabuada[tableIndex].multiplo_selecionado})
                  </div>
                  <h3 className="text-xl font-bold mb-6 text-center">Observe a sequência atentamente:</h3>
                  
                  <div className="space-y-3 max-w-sm mx-auto mb-8">
                    {session.atividades_matematica.blocos_tabuada[tableIndex].apresentacao_crescente_completa?.map((fact, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="flex justify-between items-center text-2xl font-mono bg-slate-50 p-3 rounded-lg border border-slate-100"
                      >
                        <span>{fact.fator_a} x {fact.fator_b}</span>
                        <span className="text-slate-400">=</span>
                        <span className="font-bold text-emerald-600">{fact.produto}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center">
                    <button 
                      onClick={handleMathPrimingNext}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors"
                    >
                      Estou Pronto!
                    </button>
                  </div>
                </motion.div>
              )}

              {phase === 'math_challenge' && session.atividades_matematica?.blocos_tabuada && (
                <motion.div 
                  key="math_challenge"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                >
                  <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold mb-4">
                    Matemática (Nível 1: Teste Cego Sequencial - {challengeIndex + 1}/10)
                  </div>
                  
                  {showHint && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-amber-50 p-5 rounded-xl border border-amber-200 mb-6 text-amber-800"
                    >
                      <strong>💡 Dica do Tutor:</strong> {session.atividades_matematica.blocos_tabuada[tableIndex].bateria_desafio_sequencial[challengeIndex].dica_calculo_mental}
                    </motion.div>
                  )}

                  <h3 className="text-3xl font-bold mb-8 text-center mt-4">
                    Quanto é <span className="text-blue-600 font-mono">{session.atividades_matematica.blocos_tabuada[tableIndex].bateria_desafio_sequencial[challengeIndex].equacao_apresentada}</span> ?
                  </h3>
                  
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <input 
                      type="number" 
                      value={mathAnswer}
                      onChange={(e) => setMathAnswer(e.target.value)}
                      className="w-32 p-4 text-3xl font-mono font-bold border-4 border-slate-200 rounded-2xl focus:border-emerald-500 outline-none text-center transition-colors" 
                      placeholder="?"
                      autoFocus
                    />
                  </div>

                  {mathFeedback && (
                    <p className="text-center font-bold text-green-600 mb-4">{mathFeedback}</p>
                  )}

                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={handleAskForHelpMathChallenge}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold py-3 px-6 rounded-xl shadow-sm transition-colors"
                    >
                      Pedir Ajuda ao Tutor
                    </button>
                    <button 
                      onClick={handleMathChallengeSubmit}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors"
                    >
                      Verificar Cálculo
                    </button>
                  </div>
                </motion.div>
              )}
              
              {phase === 'math_timed' && session.atividades_matematica?.blocos_tabuada && (
                <motion.div 
                  key="math_timed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden"
                >
                  <div className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-bold mb-4">
                    Matemática (Nível 2: Aleatório Contra o Relógio - {challengeIndex + 1}/10)
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Tempo Restante (Canvas requestAnimationFrame)</p>
                    <CanvasTimer 
                      duration={15} 
                      isRunning={!timedFailed && !mathFeedback}
                      onComplete={() => setTimedFailed(true)} 
                      key={`timer-${tableIndex}-${challengeIndex}`}
                    />
                  </div>

                  {timedFailed ? (
                    <div className="text-center py-8">
                      <h3 className="text-2xl font-bold text-red-500 mb-4">O tempo esgotou!</h3>
                      <button 
                        onClick={() => { setTimedFailed(false); setMathAnswer(''); }}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-6 rounded-xl"
                      >
                        Tentar Novamente
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-3xl font-bold mb-8 text-center mt-4">
                        Rápido! Quanto é <span className="text-red-600 font-mono">{session.atividades_matematica.blocos_tabuada[tableIndex].bateria_desafio_aleatorio[challengeIndex].equacao_apresentada}</span> ?
                      </h3>
                      
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <input 
                          type="number" 
                          value={mathAnswer}
                          onChange={(e) => setMathAnswer(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleMathTimedSubmit();
                          }}
                          className="w-32 p-4 text-3xl font-mono font-bold border-4 border-slate-200 rounded-2xl focus:border-red-500 outline-none text-center transition-colors" 
                          placeholder="?"
                          autoFocus
                        />
                      </div>

                      {mathFeedback && (
                         <p className="text-center font-bold text-green-600 mb-4">{mathFeedback}</p>
                      )}

                      <div className="flex justify-center gap-3">
                        <button 
                          onClick={handleAskForHelpMathTimed}
                          className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold py-3 px-6 rounded-xl shadow-sm transition-colors"
                        >
                          Pedir Ajuda ao Tutor
                        </button>
                        <button 
                          onClick={handleMathTimedSubmit}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors"
                        >
                          Submeter Resposta
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {phase === 'math_problem' && (
                <motion.div 
                  key="math_problem"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8"
                >
                  <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-bold mb-4">
                    Matemática (Problemas: {problemIndex + 1}/{session.atividades_matematica?.bloco_operacoes_problemas?.length || 1})
                  </div>
                  
                  {/* Cápsula Teórica Introdutória */}
                  {session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.capsula_teorica_introdutoria && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-sm text-slate-700 leading-relaxed">
                      {session.atividades_matematica.bloco_operacoes_problemas[problemIndex].capsula_teorica_introdutoria}
                    </div>
                  )}

                  <h3 className="text-xl font-bold mb-6">
                    {session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.enunciado_textual_problema}
                  </h3>
                  
                  {/* Área de resposta matemática */}
                  
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-6">
                    <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">1. Monte a Expressão Matemática</p>
                    <div className="flex flex-col gap-4">
                      <input 
                        type="text" 
                        readOnly
                        value={problemExpression}
                        className="w-full p-4 text-2xl font-mono font-bold border-4 border-slate-200 rounded-2xl bg-white outline-none" 
                        placeholder="Ex: 50 - (2 * 10)"
                      />
                      <div className="grid grid-cols-5 gap-2">
                        {['7','8','9','+','-','4','5','6','*','/','1','2','3','(',')','0','.','C','<-'].map(btn => (
                          <button
                            key={btn}
                            onClick={() => {
                              if (btn === 'C') setProblemExpression('');
                              else if (btn === '<-') setProblemExpression(prev => prev.slice(0, -1));
                              else setProblemExpression(prev => prev + btn);
                            }}
                            className="bg-white hover:bg-purple-100 text-purple-900 font-bold py-3 rounded-xl border border-purple-200 shadow-sm transition-colors text-xl font-mono"
                          >
                            {btn}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">2. Resultado Final</p>
                  <div className="flex items-center justify-center gap-4 bg-slate-50 p-6 rounded-xl border border-slate-100 mb-6">
                    <span className="text-3xl font-bold text-slate-400">R$</span>
                    <input 
                      type="text" 
                      value={mathAnswer}
                      onChange={(e) => setMathAnswer(e.target.value)}
                      className="w-40 p-4 text-3xl font-mono font-bold border-4 border-slate-200 rounded-2xl focus:border-purple-500 outline-none text-center" 
                      placeholder="0,00"
                    />
                  </div>

                  {mathFeedback && (
                    <p className={`text-center font-bold mb-4 ${mathFeedback.includes('perfeição') ? 'text-green-600' : 'text-amber-600'}`}>
                      {mathFeedback}
                    </p>
                  )}

                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={handleAskForHelpMathProblem}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold py-3 px-6 rounded-xl shadow-sm transition-colors"
                    >
                      Pedir Ajuda ao Tutor
                    </button>
                    <button 
                      onClick={handleMathProblemSubmit}
                      className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors"
                    >
                      Verificar Cálculo Final
                    </button>
                  </div>
                </motion.div>
              )}

              {phase === 'completed' && (
                <motion.div 
                  key="completed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-12 rounded-3xl shadow-lg border-2 border-emerald-100 text-center"
                >
                  <Award className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-slate-800 mb-4">Missão Cumprida!</h2>
                  <p className="text-xl text-slate-600 mb-8">Você concluiu todos os desafios de hoje de forma brilhante.</p>
                  
                  <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 inline-block">
                    <div className="flex items-center justify-center gap-3 text-orange-600 font-bold text-2xl mb-2">
                      <Flame className="w-8 h-8 fill-current" />
                      {stats.missionsCompleted} Missões Concluídas!
                    </div>
                    <p className="text-sm text-orange-800">Sua chama continua acesa. Volte amanhã!</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
