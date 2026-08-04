with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

import re

# Patch reading submit
content = re.sub(
    r'const isMultipleChoice = currentActivity\?\.is_multipla_escolha;',
    r"const isMultipleChoice = currentActivity?.is_multipla_escolha || currentActivity?.tipo_competencia === 'multipla_escolha' || (currentActivity?.opcoes && currentActivity.opcoes.length > 0);",
    content
)

# Patch math submit
content = re.sub(
    r'if \(currentProblem\?\.is_multipla_escolha\) \{',
    r"if (currentProblem?.is_multipla_escolha || (currentProblem?.opcoes && currentProblem.opcoes.length > 0)) {",
    content
)

# Patch reading UI
content = re.sub(
    r'\{session\.atividades_leitura\?\.\[readingIndex\]\?\.is_multipla_escolha && session\.atividades_leitura\?\.\[readingIndex\]\?\.opcoes \? \(',
    r"{(session.atividades_leitura?.[readingIndex]?.is_multipla_escolha || session.atividades_leitura?.[readingIndex]?.tipo_competencia === 'multipla_escolha' || (session.atividades_leitura?.[readingIndex]?.opcoes && session.atividades_leitura[readingIndex].opcoes.length > 0)) && session.atividades_leitura?.[readingIndex]?.opcoes ? (",
    content
)

# Patch math UI
content = re.sub(
    r'\{session\.atividades_matematica\?\.bloco_operacoes_problemas\?\.\[problemIndex\]\?\.is_multipla_escolha && session\.atividades_matematica\?\.bloco_operacoes_problemas\?\.\[problemIndex\]\?\.opcoes \? \(',
    r"{(session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.is_multipla_escolha || (session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.opcoes && session.atividades_matematica.bloco_operacoes_problemas[problemIndex].opcoes.length > 0)) && session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.opcoes ? (",
    content
)

with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)
