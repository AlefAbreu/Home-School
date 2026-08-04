import re

with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

# Update handleReadingSubmit
read_submit_old = """    const isMultipleChoice = currentActivity?.is_multipla_escolha || currentActivity?.tipo_competencia === 'multipla_escolha' || (currentActivity?.opcoes && currentActivity.opcoes.length > 0);
    
    if (isMultipleChoice) {
      const isCorrect = String(readingAnswer).trim() === String(currentActivity?.resposta_correta).trim();
      setReadingFeedback(isCorrect ? "Correto! Brilhante dedução." : "Ops, essa não é a resposta correta!");"""

read_submit_new = """    const isMultipleChoice = currentActivity?.tipo_resposta === 'multipla_escolha' || currentActivity?.is_multipla_escolha || currentActivity?.tipo_competencia === 'multipla_escolha' || (currentActivity?.opcoes && currentActivity.opcoes.length > 0);
    
    if (isMultipleChoice) {
      const isCorrect = currentActivity?.multipla_escolha 
        ? String(readingAnswer).trim().toLowerCase() === String(currentActivity.multipla_escolha.id_resposta_correta).trim().toLowerCase()
        : String(readingAnswer).trim() === String(currentActivity?.resposta_correta).trim();
        
      const feedback = currentActivity?.multipla_escolha?.opcoes?.find((o: any) => o.id.toLowerCase() === readingAnswer.toLowerCase())?.feedback_pedagogico;
      setReadingFeedback(isCorrect ? (feedback || "Correto! Brilhante dedução.") : (feedback || "Ops, essa não é a resposta correta!"));"""
content = content.replace(read_submit_old, read_submit_new)


# Update handleMathProblemSubmit
math_submit_old = """    let isCorrect = false;

    if (currentProblem?.is_multipla_escolha || (currentProblem?.opcoes && currentProblem.opcoes.length > 0)) {
      isCorrect = String(mathAnswer).trim() === String(currentProblem.resposta_correta).trim();
    } else {"""

math_submit_new = """    let isCorrect = false;

    if (currentProblem?.tipo_resposta === 'multipla_escolha' || currentProblem?.is_multipla_escolha || (currentProblem?.opcoes && currentProblem.opcoes.length > 0)) {
      isCorrect = currentProblem?.multipla_escolha
        ? String(mathAnswer).trim().toLowerCase() === String(currentProblem.multipla_escolha.id_resposta_correta).trim().toLowerCase()
        : String(mathAnswer).trim() === String(currentProblem.resposta_correta).trim();
    } else {"""
content = content.replace(math_submit_old, math_submit_new)

with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)
