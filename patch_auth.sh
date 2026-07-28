#!/bin/bash
sed -i "s/import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase\/auth';/import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from 'firebase\/auth';/g" src/lib/firebase.ts

sed -i 's/    const result = await signInWithPopup(auth, provider);/    try {\n      return await signInWithPopup(auth, provider);\n    } catch (popupError: any) {\n      if (popupError.code === "auth\/popup-blocked" || popupError.code === "auth\/popup-closed-by-user") {\n        await signInWithRedirect(auth, provider);\n        return;\n      }\n      throw popupError;\n    }/g' src/lib/firebase.ts
