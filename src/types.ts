export interface PedagogyMetadata {
  tema_central_do_texto: string;
  nivel_estimado_complexidade: number;
}

export interface ReadingQuestion {
  id_questao: number;
  tipo_competencia: 'interpretacao_direta' | 'inferencia_tematica';
  enunciado_pergunta: string;
  obriga_justificacao_textual: boolean;
  orientacao_de_correcao_tutor: string;
}

export interface MultiplicationFact {
  fator_a: number;
  fator_b: number;
  produto: number;
}

export interface BlindChallenge {
  equacao_apresentada: string;
  resultado_correto: number;
  dica_calculo_mental: string;
}

export interface MultiplicationBlock {
  multiplo_selecionado: number;
  apresentacao_crescente_completa: MultiplicationFact[];
  bateria_desafio_sequencial: BlindChallenge[];
  bateria_desafio_aleatorio: BlindChallenge[];
}

export interface ProblemBlock {
  id_problema: number;
  tema_associado: 'adicao' | 'subtracao' | 'multiplicacao' | 'divisao' | 'moedas_centavos' | 'fracoes_basicas';
  capsula_teorica_introdutoria: string;
  enunciado_textual_problema: string;
  necessita_montagem_expressao: boolean;
  passos_para_montagem_guiada: string;
  solucao_matematica_esperada: number;
}

export interface MathActivities {
  blocos_tabuada: MultiplicationBlock[];
  bloco_operacoes_problemas: ProblemBlock[];
}

export interface GeneratedStudySession {
  metadados_pedagogicos: PedagogyMetadata;
  atividades_leitura: ReadingQuestion[];
  atividades_matematica: MathActivities;
}
