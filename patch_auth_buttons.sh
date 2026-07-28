#!/bin/bash
sed -i 's/        if (result) {/        if (result) {\n          const credential = GoogleAuthProvider.credentialFromResult(result);\n          if (credential?.accessToken) {\n            sessionStorage.setItem("drive_token", credential.accessToken);\n            setHasDriveToken(true);\n          }\n        }/g' src/App.tsx

sed -i 's/await signInWithGoogle();/await signInWithGoogle();\n      if (getDriveToken()) setHasDriveToken(true);/g' src/App.tsx
