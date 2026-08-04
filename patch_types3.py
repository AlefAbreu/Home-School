with open('src/types.ts', 'r') as f:
    content = f.read()

import re

new_reading_question = """
export interface MultiplaEscolhaOpcao {
  id: string;
  texto?: string;
  valor?: string | number;
  feedback_pedagogico?: string;
}

export interface MultiplaEscolha {
  id_resposta_correta: string;
  opcoes: MultiplaEscolhaOpcao[];
}

export interface ReadingQuestion {
  id_questao: number;
  tipo_competencia: 'interpretacao_direta' | 'inferencia_tematica' | 'metalinguagem' | string;
  tipo_resposta?: 'multipla_escolha' | 'aberta';
  enunciado_pergunta: string;
  obriga_justificacao_textual: boolean;
  xp_recompensa?: number;
  multipla_escolha?: MultiplaEscolha;
  orientacao_de_correcao_tutor: string;
  
  // Legacy fields for backward compatibility
  is_multipla_escolha?: boolean;
  opcoes?: string[];
  resposta_correta?: string | number;
}
"""

content = re.sub(r'export interface ReadingQuestion \{[\s\S]*?\}', new_reading_question.strip('\n'), content)


new_problem_block = """
export interface ProblemBlock {
  id_problema: number;
  tema_associado: 'adicao' | 'subtracao' | 'multiplicacao' | 'divisao' | 'operacoes_mistas' | 'moedas_centavos' | 'fracoes_basicas' | string;
  tipo_resposta?: 'multipla_escolha' | 'calculo_direto' | 'montagem_expressao';
  capsula_teorica_introdutoria: string;
  enunciado_textual_problema: string;
  xp_recompensa?: number;
  passos_para_montagem_guiada: string;
  solucao_matematica_esperada: number | string;
  multipla_escolha?: MultiplaEscolha;
  
  // Legacy fields
  necessita_montagem_expressao?: boolean;
  is_multipla_escolha?: boolean;
  opcoes?: string[];
  resposta_correta?: string | number;
}
"""

content = re.sub(r'export interface ProblemBlock \{[\s\S]*?\}', new_problem_block.strip('\n'), content)


with open('src/types.ts', 'w') as f:
    f.write(content)
