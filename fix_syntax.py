with open('src/App.tsx', 'r') as f:
    content = f.read()

bad_str = """        }
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential?.accessToken) {
            sessionStorage.setItem("drive_token", credential.accessToken);
          }
        }"""

content = content.replace(bad_str, "        }")

with open('src/App.tsx', 'w') as f:
    f.write(content)

