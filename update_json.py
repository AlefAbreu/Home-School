import json

data = {
  "texto_de_apoio": "Era uma vez, numa floresta distante, um pequeno esquilo chamado João. Ele adorava explorar as árvores e procurar nozes escondidas. Um dia, ele encontrou uma noz gigante e brilhante, mas estava muito pesada para carregar sozinho. João precisou pedir ajuda aos seus amigos da floresta para levá-la até sua toca.",
  "metadados_pedagogicos": {
    "tema_central_do_texto": "Amizade e Natureza",
    "nivel_estimado_complexidade": 3,
    "tempo_estimado_minutos": 15
  },
  "atividades_leitura": [
    {
      "id_questao": 1,
      "tipo_competencia": "interpretacao_direta",
      "tipo_resposta": "aberta",
      "enunciado_pergunta": "Qual é o nome do personagem principal?",
      "obriga_justificacao_textual": False,
      "xp_recompensa": 10,
      "orientacao_de_correcao_tutor": "O aluno deve mencionar o nome 'João'."
    },
    {
      "id_questao": 2,
      "tipo_competencia": "multipla_escolha",
      "tipo_resposta": "multipla_escolha",
      "enunciado_pergunta": "O que o esquilo João encontrou na floresta?",
      "obriga_justificacao_textual": False,
      "xp_recompensa": 15,
      "multipla_escolha": {
        "id_resposta_correta": "C",
        "opcoes": [
          {
            "id": "A",
            "texto": "Uma maçã gigante",
            "feedback_pedagogico": "Pense no que os esquilos costumam procurar nas árvores."
          },
          {
            "id": "B",
            "texto": "Um mapa do tesouro",
            "feedback_pedagogico": "João adora explorar, mas ele encontrou algo de comer."
          },
          {
            "id": "C",
            "texto": "Uma noz gigante e brilhante",
            "feedback_pedagogico": "Isso mesmo! Ele encontrou uma noz gigante."
          },
          {
            "id": "D",
            "texto": "Um novo amigo",
            "feedback_pedagogico": "Ele precisou de ajuda dos amigos depois."
          }
        ]
      }
    },
    {
      "id_questao": 3,
      "tipo_competencia": "inferencia_tematica",
      "tipo_resposta": "aberta",
      "enunciado_pergunta": "Por que o personagem estava triste no início da história? Justifique detalhadamente a sua resposta retirando um trecho do texto lido",
      "obriga_justificacao_textual": True,
      "xp_recompensa": 20,
      "orientacao_de_correcao_tutor": "O aluno deve inferir que ele perdeu seu brinquedo e citar a parte do texto correspondente."
    }
  ],
  "atividades_matematica": {
    "blocos_tabuada": [
      {
        "multiplo_selecionado": 2,
        "apresentacao_crescente_completa": [
          { "fator_a": 2, "fator_b": 1, "produto": 2 },
          { "fator_a": 2, "fator_b": 2, "produto": 4 }
        ],
        "bateria_desafio_sequencial": [
          { "equacao_apresentada": "2 x 1", "resultado_correto": 2, "dica_calculo_mental": "Qualquer número multiplicado por 1 é ele mesmo!" },
          { "equacao_apresentada": "2 x 2", "resultado_correto": 4, "dica_calculo_mental": "O dobro de 2!" }
        ],
        "bateria_desafio_aleatorio": [
          { "equacao_apresentada": "2 x 2", "resultado_correto": 4, "dica_calculo_mental": "O dobro de 2!" },
          { "equacao_apresentada": "2 x 1", "resultado_correto": 2, "dica_calculo_mental": "Qualquer número multiplicado por 1 é ele mesmo!" }
        ]
      }
    ],
    "bloco_operacoes_problemas": [
      {
        "id_problema": 1,
        "tema_associado": "moedas_centavos",
        "tipo_resposta": "montagem_expressao",
        "capsula_teorica_introdutoria": "Lembre-se que R$ 1,00 equivale a 100 centavos.",
        "enunciado_textual_problema": "Se João tinha R$ 5,00 e comprou um lanche por R$ 3,50, quanto sobrou de troco?",
        "xp_recompensa": 25,
        "passos_para_montagem_guiada": "Subtraia 3,50 de 5,00",
        "solucao_matematica_esperada": 1.50
      },
      {
        "id_problema": 2,
        "tema_associado": "adicao",
        "tipo_resposta": "multipla_escolha",
        "capsula_teorica_introdutoria": "As nozes podem ser contadas usando a adição.",
        "enunciado_textual_problema": "João tinha 3 nozes e seu amigo lhe deu mais 4. Quantas nozes João tem agora?",
        "xp_recompensa": 15,
        "passos_para_montagem_guiada": "Some 3 + 4",
        "solucao_matematica_esperada": 7,
        "multipla_escolha": {
          "id_resposta_correta": "C",
          "opcoes": [
            {
              "id": "A",
              "valor": 5,
              "feedback_pedagogico": "Atenção na soma!"
            },
            {
              "id": "B",
              "valor": 6,
              "feedback_pedagogico": "Chegou perto."
            },
            {
              "id": "C",
              "valor": 7,
              "feedback_pedagogico": "Exato! 3 + 4 = 7."
            },
            {
              "id": "D",
              "valor": 8,
              "feedback_pedagogico": "Passou."
            }
          ]
        }
      }
    ]
  }
}

with open('public/modelo_atividades.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
