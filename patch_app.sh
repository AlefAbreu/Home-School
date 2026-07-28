#!/bin/bash
sed -i 's/const \[authLoading, setAuthLoading\] = useState(true);/const \[authLoading, setAuthLoading\] = useState(true);\n  const \[loginError, setLoginError\] = useState<string | null>(null);\n\n  const handleLogin = async () => {\n    setLoginError(null);\n    try {\n      await signInWithGoogle();\n    } catch (err: any) {\n      console.error(err);\n      setLoginError(err.message || "Erro ao fazer login. Tente abrir o app em uma nova aba.");\n    }\n  };/g' src/App.tsx
sed -i 's/onClick={signInWithGoogle}/onClick={handleLogin}/g' src/App.tsx
