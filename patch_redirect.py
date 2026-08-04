with open('src/App.tsx', 'r') as f:
    content = f.read()

import re

new_redirect = """        if (result) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential?.accessToken) {
            sessionStorage.setItem('drive_token', credential.accessToken);
          }
        }"""

content = re.sub(
    r"        if \(result\) \{\n          const credential = GoogleAuthProvider\.credentialFromResult\(result\);\n          \n        \}",
    new_redirect,
    content
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
