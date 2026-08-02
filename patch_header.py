with open('src/App.tsx', 'r') as f:
    content = f.read()

import re

# Add user email to header
header_content = """        <div className="flex items-center gap-4">
          <div className="hidden md:block text-sm text-slate-500 font-medium">
            {user?.email}
          </div>
          <button
            onClick={logout}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            Sair
          </button>
        </div>"""

content = re.sub(
    r"<button[^>]*onClick=\{logout\}[^>]*>[\s\S]*?Sair\s*</button>",
    header_content,
    content
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
