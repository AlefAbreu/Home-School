with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

import re

reading_submit = """
  const handleReadingSubmit = () => {
    const currentActivity = session.atividades_leitura?.[readingIndex];
    const isMultipleChoice = currentActivity?.is_multipla_escolha;

    if (isMultipleChoice) {
      const isCorrect = String(readingAnswer).trim() === String(currentActivity?.resposta_correta).trim();
      setReadingFeedback(isCorrect ? "Correto! Brilhante dedução." : "Ops, essa não é a resposta correta!");

      const newAnswers = [...readingAnswers, {
        question: currentActivity?.enunciado_pergunta || '',
        answer: readingAnswer,
        isCorrect: isCorrect
      }];
      setReadingAnswers(newAnswers);

      setTimeout(() => {
        setReadingFeedback(null);
        setReadingAnswer('');
        
        if (readingIndex < (session.atividades_leitura?.length || 1) - 1) {
          setReadingIndex(prev => prev + 1);
        } else {
          if (session.atividades_matematica?.blocos_tabuada && session.atividades_matematica.blocos_tabuada.length > 0) {
            setPhase('math_priming');
          } else if (session.atividades_matematica?.bloco_operacoes_problemas && session.atividades_matematica.bloco_operacoes_problemas.length > 0) {
            setPhase('math_problem');
          } else {
            completeSession([], mathChallengeAnswers, newAnswers);
          }
        }
      }, 2000);
      return;
    }

    const isShort = readingAnswer.trim().length < 20;
    
    if (currentActivity?.obriga_justificacao_textual && isShort) {
      setReadingFeedback("Excelente início! Todavia, recorde-se da nossa regra: Não se esqueça de comprovar o porquê referenciando explicitamente a parte do texto onde extraiu a sua brilhante dedução!");
    } else {
      setReadingFeedback("Muito bem! Resposta submetida com sucesso.");
      
      const newAnswers = [...readingAnswers, {
        question: currentActivity?.enunciado_pergunta || '',
        answer: readingAnswer,
        isCorrect: null
      }];
      setReadingAnswers(newAnswers);
      setTimeout(() => {
        setReadingFeedback(null);
        setReadingAnswer('');
        
        if (readingIndex < (session.atividades_leitura?.length || 1) - 1) {
          setReadingIndex(prev => prev + 1);
        } else {
          if (session.atividades_matematica?.blocos_tabuada && session.atividades_matematica.blocos_tabuada.length > 0) {
            setPhase('math_priming');
          } else if (session.atividades_matematica?.bloco_operacoes_problemas && session.atividades_matematica.bloco_operacoes_problemas.length > 0) {
            setPhase('math_problem');
          } else {
            completeSession([], mathChallengeAnswers, newAnswers);
          }
        }
      }, 2000);
    }
  };
"""

content = re.sub(r'  const handleReadingSubmit = \(\) => \{[\s\S]*?    \} else \{\n      setReadingFeedback\("Muito bem! Resposta submetida com sucesso\."\);[\s\S]*?      \}, 2000\);\n    \}\n  \};', reading_submit.strip('\n'), content)


math_submit = """
  const handleMathProblemSubmit = async () => {
    const currentProblem = session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex];
    let isCorrect = false;

    if (currentProblem?.is_multipla_escolha) {
      isCorrect = String(mathAnswer).trim() === String(currentProblem.resposta_correta).trim();
    } else {
      const correct = currentProblem?.solucao_matematica_esperada || 0;
      isCorrect = (parseFloat(mathAnswer.replace(',', '.')) === correct);
    }
    
    if (isCorrect) {
      setMathFeedback("Problema resolvido com perfeição!");
      
      const probAnswers = [...mathProblemAnswers, {
        problem: currentProblem?.enunciado_textual_problema || '',
        expression: problemExpression,
        answer: mathAnswer,
        correct: true
      }];
      setMathProblemAnswers(probAnswers);
      setTimeout(() => {
        setMathFeedback(null);
        setMathAnswer('');
        setProblemExpression('');
        
        if (problemIndex < (session.atividades_matematica?.bloco_operacoes_problemas?.length || 1) - 1) {
          setProblemIndex(prev => prev + 1);
        } else {
          completeSession(probAnswers);
        }
      }, 2000);
    } else {
      setMathFeedback("Ops, tente novamente! Verifique a dica.");
      const probAnswers = [...mathProblemAnswers, {
        problem: currentProblem?.enunciado_textual_problema || '',
        expression: problemExpression,
        answer: mathAnswer,
        correct: false
      }];
      // For problems, we don't block the user, just tell them to retry? Wait, the original code doesn't move forward if incorrect.
      // We should just set feedback. We don't save the answer until it's correct?
      // Wait, let's keep the original behavior: it blocks until correct.
    }
  };
"""

content = re.sub(r'  const handleMathProblemSubmit = async \(\) => \{[\s\S]*?    \} else \{\n      setMathFeedback\("Ops, tente novamente! Verifique a dica\."\);\n    \}\n  \};', math_submit.strip('\n'), content)


with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)
