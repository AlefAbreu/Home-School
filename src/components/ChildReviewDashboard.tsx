import React, { useState, useEffect } from 'react';
import { BookOpen, PenTool, CheckCircle2, AlertCircle, Award, Flame } from 'lucide-react';
import { StudentResult, updateStudentResult, getGamification, incrementMissions, awardBadge, UserStats } from '../lib/db';
import { FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChildReviewDashboardProps {
  result: StudentResult;
  onComplete: () => void;
}

type TabType = 'text' | 'activities';

export const ChildReviewDashboard: React.FC<ChildReviewDashboardProps> = ({ result, onComplete }) => {
  const [activeTab, setActiveTab] = useState<TabType>('activities');
  const [stats, setStats] = useState<UserStats | null>(null);

  // Filter tasks that need review
  const readingTasks = result.readingAnswers.map((a, i) => ({ ...a, originalIndex: i, type: 'reading' as const })).filter(a => a.needsReview);
  const challengeTasks = result.mathChallengeAnswers.map((a, i) => ({ ...a, originalIndex: i, type: 'challenge' as const })).filter(a => a.needsReview);
  const problemTasks = result.mathProblemAnswers.map((a, i) => ({ ...a, originalIndex: i, type: 'problem' as const })).filter(a => a.needsReview);

  const allTasks = [...readingTasks, ...challengeTasks, ...problemTasks];
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    getGamification().then(setStats);
  }, []);

  useEffect(() => {
    // If the current task changes and is reading, open text tab automatically if it exists
    if (allTasks[currentTaskIndex]?.type === 'reading' && result.readingText) {
      setActiveTab('text');
    } else {
      setActiveTab('activities');
    }
  }, [currentTaskIndex, result.readingText]);

  if (allTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-xl text-slate-500 mb-4">Nenhuma atividade para revisar nesta missão.</p>
        <button onClick={onComplete} className="bg-blue-500 text-white font-bold py-2 px-6 rounded-full">Voltar</button>
      </div>
    );
  }

  const currentTask = allTasks[currentTaskIndex];

  const handleSubmit = async () => {
    if (!answer.trim()) return;

    setFeedback("Resposta enviada para revisão!");

    // Update DB
    await updateStudentResult(result.id, (prev) => {
      const updated = { ...prev };
      if (currentTask.type === 'reading') {
        updated.readingAnswers[currentTask.originalIndex].answer = answer;
        updated.readingAnswers[currentTask.originalIndex].needsReview = false;
        updated.readingAnswers[currentTask.originalIndex].isCorrect = null; // Reset for tutor to evaluate again
      } else if (currentTask.type === 'challenge') {
        updated.mathChallengeAnswers[currentTask.originalIndex].answer = answer;
        updated.mathChallengeAnswers[currentTask.originalIndex].needsReview = false;
        updated.mathChallengeAnswers[currentTask.originalIndex].correct = false; // Reset
      } else if (currentTask.type === 'problem') {
        updated.mathProblemAnswers[currentTask.originalIndex].answer = answer;
        updated.mathProblemAnswers[currentTask.originalIndex].needsReview = false;
        updated.mathProblemAnswers[currentTask.originalIndex].correct = false; // Reset
      }
      updated.evaluated = false; // Mark as needs evaluation by tutor again
      return updated;
    });

    setTimeout(async () => {
      setFeedback(null);
      setAnswer('');
      if (currentTaskIndex < allTasks.length - 1) {
        setCurrentTaskIndex(currentTaskIndex + 1);
      } else {
        await incrementMissions();
        await awardBadge("Revisor Implacável");
        getGamification().then(setStats);
        setIsCompleted(true);
      }
    }, 1500);
  };

  if (isCompleted) {
    return (
      <motion.div 
        key="completed"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 sm:p-16 rounded-[2.5rem] shadow-sm border-2 border-emerald-100 text-center mx-auto max-w-4xl mt-10"
      >
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-yellow-100">
          <Award className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500" />
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-800 mb-6 tracking-tight">Revisão Concluída!</h2>
        <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-md mx-auto leading-relaxed">Você refez todas as atividades solicitadas pelo Tutor.</p>
        
        <button 
          onClick={onComplete}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-2xl shadow-md transition-colors"
        >
          Voltar ao Menu Principal
        </button>
      </motion.div>
    );
  }

  const hasReading = !!result.readingText;

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-slate-50 relative">
      {/* Top Header Navigation */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-4 py-3 flex flex-wrap gap-3 sm:gap-4 items-center justify-between shadow-sm z-10">
        <div className="w-full lg:w-auto flex justify-between items-center order-1 lg:order-2 lg:flex-1 lg:justify-center">
           <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-bold text-sm">
             Modo de Revisão ({currentTaskIndex + 1}/{allTasks.length})
           </div>
        </div>

        {/* Streaks Desktop */}
        <div className="hidden lg:flex items-center gap-1 bg-orange-100 text-orange-600 px-4 py-2 rounded-xl font-bold text-sm order-3">
          <Flame className="w-5 h-5" />
          {stats?.missionsCompleted || 0} Missões
        </div>

        {/* Mobile Tabs (only if reading text exists) */}
        {true && (
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
        )}
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Texto de Apoio */}
        {true && (
          <div className={`w-full lg:w-5/12 bg-white p-6 lg:p-8 overflow-y-auto border-r border-slate-200 relative ${activeTab === 'text' ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-0 bg-white pb-4 mb-4 border-b border-slate-100 flex justify-between items-center z-10 hidden lg:flex">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-500" />
                Texto de Apoio (Para Consulta)
              </h2>
            </div>
            <article className="prose prose-lg text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
              {result.readingText || "(Aguardando o Tutor inserir a história...)"}
            </article>
          </div>
        )}

        {/* Área de Questões (Right side) */}
        <div className={`w-full lg:w-7/12 p-4 lg:p-8 overflow-y-auto bg-[#F8FAFC] ${activeTab === 'activities' ? 'block' : 'hidden lg:block'}`}>
          <div className="max-w-2xl mx-auto pb-24">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentTaskIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100"
              >
                <div className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-xl text-sm font-bold mb-6">
                  {currentTask.type === 'reading' && 'Interpretação (Refazer)'}
                  {currentTask.type === 'challenge' && 'Tabuada (Refazer)'}
                  {currentTask.type === 'problem' && 'Problema (Refazer)'}
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold mb-6 text-slate-800 leading-snug">
                  {currentTask.type === 'reading' && currentTask.question}
                  {currentTask.type === 'challenge' && `Quanto é ${currentTask.question} ?`}
                  {currentTask.type === 'problem' && (currentTask as any).problem}
                </h3>
                
                {currentTask.type === 'reading' ? (
                  <textarea 
                    rows={4} 
                    className="w-full p-5 text-lg border-2 border-slate-200 rounded-2xl focus:border-blue-500 outline-none resize-none font-sans bg-slate-50 focus:bg-white transition-colors" 
                    placeholder="Escreva sua nova resposta aqui..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                ) : (
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <input 
                      type={currentTask.type === 'challenge' ? 'number' : 'text'}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSubmit();
                      }}
                      className="w-40 sm:w-48 p-4 sm:p-6 text-3xl font-mono font-bold border-4 border-slate-200 rounded-3xl outline-none text-center transition-colors bg-slate-50 focus:bg-white" 
                      placeholder="?"
                      autoFocus
                    />
                  </div>
                )}
                
                {feedback && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-5 rounded-2xl flex items-start gap-3 bg-green-50 text-green-700 border border-green-200"
                  >
                    <CheckCircle2 className="w-6 h-6 mt-0.5 shrink-0" />
                    <p className="font-semibold text-base leading-snug">{feedback}</p>
                  </motion.div>
                )}
                
                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={handleSubmit}
                    className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-md transition-colors text-center w-full sm:w-auto"
                  >
                    Enviar Correção
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
