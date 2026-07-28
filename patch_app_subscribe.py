with open('src/App.tsx', 'r') as f:
    content = f.read()

import re

content = re.sub(
    r"unsubscribeSession = subscribeToActiveSession\(\(data\) => {",
    "unsubscribeSession = subscribeToActiveSession(currentUser.uid, (data) => {",
    content
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

with open('src/components/TutorDashboard.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r"const unsubscribe = subscribeToStudentResults\(\(res\) => {",
    "const unsubscribe = subscribeToStudentResults(auth.currentUser!.uid, (res) => {",
    content
)

content = content.replace("import { getStudentResults", "import { auth } from '../lib/firebase';\nimport { getStudentResults")

with open('src/components/TutorDashboard.tsx', 'w') as f:
    f.write(content)
