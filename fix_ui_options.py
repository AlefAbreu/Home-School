import re

with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

reading_old = """                        const optText = opcao.texto || opcao.valor || opcao;
                        const optId = opcao.id || String.fromCharCode(65 + idx);
                        const isSelected = readingAnswer === optId || readingAnswer === optText;"""

reading_new = """                        const optText = typeof opcao === 'string' ? opcao : (opcao.texto || opcao.valor || JSON.stringify(opcao));
                        const rawId = opcao.id !== undefined && opcao.id !== null ? String(opcao.id) : String.fromCharCode(65 + idx);
                        const optId = rawId.replace(/\\)/g, '').trim().toUpperCase();
                        const isSelected = readingAnswer === optId;"""

content = content.replace(reading_old, reading_new)

reading_btn_old = """                            onClick={() => setReadingAnswer(optId)}"""
reading_btn_new = """                            onClick={() => setReadingAnswer(optId)}"""
content = content.replace(reading_btn_old, reading_btn_new)


math_old = """                        const optText = opcao.texto || opcao.valor || opcao;
                        const optId = opcao.id || String.fromCharCode(65 + idx);
                        const isSelected = mathAnswer === optId || mathAnswer === optText;"""

math_new = """                        const optText = typeof opcao === 'string' ? opcao : (opcao.texto || opcao.valor || JSON.stringify(opcao));
                        const rawId = opcao.id !== undefined && opcao.id !== null ? String(opcao.id) : String.fromCharCode(65 + idx);
                        const optId = rawId.replace(/\\)/g, '').trim().toUpperCase();
                        const isSelected = mathAnswer === optId;"""

content = content.replace(math_old, math_new)


with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)
