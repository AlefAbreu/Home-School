#!/bin/bash
sed -i "s/provider.addScope('https:\/\/www.googleapis.com\/auth\/drive.readonly');/provider.addScope('https:\/\/www.googleapis.com\/auth\/drive.appdata');/g" src/lib/firebase.ts

sed -i "s/import { getAuth, GoogleAuthProvider/import { getAuth, GoogleAuthProvider, OAuthProvider/g" src/lib/firebase.ts

sed -i "s/export const signInWithGoogle = async () => {/export const signInWithGoogle = async () => {/g" src/lib/firebase.ts
