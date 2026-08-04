with open('src/types.ts', 'r') as f:
    content = f.read()

content = content.replace(
"""export interface ReadingQuestion {
  id_questao: number;
  tipo_competencia: 'interpretacao_direta' | 'inferencia_tematica' | 'multipla_escolha' | string;
  enunciado_pergunta: string;
  obriga_justificacao_textual: boolean;
  orientacao_de_correcao_tutor: string;
  opcoes?: string[];
  resposta_correta?: string | number;
}""",
"""export interface ReadingQuestion {
  id_questao: number;
  tipo_competencia: 'interpretacao_direta' | 'inferencia_tematica' | 'multipla_escolha' | string;
  enunciado_pergunta: string;
  obriga_justificacao_textual: boolean;
  orientacao_de_correcao_tutor: string;
  is_multipla_escolha?: boolean;
  opcoes?: string[];
  resposta_correta?: string | number;
}"""
)

content = content.replace(
"""export interface ProblemBlock {
  id_problema: number;
  tema_associado: 'adicao' | 'subtracao' | 'multiplicacao' | 'divisao' | 'moedas_centavos' | 'fracoes_basicas' | string;
  capsula_teorica_introdutoria: string;
  enunciado_textual_problema: string;
  necessita_montagem_expressao: boolean;
  passos_para_montagem_guiada: string;
  solucao_matematica_esperada: number | string;
  opcoes?: string[];
  resposta_correta?: string | number;
}""",
"""export interface ProblemBlock {
  id_problema: number;
  tema_associado: 'adicao' | 'subtracao' | 'multiplicacao' | 'divisao' | 'moedas_centavos' | 'fracoes_basicas' | string;
  capsula_teorica_introdutoria: string;
  enunciado_textual_problema: string;
  necessita_montagem_expressao: boolean;
  passos_para_montagem_guiada: string;
  solucao_matematica_esperada: number | string;
  is_multipla_escolha?: boolean;
  opcoes?: string[];
  resposta_correta?: string | number;
}"""
)

with open('src/types.ts', 'w') as f:
    f.write(content)
