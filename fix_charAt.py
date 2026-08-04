import re

with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "options?.map(opt => ({ id: opt.charAt(0), texto: opt, valor: opt }))",
    "options?.map((opt, i) => ({ id: String.fromCharCode(65 + i), texto: opt, valor: opt }))"
)

with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)
