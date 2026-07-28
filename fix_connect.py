with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the navbar area to include "Conectar Drive" if hasDriveToken is false
old_navbar = '''          {hasDriveToken && (
            <div className="flex gap-2 mr-4">
              <button disabled={syncing} onClick={async () => { setSyncing(true); try { await syncDataFromDrive(); alert("Dados carregados com sucesso do Drive!"); window.location.reload(); } catch(e) { alert("Erro ao carregar do drive"); } setSyncing(false); }} className="px-3 py-2 rounded-full text-sm font-bold bg-green-50 text-green-600 hover:bg-green-100 flex items-center gap-1" title="Carregar do Drive">
                <Download className="w-4 h-4" /> <span className="hidden sm:inline">{syncing ? "..." : "Carregar"}</span>
              </button>
              <button disabled={syncing} onClick={async () => { setSyncing(true); try { await syncDataToDrive(); alert("Dados salvos no Drive com sucesso!"); } catch(e) { alert("Erro ao salvar no drive"); } setSyncing(false); }} className="px-3 py-2 rounded-full text-sm font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center gap-1" title="Salvar no Drive">
                <Upload className="w-4 h-4" /> <span className="hidden sm:inline">{syncing ? "..." : "Salvar"}</span>
              </button>
            </div>
          )}'''

new_navbar = '''          {hasDriveToken ? (
            <div className="flex gap-2 mr-4">
              <button disabled={syncing} onClick={async () => { setSyncing(true); try { await syncDataFromDrive(); alert("Dados carregados com sucesso do Drive!"); window.location.reload(); } catch(e) { alert("Erro ao carregar do drive"); } setSyncing(false); }} className="px-3 py-2 rounded-full text-sm font-bold bg-green-50 text-green-600 hover:bg-green-100 flex items-center gap-1" title="Carregar do Drive">
                <Download className="w-4 h-4" /> <span className="hidden sm:inline">{syncing ? "..." : "Carregar"}</span>
              </button>
              <button disabled={syncing} onClick={async () => { setSyncing(true); try { await syncDataToDrive(); alert("Dados salvos no Drive com sucesso!"); } catch(e) { alert("Erro ao salvar no drive"); } setSyncing(false); }} className="px-3 py-2 rounded-full text-sm font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center gap-1" title="Salvar no Drive">
                <Upload className="w-4 h-4" /> <span className="hidden sm:inline">{syncing ? "..." : "Salvar"}</span>
              </button>
            </div>
          ) : (
            <div className="flex gap-2 mr-4">
               <button onClick={handleLogin} className="px-3 py-2 rounded-full text-sm font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center gap-1" title="Conectar ao Drive">
                <Cloud className="w-4 h-4" /> <span className="hidden sm:inline">Conectar Drive</span>
              </button>
            </div>
          )}'''

content = content.replace(old_navbar, new_navbar)

with open('src/App.tsx', 'w') as f:
    f.write(content)

