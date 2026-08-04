import re

with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

reading_newAnswers_1_old = """      const newAnswers = [...readingAnswers, {
        question: currentActivity?.enunciado_pergunta || '',
        answer: readingAnswer,
        isCorrect: isCorrect
      }];"""
      
reading_newAnswers_1_new = """      const newAnswers = [...readingAnswers, {
        question: currentActivity?.enunciado_pergunta || '',
        answer: readingAnswer,
        isCorrect: isCorrect,
        correctAnswer: currentActivity?.multipla_escolha?.id_resposta_correta || currentActivity?.resposta_correta || '',
        tutorOrientation: currentActivity?.orientacao_de_correcao_tutor
      }];"""

content = content.replace(reading_newAnswers_1_old, reading_newAnswers_1_new)

reading_newAnswers_2_old = """      const newAnswers = [...readingAnswers, {
        question: currentActivity?.enunciado_pergunta || '',
        answer: readingAnswer,
        isCorrect: null
      }];"""
      
reading_newAnswers_2_new = """      const newAnswers = [...readingAnswers, {
        question: currentActivity?.enunciado_pergunta || '',
        answer: readingAnswer,
        isCorrect: null,
        tutorOrientation: currentActivity?.orientacao_de_correcao_tutor
      }];"""
      
content = content.replace(reading_newAnswers_2_old, reading_newAnswers_2_new)

reading_newAnswers_3_old = """    const newAnswers = [...readingAnswers, {
      question: session.atividades_leitura?.[readingIndex]?.enunciado_pergunta || '',
      answer: readingAnswer,
      isCorrect: null,
      askedForHelp: true
    }];"""
    
reading_newAnswers_3_new = """    const currentActivity = session.atividades_leitura?.[readingIndex];
    const newAnswers = [...readingAnswers, {
      question: currentActivity?.enunciado_pergunta || '',
      answer: readingAnswer,
      isCorrect: null,
      askedForHelp: true,
      correctAnswer: currentActivity?.multipla_escolha?.id_resposta_correta || currentActivity?.resposta_correta || '',
      tutorOrientation: currentActivity?.orientacao_de_correcao_tutor
    }];"""
    
content = content.replace(reading_newAnswers_3_old, reading_newAnswers_3_new)

math_challenge_1_old = """      const newAnswers = [...mathChallengeAnswers, {
        question: currentTable.bateria_desafio_sequencial[challengeIndex].equacao_apresentada,
        answer: mathAnswer,
        correct: true,
        mistakes: currentMistakes
      }];"""
      
math_challenge_1_new = """      const newAnswers = [...mathChallengeAnswers, {
        question: currentTable.bateria_desafio_sequencial[challengeIndex].equacao_apresentada,
        answer: mathAnswer,
        correct: true,
        mistakes: currentMistakes,
        correctAnswer: correct
      }];"""
      
content = content.replace(math_challenge_1_old, math_challenge_1_new)

math_challenge_2_old = """    const newAnswers = [...mathChallengeAnswers, {
      question: currentTable.bateria_desafio_sequencial[challengeIndex].equacao_apresentada,
      answer: mathAnswer,
      correct: false,
      mistakes: currentMistakes,
      askedForHelp: true
    }];"""
    
math_challenge_2_new = """    const newAnswers = [...mathChallengeAnswers, {
      question: currentTable.bateria_desafio_sequencial[challengeIndex].equacao_apresentada,
      answer: mathAnswer,
      correct: false,
      mistakes: currentMistakes,
      askedForHelp: true,
      correctAnswer: currentTable.bateria_desafio_sequencial[challengeIndex].resultado_correto
    }];"""
    
content = content.replace(math_challenge_2_old, math_challenge_2_new)


math_timed_1_old = """      const newAnswers = [...mathChallengeAnswers, {
        question: currentTable.bateria_desafio_aleatorio[challengeIndex].equacao_apresentada,
        answer: mathAnswer,
        correct: true,
        mistakes: currentMistakes
      }];"""

math_timed_1_new = """      const newAnswers = [...mathChallengeAnswers, {
        question: currentTable.bateria_desafio_aleatorio[challengeIndex].equacao_apresentada,
        answer: mathAnswer,
        correct: true,
        mistakes: currentMistakes,
        correctAnswer: correct
      }];"""
      
content = content.replace(math_timed_1_old, math_timed_1_new)

math_timed_2_old = """    const newAnswers = [...mathChallengeAnswers, {
      question: currentTable.bateria_desafio_aleatorio[challengeIndex].equacao_apresentada,
      answer: mathAnswer,
      correct: false,
      mistakes: currentMistakes,
      askedForHelp: true
    }];"""
    
math_timed_2_new = """    const newAnswers = [...mathChallengeAnswers, {
      question: currentTable.bateria_desafio_aleatorio[challengeIndex].equacao_apresentada,
      answer: mathAnswer,
      correct: false,
      mistakes: currentMistakes,
      askedForHelp: true,
      correctAnswer: currentTable.bateria_desafio_aleatorio[challengeIndex].resultado_correto
    }];"""
    
content = content.replace(math_timed_2_old, math_timed_2_new)


math_prob_1_old = """      const probAnswers = [...mathProblemAnswers, {
        problem: currentProblem?.enunciado_textual_problema || '',
        expression: problemExpression,
        answer: mathAnswer,
        correct: true
      }];"""
      
math_prob_1_new = """      const probAnswers = [...mathProblemAnswers, {
        problem: currentProblem?.enunciado_textual_problema || '',
        expression: problemExpression,
        answer: mathAnswer,
        correct: true,
        correctAnswer: currentProblem?.multipla_escolha?.id_resposta_correta || currentProblem?.resposta_correta || currentProblem?.solucao_matematica_esperada,
        steps: currentProblem?.passos_para_montagem_guiada
      }];"""
      
content = content.replace(math_prob_1_old, math_prob_1_new)

math_prob_2_old = """      const probAnswers = [...mathProblemAnswers, {
        problem: currentProblem?.enunciado_textual_problema || '',
        expression: problemExpression,
        answer: mathAnswer,
        correct: false
      }];"""
      
math_prob_2_new = """      const probAnswers = [...mathProblemAnswers, {
        problem: currentProblem?.enunciado_textual_problema || '',
        expression: problemExpression,
        answer: mathAnswer,
        correct: false,
        correctAnswer: currentProblem?.multipla_escolha?.id_resposta_correta || currentProblem?.resposta_correta || currentProblem?.solucao_matematica_esperada,
        steps: currentProblem?.passos_para_montagem_guiada
      }];"""
      
content = content.replace(math_prob_2_old, math_prob_2_new)


math_prob_3_old = """    const probAnswers = [...mathProblemAnswers, {
      problem: currentProblem?.enunciado_textual_problema || '',
      expression: problemExpression,
      answer: mathAnswer,
      correct: false,
      askedForHelp: true
    }];"""
    
math_prob_3_new = """    const probAnswers = [...mathProblemAnswers, {
      problem: currentProblem?.enunciado_textual_problema || '',
      expression: problemExpression,
      answer: mathAnswer,
      correct: false,
      askedForHelp: true,
      correctAnswer: currentProblem?.multipla_escolha?.id_resposta_correta || currentProblem?.resposta_correta || currentProblem?.solucao_matematica_esperada,
      steps: currentProblem?.passos_para_montagem_guiada
    }];"""
    
content = content.replace(math_prob_3_old, math_prob_3_new)

with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)
