with open('src/lib/drive.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'throw new Error("Google Drive token not found.");',
    'throw new Error("Google Drive token not found. Por favor, clique em \'Sair\' e faça o login novamente para renovar o acesso.");'
)
content = content.replace(
    'throw new Error("Google Drive token not found. Please log in again.");',
    'throw new Error("Google Drive token not found. Por favor, clique em \'Sair\' e faça o login novamente para renovar o acesso.");'
)

with open('src/lib/drive.ts', 'w') as f:
    f.write(content)
