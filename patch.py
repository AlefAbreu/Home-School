import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { auth, signInWithGoogle, logout } from './lib/firebase';", "import { auth, signInWithGoogle, logout } from './lib/firebase';\nimport { syncDataToDrive, syncDataFromDrive, getDriveToken } from './lib/driveSync';\nimport { Cloud, Download, Upload } from 'lucide-react';")

content = content.replace("const [authLoading, setAuthLoading] = useState(true);", "const [authLoading, setAuthLoading] = useState(true);\n  const [syncing, setSyncing] = useState(false);\n  const [hasDriveToken, setHasDriveToken] = useState(false);")

content = content.replace("setUser(currentUser);", "setUser(currentUser);\n      if (currentUser && getDriveToken()) setHasDriveToken(true);")

navbar_old = '<div className="flex flex-wrap justify-center gap-4">'
navbar_new = '''<div className="flex flex-wrap justify-center items-center gap-4">
          {hasDriveToken && (
            <div className="flex gap-2 mr-4">
              <button disabled={syncing} onClick={async () => { setSyncing(true); try { await syncDataFromDrive(); alert("Dados carregados com sucesso do Drive!"); window.location.reload(); } catch(e) { alert("Erro ao carregar do drive"); } setSyncing(false); }} className="px-3 py-2 rounded-full text-sm font-bold bg-green-50 text-green-600 hover:bg-green-100 flex items-center gap-1" title="Carregar do Drive">
                <Download className="w-4 h-4" /> <span className="hidden sm:inline">{syncing ? "..." : "Carregar"}</span>
              </button>
              <button disabled={syncing} onClick={async () => { setSyncing(true); try { await syncDataToDrive(); alert("Dados salvos no Drive com sucesso!"); } catch(e) { alert("Erro ao salvar no drive"); } setSyncing(false); }} className="px-3 py-2 rounded-full text-sm font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center gap-1" title="Salvar no Drive">
                <Upload className="w-4 h-4" /> <span className="hidden sm:inline">{syncing ? "..." : "Salvar"}</span>
              </button>
            </div>
          )}'''
content = content.replace(navbar_old, navbar_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)
