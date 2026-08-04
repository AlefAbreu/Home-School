with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "alert('Erro ao salvar no Google Drive. Verifique se você concedeu as permissões necessárias.');",
    "alert('Erro ao salvar no Google Drive: ' + (error instanceof Error ? error.message : 'Verifique se você concedeu as permissões necessárias.'));"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
