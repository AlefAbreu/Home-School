with open('src/lib/firebase.ts', 'r') as f:
    content = f.read()

content = content.replace("import { getAuth", "import { getFirestore } from 'firebase/firestore';\nimport { getAuth")
content = content.replace("export const auth = getAuth(app);", "export const auth = getAuth(app);\nexport const db = getFirestore(app);")

with open('src/lib/firebase.ts', 'w') as f:
    f.write(content)
