with open('src/lib/firebase.ts', 'r') as f:
    content = f.read()

import re

# Add scope to provider
content = re.sub(
    r"const provider = new GoogleAuthProvider\(\);",
    """const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');""",
    content
)

with open('src/lib/firebase.ts', 'w') as f:
    f.write(content)
