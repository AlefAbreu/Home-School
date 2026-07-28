with open('src/lib/db.ts', 'r') as f:
    content = f.read()

import re

content = re.sub(
    r"export const subscribeToActiveSession = \(callback: \(data: any\) => void\) => {\s+const uid = auth\.currentUser\?\.uid;\s+if \(!uid\) return \(\) => {};",
    "export const subscribeToActiveSession = (uid: string, callback: (data: any) => void) => {\\n  if (!uid) return () => {};",
    content
)

content = re.sub(
    r"export const subscribeToStudentResults = \(callback: \(results: StudentResult\[\]\) => void\) => {\s+const uid = auth\.currentUser\?\.uid;\s+if \(!uid\) return \(\) => {};",
    "export const subscribeToStudentResults = (uid: string, callback: (results: StudentResult[]) => void) => {\\n  if (!uid) return () => {};",
    content
)

with open('src/lib/db.ts', 'w') as f:
    f.write(content)
