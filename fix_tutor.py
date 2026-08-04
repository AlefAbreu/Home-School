with open('src/components/TutorDashboard.tsx', 'r') as f:
    content = f.read()

import re
content = re.sub(
    r"      \)\}\n      \)\}\n    </div>",
    "      )}\n    </div>",
    content
)

with open('src/components/TutorDashboard.tsx', 'w') as f:
    f.write(content)
