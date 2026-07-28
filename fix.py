import re

with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if "const [syncing, setSyncing]" in line:
        if skip:
            continue
        skip = True
    new_lines.append(line)

content = "".join(new_lines)
# Also need to make sure GoogleAuthProvider is imported
content = content.replace("import { User, onAuthStateChanged } from 'firebase/auth';", "import { User, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';")

with open('src/App.tsx', 'w') as f:
    f.write(content)

