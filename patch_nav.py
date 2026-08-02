with open('src/App.tsx', 'r') as f:
    content = f.read()

import re

nav_content = """          </button>
          <div className="text-sm font-medium text-slate-500 hidden md:block bg-slate-100 px-3 py-1.5 rounded-full">
            {user?.email}
          </div>
          <button
            onClick={logout}"""

content = re.sub(
    r"</button>\s*<button\s*onClick=\{logout\}",
    nav_content,
    content
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
