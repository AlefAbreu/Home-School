import React, { useState, useEffect } from 'react';
import { Flame, Award, CheckCircle2, AlertCircle, BookOpen, PenTool } from 'lucide-react';
import { GeneratedStudySession } from '../types';
import { CanvasTimer } from './CanvasTimer';
import { getGamification, incrementMissions, awardBadge, UserStats, saveStudentResult, StudentResult } from '../lib/db';
import { motion, AnimatePresence } from 'framer-motion';
import { PomodoroTimer } from './PomodoroTimer';

interface ChildDashboardProps {
  session: GeneratedStudySession;
  baseText: string;
}

type StudyPhase = 'reading' | 'math_priming' | 'math_challenge' | 'math_timed' | 'math_problem' | 'completed';
type TabType = 'text' | 'activities';

export const ChildDashboard: React.FC<ChildDashboardProps> = ({ session, baseText }) => {
  const [phase, setPhase] = useState<StudyPhase>('reading');
  const [activeTab, setActiveTab] = useState<TabType>('text');
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

      {/* Top Header Navigation */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-4 py-3 flex flex-wrap gap-3 sm:gap-4 items-center justify-between shadow-sm z-10">
        
        {/* Pomodoro and Streaks for Mobile/Desktop */}
        <div className="w-full lg:w-auto flex justify-between items-center order-1 lg:order-2 lg:flex-1 lg:justify-center">
          <PomodoroTimer />
          
          {/* Streaks Mobile */}
          <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-3 py-2 rounded-xl font-bold text-sm">
            <Flame className="w-5 h-5" />
            <span className="hidden sm:inline">{stats.missionsCompleted} Missões</span>
            <span className="sm:hidden">{stats.missionsCompleted}</span>
          </div>
        </div>

        {/* Streaks Desktop */}
        <div className="hidden lg:flex items-center gap-1 bg-orange-100 text-orange-600 px-4 py-2 rounded-xl font-bold text-sm order-3">
          <Flame className="w-5 h-5" />
          {stats.missionsCompleted} Missões
        </div>

        {/* Mobile Tabs */}
        <div className="flex gap-2 w-full lg:w-auto justify-center lg:justify-start order-2 lg:order-1">
          <button 
            onClick={() => setActiveTab('text')}
            className={`flex-1 lg:flex-none px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'text' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-sm sm:text-base">Texto</span>
          </button>
          <button 
            onClick={() => setActiveTab('activities')}
            className={`flex-1 lg:flex-none px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'activities' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <PenTool className="w-5 h-5" />
            <span className="text-sm sm:text-base">Atividades</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Pergaminho Textual (Left side) */}
        <div className={`w-full lg:w-5/12 bg-white p-6 lg:p-8 overflow-y-auto border-r border-slate-200 relative ${activeTab === 'text' ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-0 bg-white pb-4 mb-4 border-b border-slate-100 flex justify-between items-center z-10 hidden lg:flex">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-500" />
              Texto de Apoio
            </h2>
          </div>
          <article className="prose prose-lg text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
            {baseText || "(Aguardando o Tutor inserir a história...)"}
          </article>
        </div>

        {/* Área de Questões (Right side) */}
        <div className={`w-full lg:w-7/12 p-4 lg:p-8 overflow-y-auto bg-[#F8FAFC] ${activeTab === 'activities' ? 'block' : 'hidden lg:block'}`}>
          <div className="max-w-2xl mx-auto pb-24">
            <AnimatePresence mode="wait">
              {phase === 'reading' && (
                <motion.div 
                  key="reading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100"
                >
                  <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-xl text-sm font-bold mb-6">
                    Interpretação ({readingIndex + 1}/{session.atividades_leitura?.length || 1})
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-6 text-slate-800 leading-snug">
                    {readingIndex + 1}. {session.atividades_leitura?.[readingIndex]?.enunciado_pergunta}
                  </h3>
                  
                  <textarea 
                    rows={4} 
                    className="w-full p-5 text-lg border-2 border-slate-200 rounded-2xl focus:border-blue-500 outline-none resize-none font-sans bg-slate-50 focus:bg-white transition-colors" 
                    placeholder="Escreva sua resposta aqui... Lembre-se de justificar com um trecho do texto!"
                    value={readingAnswer}
                    onChange={(e) => setReadingAnswer(e.target.value)}
                  />
                  
                  {readingFeedback && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`mt-4 p-5 rounded-2xl flex items-start gap-3 ${
                        readingFeedback.includes('Muito bem') 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {readingFeedback.includes('Muito bem') ? (
                        <CheckCircle2 className="w-6 h-6 mt-0.5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-6 h-6 mt-0.5 shrink-0" />
                      )}
                      <p className="font-semibold text-base leading-snug">{readingFeedback}</p>
                    </motion.div>
                  )}
                  
                  <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                    <button 
                      onClick={handleAskForHelpReading}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold py-3.5 px-6 rounded-2xl shadow-sm transition-colors text-center"
                    >
                      Pedir Ajuda ao Tutor
                    </button>
                    <button 
                      onClick={handleReadingSubmit}
                      className="bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-md transition-colors text-center"
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
                  className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100"
                >
                  <div className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-bold mb-6">
                    Matemática (Nível 1: Teste Cego Sequencial - {challengeIndex + 1}/10)
                  </div>
                  
                  {showHint && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-amber-50 p-5 rounded-2xl border border-amber-200 mb-6 text-amber-800"
                    >
                      <strong>💡 Dica do Tutor:</strong> {session.atividades_matematica.blocos_tabuada[tableIndex].bateria_desafio_sequencial[challengeIndex].dica_calculo_mental}
                    </motion.div>
                  )}

                  <h3 className="text-3xl sm:text-4xl font-extrabold mb-10 text-center mt-4 text-slate-700">
                    Quanto é <span className="text-blue-600 font-mono bg-blue-50 px-3 py-1 rounded-xl">{session.atividades_matematica.blocos_tabuada[tableIndex].bateria_desafio_sequencial[challengeIndex].equacao_apresentada}</span> ?
                  </h3>
                  
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <input 
                      type="number" 
                      value={mathAnswer}
                      onChange={(e) => setMathAnswer(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleMathChallengeSubmit();
                      }}
                      className="w-36 sm:w-48 p-4 sm:p-6 text-4xl font-mono font-bold border-4 border-slate-200 rounded-3xl focus:border-emerald-500 outline-none text-center transition-colors bg-slate-50 focus:bg-white" 
                      placeholder="?"
                      autoFocus
                    />
                  </div>

                  {mathFeedback && (
                    <p className="text-center font-bold text-emerald-600 text-lg mb-6">{mathFeedback}</p>
                  )}

                  <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                    <button 
                      onClick={handleAskForHelpMathChallenge}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold py-3.5 px-6 rounded-2xl shadow-sm transition-colors"
                    >
                      Pedir Ajuda ao Tutor
                    </button>
                    <button 
                      onClick={handleMathChallengeSubmit}
                      className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-md transition-colors"
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
                  className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden"
                >
                  <div className="inline-block px-4 py-1.5 bg-red-100 text-red-700 rounded-xl text-sm font-bold mb-6">
                    Matemática (Nível 2: Aleatório Contra o Relógio - {challengeIndex + 1}/10)
                  </div>
                  
                  <div className="mb-8">
                    <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Tempo Restante (Canvas requestAnimationFrame)</p>
                    <CanvasTimer 
                      duration={15} 
                      isRunning={!timedFailed && !mathFeedback}
                      onComplete={() => setTimedFailed(true)} 
                      key={`timer-${tableIndex}-${challengeIndex}`}
                    />
                  </div>

                  {timedFailed ? (
                    <div className="text-center py-10">
                      <h3 className="text-3xl font-extrabold text-red-500 mb-6">O tempo esgotou!</h3>
                      <button 
                        onClick={() => { setTimedFailed(false); setMathAnswer(''); }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-8 rounded-2xl transition-colors"
                      >
                        Tentar Novamente
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-3xl sm:text-4xl font-extrabold mb-10 text-center mt-4 text-slate-700">
                        Rápido! Quanto é <span className="text-red-600 font-mono bg-red-50 px-3 py-1 rounded-xl">{session.atividades_matematica.blocos_tabuada[tableIndex].bateria_desafio_aleatorio[challengeIndex].equacao_apresentada}</span> ?
                      </h3>
                      
                      <div className="flex items-center justify-center gap-4 mb-8">
                        <input 
                          type="number" 
                          value={mathAnswer}
                          onChange={(e) => setMathAnswer(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleMathTimedSubmit();
                          }}
                          className="w-36 sm:w-48 p-4 sm:p-6 text-4xl font-mono font-bold border-4 border-slate-200 rounded-3xl focus:border-red-500 outline-none text-center transition-colors bg-slate-50 focus:bg-white" 
                          placeholder="?"
                          autoFocus
                        />
                      </div>

                      {mathFeedback && (
                         <p className="text-center font-bold text-emerald-600 text-lg mb-6">{mathFeedback}</p>
                      )}

                      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                        <button 
                          onClick={handleAskForHelpMathTimed}
                          className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold py-3.5 px-6 rounded-2xl shadow-sm transition-colors"
                        >
                          Pedir Ajuda ao Tutor
                        </button>
                        <button 
                          onClick={handleMathTimedSubmit}
                          className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-md transition-colors"
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
                  className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 mb-8"
                >
                  <div className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-xl text-sm font-bold mb-6">
                    Matemática (Problemas: {problemIndex + 1}/{session.atividades_matematica?.bloco_operacoes_problemas?.length || 1})
                  </div>
                  
                  {/* Cápsula Teórica Introdutória */}
                  {session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.capsula_teorica_introdutoria && (
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-8 text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                      {session.atividades_matematica.bloco_operacoes_problemas[problemIndex].capsula_teorica_introdutoria}
                    </div>
                  )}

                  <h3 className="text-xl sm:text-2xl font-bold mb-8 text-slate-800 leading-snug">
                    {session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.enunciado_textual_problema}
                  </h3>
                  
                  {/* Área de resposta matemática */}
                  
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

                  {mathFeedback && (
                    <p className={`text-center font-bold text-lg mb-6 ${mathFeedback.includes('perfeição') ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {mathFeedback}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                    <button 
                      onClick={handleAskForHelpMathProblem}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold py-3.5 px-6 rounded-2xl shadow-sm transition-colors"
                    >
                      Pedir Ajuda ao Tutor
                    </button>
                    <button 
                      onClick={handleMathProblemSubmit}
                      className="bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-md transition-colors"
                    >
                      Verificar Cálculo Final
                    </button>
                  </div>
                </motion.div>
              )}

              {phase === 'completed' && (
                <motion.div 
                  key="completed"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-10 sm:p-16 rounded-[2.5rem] shadow-sm border-2 border-emerald-100 text-center"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-yellow-100">
                    <Award className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500" />
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-800 mb-6 tracking-tight">Missão Cumprida!</h2>
                  <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-md mx-auto leading-relaxed">Você concluiu todos os desafios de hoje de forma brilhante.</p>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 sm:p-8 rounded-3xl border border-orange-100/50 inline-block shadow-sm">
                    <div className="flex items-center justify-center gap-3 text-orange-600 font-extrabold text-2xl sm:text-3xl mb-3">
                      <Flame className="w-8 h-8 sm:w-10 sm:h-10 fill-current text-orange-500" />
                      {stats.missionsCompleted} Missões Concluídas!
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-orange-800/80">Sua chama continua acesa. Volte amanhã!</p>
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
