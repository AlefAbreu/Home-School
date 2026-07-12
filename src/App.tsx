/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TutorDashboard } from './components/TutorDashboard';
import { ChildDashboard } from './components/ChildDashboard';
import { TutorReview } from './components/TutorReview';
import { GeneratedStudySession } from './types';
import { GraduationCap, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function App() {
  const [activeTab, setActiveTab] = useState<'tutor' | 'child'>('tutor');
  const [sessionData, setSessionData] = useState<GeneratedStudySession | null>(null);
  const [baseText, setBaseText] = useState('');
  const [isApproved, setIsApproved] = useState(false);

  const handleGenerate = (data: GeneratedStudySession, text: string) => {
    setSessionData(data);
    setBaseText(text);
    setIsApproved(false);
    // Optional: Auto switch to child tab after generating
    // setActiveTab('child'); 
  };

  const handleApprove = () => {
    setIsApproved(true);
    setActiveTab('child');
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Navbar de Controle */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center z-50 relative">
        <div className="font-bold text-xl text-blue-600 flex items-center gap-2">
          <GraduationCap className="w-8 h-8" />
          Tutor AI
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('tutor')} 
            className={`px-6 py-2 rounded-full font-bold transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'tutor' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Painel do Tutor
          </button>
          <button 
            onClick={() => setActiveTab('child')} 
            disabled={(!sessionData || !isApproved) && activeTab === 'tutor'}
            className={`px-6 py-2 rounded-full font-bold transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'child' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            Entrar na Aula
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative">
        {activeTab === 'tutor' ? (
          <motion.div
            key="tutor"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <TutorDashboard onGenerate={handleGenerate} />
            {sessionData && !isApproved && (
              <TutorReview session={sessionData} onApprove={handleApprove} />
            )}
            {sessionData && isApproved && (
              <div className="container mx-auto px-6 max-w-5xl mb-12">
                <div className="bg-green-50 p-8 rounded-2xl border border-green-100 text-center">
                  <h2 className="text-2xl font-bold text-green-700 mb-2">
                    Aula Publicada!
                  </h2>
                  <p className="text-green-800">
                    A sessão de estudo foi aprovada e está pronta para a criança.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="child"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {sessionData && isApproved ? (
              <ChildDashboard session={sessionData} baseText={baseText} />
            ) : (
              <div className="flex flex-col items-center justify-center h-[60vh]">
                <p className="text-xl text-slate-500 mb-4">
                  {sessionData ? "As atividades precisam ser revisadas e aprovadas pelo Tutor." : "Nenhuma aula configurada."}
                </p>
                <button 
                  onClick={() => setActiveTab('tutor')}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full"
                >
                  Voltar ao Painel do Tutor
                </button>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
