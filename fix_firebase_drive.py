with open('src/lib/firebase.ts', 'r') as f:
    content = f.read()

content = content.replace("provider.addScope('https://www.googleapis.com/auth/drive.appdata');", "")

with open('src/lib/firebase.ts', 'w') as f:
    f.write(content)
