import re

with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

reading_old = """      if (currentActivity?.multipla_escolha) {
        const correctId = String(currentActivity.multipla_escolha.id_resposta_correta).replace(/\\)/g, '').trim().toLowerCase();
        isCorrect = (givenAns === correctId);
      } else {"""

reading_new = """      if (currentActivity?.multipla_escolha) {
        const correctId = String(currentActivity.multipla_escolha.id_resposta_correta).replace(/\\)/g, '').trim().toLowerCase();
        isCorrect = (givenAns === correctId);
        if (!isCorrect) {
          const selectedOption = currentActivity.multipla_escolha.opcoes?.find((o: any) => String(o.id).replace(/\\)/g, '').trim().toLowerCase() === givenAns);
          if (selectedOption) {
             const selectedText = String(selectedOption.texto || selectedOption.valor || '').trim().toLowerCase();
             const rawCorrect = String(currentActivity.multipla_escolha.id_resposta_correta).trim().toLowerCase();
             isCorrect = (selectedText === correctId) || (selectedText === rawCorrect) || rawCorrect.includes(selectedText);
          }
        }
      } else {"""
content = content.replace(reading_old, reading_new)


math_old = """      if (currentProblem?.multipla_escolha) {
        const correctId = String(currentProblem.multipla_escolha.id_resposta_correta).replace(/\\)/g, '').trim().toLowerCase();
        isCorrect = (givenAns === correctId);
      } else {"""

math_new = """      if (currentProblem?.multipla_escolha) {
        const correctId = String(currentProblem.multipla_escolha.id_resposta_correta).replace(/\\)/g, '').trim().toLowerCase();
        isCorrect = (givenAns === correctId);
        if (!isCorrect) {
          const selectedOption = currentProblem.multipla_escolha.opcoes?.find((o: any) => String(o.id).replace(/\\)/g, '').trim().toLowerCase() === givenAns);
          if (selectedOption) {
             const selectedText = String(selectedOption.texto || selectedOption.valor || '').trim().toLowerCase();
             const rawCorrect = String(currentProblem.multipla_escolha.id_resposta_correta).trim().toLowerCase();
             isCorrect = (selectedText === correctId) || (selectedText === rawCorrect) || rawCorrect.includes(selectedText);
          }
        }
      } else {"""
content = content.replace(math_old, math_new)


with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)
