/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TutorDashboard } from './components/TutorDashboard';
import { ChildArea } from './components/ChildArea';


import { TutorReview } from './components/TutorReview';
import { GeneratedStudySession } from './types';
import { GraduationCap, LayoutDashboard, LogOut } from 'lucide-react';
import { saveActiveSession, subscribeToActiveSession } from './lib/db';
import { saveActivityToDrive } from './lib/drive';
import { motion } from 'framer-motion';
import { auth, signInWithGoogle, logout } from './lib/firebase';


import { User, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState<'tutor' | 'child'>('tutor');
  const [sessionData, setSessionData] = useState<GeneratedStudySession | null>(null);
  const [baseText, setBaseText] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    import("firebase/auth").then(({ getRedirectResult }) => {
      getRedirectResult(auth).then((result) => {
        if (result) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential?.accessToken) {
            localStorage.setItem('drive_token', credential.accessToken);
          }
        }
      }).catch((error) => {
        console.error("Redirect login error:", error);
        setLoginError(error.message || "Erro no login por redirecionamento.");
      });
    });
  }, []);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoginError(null);
    try {
      await signInWithGoogle();
      } catch (err: any) {
      console.error(err);
      setLoginError(err.message || "Erro ao fazer login. Tente abrir o app em uma nova aba.");
    }
  };

  useEffect(() => {
    let unsubscribeSession: () => void;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        unsubscribeSession = subscribeToActiveSession(currentUser.uid, (data) => {
          if (data) {
            setSessionData(data.sessionData);
            setBaseText(data.baseText);
            setIsApproved(data.isApproved);
          }
        });
      }
    });
    return () => {
      unsubscribe();
      if (unsubscribeSession) unsubscribeSession();
    };
  }, []);

  const handleGenerate = (data: GeneratedStudySession, text: string) => {
    setSessionData(data);
    setBaseText(text);
    setIsApproved(false);
    saveActiveSession(data, text, false).catch(console.error);
  };

  const handleApprove = async () => {
    setIsApproved(true);
    if (sessionData) {
      try {
        await saveActiveSession(sessionData, baseText, true);
        const fileName = `Atividade_${new Date().toISOString().split('T')[0]}.json`;
        await saveActivityToDrive({ sessionData, baseText }, fileName);
        alert('Atividade salva com sucesso no Google Drive na pasta "Painel Tutor"!');
      } catch (error) {
        console.error("Failed to save to Drive:", error);
        alert('Erro ao salvar no Google Drive: ' + (error instanceof Error ? error.message : 'Verifique se você concedeu as permissões necessárias.'));
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-xl font-bold text-slate-500 animate-pulse">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <GraduationCap className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Tutor AI</h1>
          <p className="text-slate-500 mb-8">Faça login com sua conta Google para acessar as planilhas e gerar as aulas.</p>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6 bg-white rounded-full p-1" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Entrar com Google
          </button>

          {window !== window.parent && (
            <a href={window.location.href} target="_blank" rel="noopener noreferrer" className="block mt-4 text-sm text-blue-500 hover:underline font-semibold">
              Abrir em Nova Aba (Recomendado para Login)
            </a>
          )}
          
          {loginError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl text-left">
              <p className="font-bold mb-1">Erro de Autenticação</p>
              <p className="mb-2">{loginError}</p>
              <p className="text-xs opacity-90">
                Dica 1: Se o erro for "unauthorized-domain", adicione o domínio <strong>{window.location.host}</strong> na lista de "Domínios Autorizados" no console do Firebase (Authentication &gt; Settings).
              </p>
              <p className="text-xs opacity-90 mt-1">
                Dica 2: Se a janela de login fechar imediatamente, bloqueios de iFrame podem estar ativos. Experimente abrir este aplicativo em uma <strong>nova aba do navegador</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-50">
      {/* Navbar de Controle */}
      <nav className="bg-white shadow-sm p-4 flex flex-col md:flex-row justify-between items-center z-50 relative gap-4 md:gap-0">
        <div className="font-bold text-xl text-blue-600 flex items-center gap-2">
          <GraduationCap className="w-8 h-8" />
          Tutor AI
        </div>
        <div className="flex flex-wrap justify-center items-center gap-4">

          <button 
            onClick={() => setActiveTab('tutor')} 
            className={`px-4 sm:px-6 py-2 rounded-full font-bold transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'tutor' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="hidden sm:inline">Painel do Tutor</span>
          </button>
          <button 
            onClick={() => setActiveTab('child')} 
            className={`px-4 sm:px-6 py-2 rounded-full font-bold transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'child' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span className="hidden sm:inline">Entrar na Aula</span>
                    </button>
          <div className="text-sm font-medium text-slate-500 hidden md:block bg-slate-100 px-3 py-1.5 rounded-full">
            {user?.email}
          </div>
          {user?.email && (
            <div className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg shadow-sm shrink-0" title={user.email}>
              {user.email.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={logout}
            className="px-4 py-2 rounded-full font-bold transition-all duration-300 flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
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
            <ChildArea 
              sessionData={sessionData} 
              baseText={baseText} 
              isApproved={isApproved} 
              onGoBack={() => setActiveTab('tutor')} 
            />
          </motion.div>
        )}
      </main>
    </div>
  );
}
