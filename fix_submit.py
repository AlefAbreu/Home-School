import re

with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

reading_old = """    if (isMultipleChoice) {
      const isCorrect = currentActivity?.multipla_escolha 
        ? String(readingAnswer).trim().toLowerCase() === String(currentActivity.multipla_escolha.id_resposta_correta).trim().toLowerCase()
        : String(readingAnswer).trim() === String(currentActivity?.resposta_correta).trim();
      const feedback = currentActivity?.multipla_escolha?.opcoes?.find((o: any) => o.id.toLowerCase() === readingAnswer.toLowerCase())?.feedback_pedagogico;
      setReadingFeedback(isCorrect ? (feedback || "Correto! Brilhante dedução.") : (feedback || "Ops, essa não é a resposta correta!"));"""

reading_new = """    if (isMultipleChoice) {
      let isCorrect = false;
      const givenAns = String(readingAnswer).replace(/\)/g, '').trim().toLowerCase();
      
      if (currentActivity?.multipla_escolha) {
        const correctId = String(currentActivity.multipla_escolha.id_resposta_correta).replace(/\)/g, '').trim().toLowerCase();
        isCorrect = (givenAns === correctId);
      } else {
        const respCorreta = String(currentActivity?.resposta_correta || '').trim().toLowerCase();
        const optionsArray = extractOptions(currentActivity?.enunciado_pergunta || '', currentActivity?.opcoes).options?.map((opt: any, i: number) => ({ id: String.fromCharCode(65 + i).toLowerCase(), texto: opt })) || [];
        const selectedOption = optionsArray.find((o: any) => o.id === givenAns);
        const selectedText = selectedOption ? String(selectedOption.texto).trim().toLowerCase() : '';
        
        isCorrect = (givenAns === respCorreta.replace(/\)/g, '')) || 
                    (selectedText !== '' && selectedText === respCorreta) ||
                    (selectedText !== '' && respCorreta.includes(selectedText)) ||
                    (respCorreta.startsWith(givenAns + ")"));
      }

      const feedback = currentActivity?.multipla_escolha?.opcoes?.find((o: any) => String(o.id).replace(/\)/g, '').trim().toLowerCase() === givenAns)?.feedback_pedagogico;
      setReadingFeedback(isCorrect ? (feedback || "Correto! Brilhante dedução.") : (feedback || "Ops, essa não é a resposta correta!"));"""

content = content.replace(reading_old, reading_new)


math_old = """    if (currentProblem?.tipo_resposta === 'multipla_escolha' || !!currentProblem?.multipla_escolha || currentProblem?.is_multipla_escolha || (currentProblem?.opcoes && currentProblem.opcoes.length > 0)) {
      isCorrect = currentProblem?.multipla_escolha
        ? String(mathAnswer).trim().toLowerCase() === String(currentProblem.multipla_escolha.id_resposta_correta).trim().toLowerCase()
        : String(mathAnswer).trim() === String(currentProblem.resposta_correta).trim();
    } else {"""

math_new = """    if (currentProblem?.tipo_resposta === 'multipla_escolha' || !!currentProblem?.multipla_escolha || currentProblem?.is_multipla_escolha || (currentProblem?.opcoes && currentProblem.opcoes.length > 0)) {
      const givenAns = String(mathAnswer).replace(/\)/g, '').trim().toLowerCase();
      
      if (currentProblem?.multipla_escolha) {
        const correctId = String(currentProblem.multipla_escolha.id_resposta_correta).replace(/\)/g, '').trim().toLowerCase();
        isCorrect = (givenAns === correctId);
      } else {
        const respCorreta = String(currentProblem?.resposta_correta || '').trim().toLowerCase();
        const optionsArray = extractOptions(currentProblem?.enunciado_textual_problema || '', currentProblem?.opcoes).options?.map((opt: any, i: number) => ({ id: String.fromCharCode(65 + i).toLowerCase(), texto: opt })) || [];
        const selectedOption = optionsArray.find((o: any) => o.id === givenAns);
        const selectedText = selectedOption ? String(selectedOption.texto).trim().toLowerCase() : '';
        
        isCorrect = (givenAns === respCorreta.replace(/\)/g, '')) || 
                    (selectedText !== '' && selectedText === respCorreta) ||
                    (selectedText !== '' && respCorreta.includes(selectedText)) ||
                    (respCorreta.startsWith(givenAns + ")"));
      }
    } else {"""

content = content.replace(math_old, math_new)


with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)
