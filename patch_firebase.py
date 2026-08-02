with open('src/lib/firebase.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "export const db = getFirestore(app);",
    "export const db = getFirestore(app, 'ai-studio-remixhomeschool-e0595e42-b8cd-4146-8818-bd45736d9c2b');"
)

with open('src/lib/firebase.ts', 'w') as f:
    f.write(content)
