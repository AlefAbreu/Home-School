import re

with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

# Fix reading submit logic
read_submit_old = r"    const isMultipleChoice = currentActivity\?\.is_multipla_escolha \|\| currentActivity\?\.tipo_competencia === 'multipla_escolha' \|\| \(currentActivity\?\.opcoes && currentActivity\.opcoes\.length > 0\);\s+if \(isMultipleChoice\) \{\s+const isCorrect = String\(readingAnswer\)\.trim\(\) === String\(currentActivity\?\.resposta_correta\)\.trim\(\);\s+setReadingFeedback\(isCorrect \? \"Correto! Brilhante dedução\.\" : \"Ops, essa não é a resposta correta!\"\);"

read_submit_new = """    const isMultipleChoice = currentActivity?.tipo_resposta === 'multipla_escolha' || !!currentActivity?.multipla_escolha || currentActivity?.is_multipla_escolha || currentActivity?.tipo_competencia === 'multipla_escolha' || (currentActivity?.opcoes && currentActivity.opcoes.length > 0);
    if (isMultipleChoice) {
      const isCorrect = currentActivity?.multipla_escolha 
        ? String(readingAnswer).trim().toLowerCase() === String(currentActivity.multipla_escolha.id_resposta_correta).trim().toLowerCase()
        : String(readingAnswer).trim() === String(currentActivity?.resposta_correta).trim();
      const feedback = currentActivity?.multipla_escolha?.opcoes?.find((o: any) => o.id.toLowerCase() === readingAnswer.toLowerCase())?.feedback_pedagogico;
      setReadingFeedback(isCorrect ? (feedback || "Correto! Brilhante dedução.") : (feedback || "Ops, essa não é a resposta correta!"));"""

content = re.sub(read_submit_old, read_submit_new, content)

# Fix reading UI condition
reading_ui_old = r"\{\(session\.atividades_leitura\?\.\[readingIndex\]\?\.tipo_resposta === 'multipla_escolha' \|\| session\.atividades_leitura\?\.\[readingIndex\]\?\.is_multipla_escolha \|\| session\.atividades_leitura\?\.\[readingIndex\]\?\.tipo_competencia === 'multipla_escolha' \|\| extractOptions\(session\.atividades_leitura\?\.\[readingIndex\]\?\.enunciado_pergunta \|\| '', session\.atividades_leitura\?\.\[readingIndex\]\?\.opcoes\)\.options\) \? \("

reading_ui_new = """{(session.atividades_leitura?.[readingIndex]?.tipo_resposta === 'multipla_escolha' || !!session.atividades_leitura?.[readingIndex]?.multipla_escolha || session.atividades_leitura?.[readingIndex]?.is_multipla_escolha || session.atividades_leitura?.[readingIndex]?.tipo_competencia === 'multipla_escolha' || extractOptions(session.atividades_leitura?.[readingIndex]?.enunciado_pergunta || '', session.atividades_leitura?.[readingIndex]?.opcoes).options) ? ("""

content = re.sub(reading_ui_old, reading_ui_new, content)

# Fix math UI condition
math_ui_old = r"\{\(session\.atividades_matematica\?\.bloco_operacoes_problemas\?\.\[problemIndex\]\?\.tipo_resposta === 'multipla_escolha' \|\| session\.atividades_matematica\?\.bloco_operacoes_problemas\?\.\[problemIndex\]\?\.is_multipla_escolha \|\| extractOptions\(session\.atividades_matematica\?\.bloco_operacoes_problemas\?\.\[problemIndex\]\?\.enunciado_textual_problema \|\| '', session\.atividades_matematica\?\.bloco_operacoes_problemas\?\.\[problemIndex\]\?\.opcoes\)\.options\) \? \("

math_ui_new = """{(session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.tipo_resposta === 'multipla_escolha' || !!session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.multipla_escolha || session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.is_multipla_escolha || extractOptions(session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.enunciado_textual_problema || '', session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.opcoes).options) ? ("""

content = re.sub(math_ui_old, math_ui_new, content)

# Fix math submit condition (just in case)
math_submit_old = r"if \(currentProblem\?\.tipo_resposta === 'multipla_escolha' \|\| currentProblem\?\.is_multipla_escolha \|\| \(currentProblem\?\.opcoes && currentProblem\.opcoes\.length > 0\)\) \{"
math_submit_new = """if (currentProblem?.tipo_resposta === 'multipla_escolha' || !!currentProblem?.multipla_escolha || currentProblem?.is_multipla_escolha || (currentProblem?.opcoes && currentProblem.opcoes.length > 0)) {"""
content = re.sub(math_submit_old, math_submit_new, content)

with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)

