with open('src/App.tsx', 'r') as f:
    content = f.read()

import re

# Add import
content = re.sub(
    r"import \{ saveActiveSession, subscribeToActiveSession \} from '\./lib/db';",
    "import { saveActiveSession, subscribeToActiveSession } from './lib/db';\nimport { saveActivityToDrive } from './lib/drive';",
    content
)

# Update handleApprove
approve_content = """  const handleApprove = async () => {
    setIsApproved(true);
    if (sessionData) {
      try {
        await saveActiveSession(sessionData, baseText, true);
        const fileName = `Atividade_${new Date().toISOString().split('T')[0]}.json`;
        await saveActivityToDrive({ sessionData, baseText }, fileName);
        alert('Atividade salva com sucesso no Google Drive na pasta "Painel Tutor"!');
      } catch (error) {
        console.error("Failed to save to Drive:", error);
        alert('Erro ao salvar no Google Drive. Verifique se você concedeu as permissões necessárias.');
      }
    }
  };"""

content = re.sub(
    r"  const handleApprove = \(\) => \{[\s\S]*?\};\n",
    approve_content + "\n",
    content
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
