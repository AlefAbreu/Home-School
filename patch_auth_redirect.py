with open('src/lib/firebase.ts', 'r') as f:
    content = f.read()

import re
redirect_import = "import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, getRedirectResult } from 'firebase/auth';"
content = re.sub(r"import \{ getAuth.*?\} from 'firebase/auth';", redirect_import, content)

check_redirect = """
// Check for redirect result on load
getRedirectResult(auth).then((result) => {
  if (result) {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      localStorage.setItem('drive_token', credential.accessToken);
    }
  }
}).catch(console.error);

export const signInWithGoogle = async () => {
"""

content = content.replace("export const signInWithGoogle = async () => {", check_redirect)

with open('src/lib/firebase.ts', 'w') as f:
    f.write(content)
