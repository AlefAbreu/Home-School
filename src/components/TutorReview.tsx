import React from 'react';
import { GeneratedStudySession } from '../types';
import { BookOpen, Calculator, CheckCircle2 } from 'lucide-react';

interface TutorReviewProps {
  session: GeneratedStudySession;
  onApprove: () => void;
}

export const TutorReview: React.FC<TutorReviewProps> = ({ session, onApprove }) => {
  return (
    <div className="container mx-auto px-6 max-w-5xl mb-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
          Revisão de Atividades
        </h2>
        <p className="text-slate-600 mb-8">
          Confira o gabarito e as orientações das atividades geradas antes de liberar a aula para a criança.
        </p>

        {/* Leitura */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2 mb-4 border-b pb-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Interpretação de Texto
          </h3>
          <div className="space-y-4">
            {session.atividades_leitura?.map((q, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-800 mb-2">Q{idx + 1}: {q.enunciado_pergunta}</p>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <p className="text-sm font-semibold text-blue-800 mb-1">Gabarito / Orientação para o Tutor:</p>
                  <p className="text-sm text-blue-900">{q.orientacao_de_correcao_tutor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Matemática */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2 mb-4 border-b pb-2">
            <Calculator className="w-5 h-5 text-emerald-500" />
            Matemática
          </h3>
          
          {/* Tabuada - Teste Cego */}
          {session.atividades_matematica?.blocos_tabuada && session.atividades_matematica.blocos_tabuada.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-slate-700 mb-3">Desafio Rápido (Tabuada)</h4>
              <div className="space-y-6">
                {session.atividades_matematica.blocos_tabuada.map((bloco, bIdx) => (
                  <div key={bIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h5 className="font-bold text-emerald-700 mb-2">Tabuada do {bloco.multiplo_selecionado}</h5>
                    
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-slate-600 mb-1">Sequencial:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {bloco.bateria_desafio_sequencial.map((d, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-slate-200">
                            <span className="font-mono text-sm">{d.equacao_apresentada} = <span className="font-bold text-emerald-600">{d.resultado_correto}</span></span>
                            <span className="text-[10px] text-slate-400 max-w-[120px] truncate" title={d.dica_calculo_mental}>Dica: {d.dica_calculo_mental}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-600 mb-1">Aleatório:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {bloco.bateria_desafio_aleatorio.map((d, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-slate-200">
                            <span className="font-mono text-sm">{d.equacao_apresentada} = <span className="font-bold text-emerald-600">{d.resultado_correto}</span></span>
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
              <h4 className="font-bold text-slate-700 mb-3">Problemas Complexos</h4>
              <div className="space-y-4">
                {session.atividades_matematica.bloco_operacoes_problemas.map((p, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-sm text-slate-600 mb-2 italic">"{p.capsula_teorica_introdutoria}"</p>
                    <p className="font-bold text-slate-800 mb-3">{p.enunciado_textual_problema}</p>
                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-emerald-800 mb-1">Passos (Expressão):</p>
                        <p className="text-sm text-emerald-900 font-mono">{p.passos_para_montagem_guiada}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-emerald-800 mb-1">Solução Esperada:</p>
                        <p className="text-sm text-emerald-900 font-bold">{p.solucao_matematica_esperada}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={onApprove}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold py-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-6 h-6" />
          Aprovar e Publicar para a Criança
        </button>
      </div>
    </div>
  );
};
