import React, { useState, useEffect } from 'react';
import { GeneratedStudySession } from '../types';
import { getStudentResults, StudentResult } from '../lib/db';
import { ChildDashboard } from './ChildDashboard';
import { ChildReviewDashboard } from './ChildReviewDashboard';
import { GraduationCap, AlertCircle, Play, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChildAreaProps {
  sessionData: GeneratedStudySession | null;
  baseText: string;
  isApproved: boolean;
  onGoBack: () => void;
}

export const ChildArea: React.FC<ChildAreaProps> = ({ sessionData, baseText, isApproved, onGoBack }) => {
  const [resultsToReview, setResultsToReview] = useState<StudentResult[]>([]);
  const [activeReviewResult, setActiveReviewResult] = useState<StudentResult | null>(null);
  const [startNewSession, setStartNewSession] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    const results = await getStudentResults();
    const toReview = results.filter(r => {
      const hasReadingReview = r.readingAnswers.some(a => a.needsReview);
      const hasChallengeReview = r.mathChallengeAnswers.some(a => a.needsReview);
      const hasProblemReview = r.mathProblemAnswers.some(a => a.needsReview);
      return hasReadingReview || hasChallengeReview || hasProblemReview;
    });
    setResultsToReview(toReview);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviewComplete = () => {
    setActiveReviewResult(null);
    fetchReviews();
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;

  if (activeReviewResult) {
    return <ChildReviewDashboard result={activeReviewResult} onComplete={handleReviewComplete} />;
  }

  if (startNewSession && sessionData && isApproved) {
    return <ChildDashboard session={sessionData} baseText={baseText} />;
  }

  const hasNewSession = sessionData && isApproved;
  const hasReviews = resultsToReview.length > 0;

  if (!hasNewSession && !hasReviews) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-xl text-slate-500 mb-4">Nenhuma aula ou revisão pendente no momento.</p>
        <button 
          onClick={onGoBack}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full"
        >
          Voltar ao Painel do Tutor
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl py-12">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Suas Missões</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hasNewSession && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border-2 border-blue-100 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
            onClick={() => setStartNewSession(true)}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Nova Missão</h3>
            <p className="text-slate-600 mb-6 flex-1">Uma nova aventura de aprendizado aguarda você!</p>
            <button className="bg-blue-500 text-white font-bold py-3 px-8 rounded-2xl w-full flex items-center justify-center gap-2">
              <Play className="w-5 h-5" /> Começar
            </button>
          </motion.div>
        )}

        {resultsToReview.map((result) => (
          <motion.div 
            key={result.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 p-8 rounded-3xl shadow-sm border-2 border-amber-200 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
            onClick={() => setActiveReviewResult(result)}
          >
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Revisão Necessária</h3>
            <p className="text-slate-600 mb-6 flex-1">
              Missão de {new Date(result.date).toLocaleDateString()} tem atividades para você refazer.
            </p>
            <button className="bg-amber-500 text-white font-bold py-3 px-8 rounded-2xl w-full flex items-center justify-center gap-2">
              <PenTool className="w-5 h-5" /> Refazer Agora
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
