#!/bin/bash
sed -i 's/import { User, onAuthStateChanged } from "firebase\/auth";/import { User, onAuthStateChanged, GoogleAuthProvider } from "firebase\/auth";/g' src/App.tsx

sed -i 's/getRedirectResult(auth).catch((error) => {/getRedirectResult(auth).then((result) => {\n        if (result) {\n          const credential = GoogleAuthProvider.credentialFromResult(result);\n          if (credential?.accessToken) {\n            sessionStorage.setItem("drive_token", credential.accessToken);\n          }\n        }\n      }).catch((error) => {/g' src/App.tsx
