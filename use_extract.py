with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

import re

# Update reading UI
reading_ui_old = """                  <h3 className="text-xl sm:text-2xl font-bold mb-6 text-slate-800 leading-snug">
                    {readingIndex + 1}. {session.atividades_leitura?.[readingIndex]?.enunciado_pergunta}
                  </h3>
                  
                  {(session.atividades_leitura?.[readingIndex]?.is_multipla_escolha || session.atividades_leitura?.[readingIndex]?.tipo_competencia === 'multipla_escolha' || (session.atividades_leitura?.[readingIndex]?.opcoes && session.atividades_leitura[readingIndex].opcoes.length > 0)) && session.atividades_leitura?.[readingIndex]?.opcoes ? (
                    <div className="flex flex-col gap-3">
                      {session.atividades_leitura[readingIndex].opcoes.map((opcao, idx) => ("""

reading_ui_new = """                  <h3 className="text-xl sm:text-2xl font-bold mb-6 text-slate-800 leading-snug">
                    {readingIndex + 1}. {extractOptions(session.atividades_leitura?.[readingIndex]?.enunciado_pergunta || '', session.atividades_leitura?.[readingIndex]?.opcoes).cleanText}
                  </h3>
                  
                  {(session.atividades_leitura?.[readingIndex]?.is_multipla_escolha || session.atividades_leitura?.[readingIndex]?.tipo_competencia === 'multipla_escolha' || extractOptions(session.atividades_leitura?.[readingIndex]?.enunciado_pergunta || '', session.atividades_leitura?.[readingIndex]?.opcoes).options) ? (
                    <div className="flex flex-col gap-3">
                      {extractOptions(session.atividades_leitura?.[readingIndex]?.enunciado_pergunta || '', session.atividades_leitura?.[readingIndex]?.opcoes).options?.map((opcao, idx) => ("""

content = content.replace(reading_ui_old, reading_ui_new)


# Update math UI
math_ui_old = """                  <h3 className="text-xl sm:text-2xl font-bold mb-8 text-slate-800 leading-snug">
                    {session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.enunciado_textual_problema}
                  </h3>
                  
                  {/* Área de resposta matemática */}
                  
                  {(session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.is_multipla_escolha || (session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.opcoes && session.atividades_matematica.bloco_operacoes_problemas[problemIndex].opcoes.length > 0)) && session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.opcoes ? (
                    <div className="flex flex-col gap-3 mb-8">
                      {session.atividades_matematica.bloco_operacoes_problemas[problemIndex].opcoes.map((opcao, idx) => ("""

math_ui_new = """                  <h3 className="text-xl sm:text-2xl font-bold mb-8 text-slate-800 leading-snug">
                    {extractOptions(session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.enunciado_textual_problema || '', session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.opcoes).cleanText}
                  </h3>
                  
                  {/* Área de resposta matemática */}
                  
                  {(session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.is_multipla_escolha || extractOptions(session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.enunciado_textual_problema || '', session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.opcoes).options) ? (
                    <div className="flex flex-col gap-3 mb-8">
                      {extractOptions(session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.enunciado_textual_problema || '', session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.opcoes).options?.map((opcao, idx) => ("""

content = content.replace(math_ui_old, math_ui_new)

with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)
