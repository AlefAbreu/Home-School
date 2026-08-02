with open('src/lib/db.ts', 'r') as f:
    content = f.read()

import re

# Add a timeout to getGamification
content = re.sub(
    r"const docSnap = await getDoc\(docRef\);",
    """// Add a timeout to prevent hanging if offline or DB issues
    const docSnap = await Promise.race([
      getDoc(docRef),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout fetching gamification')), 5000))
    ]);""",
    content
)

with open('src/lib/db.ts', 'w') as f:
    f.write(content)
