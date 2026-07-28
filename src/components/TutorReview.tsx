import React from 'react';
import { GeneratedStudySession } from '../types';
import { BookOpen, Calculator, CheckCircle2 } from 'lucide-react';

interface TutorReviewProps {
  session: GeneratedStudySession;
  onApprove: () => void;
}

export const TutorReview: React.FC<TutorReviewProps> = ({ session, onApprove }) => {
  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-4xl mb-12">
      <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-8 flex items-center gap-3">
          <div className="p-2 bg-green-100 text-green-600 rounded-xl">
            <CheckCircle2 className="w-6 sm:w-8 h-6 sm:h-8" />
          </div>
          Revisão de Atividades
        </h2>
        <p className="text-slate-600 mb-10 text-lg">
          Confira o gabarito e as orientações das atividades geradas antes de liberar a aula para a criança.
        </p>

        {/* Leitura */}
        <div className="mb-10">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-700 flex items-center gap-3 mb-6 border-b pb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            Interpretação de Texto
          </h3>
          <div className="space-y-4">
            {session.atividades_leitura?.map((q, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="font-bold text-slate-800 mb-3 text-lg">Q{idx + 1}: {q.enunciado_pergunta}</p>
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                  <p className="text-sm font-semibold text-blue-800 mb-2 uppercase tracking-wide">Gabarito / Orientação para o Tutor</p>
                  <p className="text-base text-blue-900 leading-relaxed">{q.orientacao_de_correcao_tutor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Matemática */}
        <div className="mb-10">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-700 flex items-center gap-3 mb-6 border-b pb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Calculator className="w-5 h-5" />
            </div>
            Matemática
          </h3>
          
          {/* Tabuada - Teste Cego */}
          {session.atividades_matematica?.blocos_tabuada && session.atividades_matematica.blocos_tabuada.length > 0 && (
            <div className="mb-8">
              <h4 className="font-bold text-slate-700 mb-4 text-lg">Desafio Rápido (Tabuada)</h4>
              <div className="space-y-6">
                {session.atividades_matematica.blocos_tabuada.map((bloco, bIdx) => (
                  <div key={bIdx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <h5 className="font-bold text-emerald-700 mb-4 text-xl bg-emerald-100/50 inline-block px-4 py-1 rounded-lg">Tabuada do {bloco.multiplo_selecionado}</h5>
                    
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">Sequencial</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {bloco.bateria_desafio_sequencial.map((d, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                            <span className="font-mono text-base">{d.equacao_apresentada} = <span className="font-bold text-emerald-600">{d.resultado_correto}</span></span>
                            <span className="text-[11px] text-slate-400 max-w-[140px] truncate bg-slate-50 px-2 py-1 rounded-md" title={d.dica_calculo_mental}>Dica: {d.dica_calculo_mental}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">Aleatório</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {bloco.bateria_desafio_aleatorio.map((d, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                            <span className="font-mono text-base">{d.equacao_apresentada} = <span className="font-bold text-emerald-600">{d.resultado_correto}</span></span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Problemas Matemáticos */}
          {session.atividades_matematica?.bloco_operacoes_problemas && session.atividades_matematica.bloco_operacoes_problemas.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-700 mb-4 text-lg">Problemas Complexos</h4>
              <div className="space-y-4">
                {session.atividades_matematica.bloco_operacoes_problemas.map((p, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <p className="text-base text-slate-600 mb-4 italic font-medium bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">"{p.capsula_teorica_introdutoria}"</p>
                    <p className="font-bold text-slate-800 mb-5 text-lg">{p.enunciado_textual_problema}</p>
                    <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-semibold text-emerald-800 mb-2 uppercase tracking-wide">Passos (Expressão)</p>
                        <p className="text-base text-emerald-900 font-mono bg-white p-3 rounded-xl shadow-sm inline-block">{p.passos_para_montagem_guiada}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-emerald-800 mb-2 uppercase tracking-wide">Solução Esperada</p>
                        <p className="text-2xl text-emerald-900 font-bold bg-white px-4 py-2 rounded-xl shadow-sm inline-block">{p.solucao_matematica_esperada}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-slate-100 mt-8">
          <button 
            onClick={onApprove}
            className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-lg font-bold py-5 rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-3 transform hover:scale-[1.01]"
          >
            <CheckCircle2 className="w-6 h-6" />
            Aprovar e Publicar para a Criança
          </button>
        </div>
      </div>
    </div>
  );
};
