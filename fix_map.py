import re

with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    """{(session.atividades_leitura?.[readingIndex]?.multipla_escolha?.opcoes || extractOptions(session.atividades_leitura?.[readingIndex]?.enunciado_pergunta || '', session.atividades_leitura?.[readingIndex]?.opcoes).options?.map(opt => ({ id: opt.charAt(0), texto: opt, valor: opt }))).map((opcao: any, idx) => {""",
    """{(session.atividades_leitura?.[readingIndex]?.multipla_escolha?.opcoes || extractOptions(session.atividades_leitura?.[readingIndex]?.enunciado_pergunta || '', session.atividades_leitura?.[readingIndex]?.opcoes).options?.map(opt => ({ id: opt.charAt(0), texto: opt, valor: opt })) || []).map((opcao: any, idx) => {"""
)

content = content.replace(
    """{(session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.multipla_escolha?.opcoes || extractOptions(session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.enunciado_textual_problema || '', session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.opcoes).options?.map(opt => ({ id: opt.charAt(0), texto: opt, valor: opt }))).map((opcao: any, idx) => {""",
    """{(session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.multipla_escolha?.opcoes || extractOptions(session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.enunciado_textual_problema || '', session.atividades_matematica?.bloco_operacoes_problemas?.[problemIndex]?.opcoes).options?.map(opt => ({ id: opt.charAt(0), texto: opt, valor: opt })) || []).map((opcao: any, idx) => {"""
)

with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)
